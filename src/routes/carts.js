import express from 'express';
import Cart from '../data/models/cart.js';
import Product from '../data/models/product.js';

const router = express.Router();

// GET carrito por ID con populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        productInCart.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

