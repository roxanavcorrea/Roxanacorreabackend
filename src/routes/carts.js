import express from 'express';
import passport from 'passport';
import Ticket from '../data/models/ticket.js';
import Cart from '../data/models/cart.js';
import Product from '../data/models/product.js';
import { authorizeRole } from '../middlewares/authorizeRole.js'; // Middleware para roles

const router = express.Router();

// Ruta para agregar productos al carrito
router.post('/:cid/products', 
    passport.authenticate('current', { session: false }), 
    authorizeRole('user'), 
    async (req, res) => {
        try {
            const { cid } = req.params; 
            const { productId, quantity } = req.body; 

            // Verifica que el carrito exista
            const cart = await Cart.findById(cid);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

            // Verificando que el producto exista
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

            // Para agregar el producto al carrito o actualizar la cantidad
            const existingProduct = cart.products.find(item => item.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();

            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    }
);

// Ruta para procesar la compra
router.post('/:cid/purchase', passport.authenticate('current', { session: false }), async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productsNotProcessed = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                // Restar del stock del producto
                product.stock -= item.quantity;
                await product.save();

                // Calcular el monto total de la compra
                totalAmount += product.price * item.quantity;
            } else {
                // Si no hay stock suficiente, agregar a los no procesados
                productsNotProcessed.push(product._id);
            }
        }

        // Filtrar los productos comprados del carrito
        cart.products = cart.products.filter((item) =>
            productsNotProcessed.includes(item.product._id)
        );
        await cart.save();

        // Crear el ticket
        if (totalAmount > 0) {
            const ticket = await Ticket.create({
                code: `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                amount: totalAmount,
                purchaser: req.user.email,
            });
            return res.json({ ticket, productsNotProcessed });
        }

        res.json({ message: 'No se pudo procesar la compra', productsNotProcessed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
