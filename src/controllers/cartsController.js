import Cart from '../data/models/cart.js';
import Product from '../data/models/product.js';
import Ticket from '../data/models/ticket.js';

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productsNotProcessed = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;
            } else {
                productsNotProcessed.push(product._id);
            }
        }

        cart.products = cart.products.filter((item) =>
            productsNotProcessed.includes(item.product._id)
        );
        await cart.save();

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
};
