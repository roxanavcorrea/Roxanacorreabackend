import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import Cart from '../data/models/cart.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const productsFile = join(__dirname, '../data/productos.json');  

function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`Error leyendo ${filename}:`, err);
        return [];
    }
}

// Ruta para la vista home
router.get('/', (req, res) => {
    const products = readJSONFile(productsFile);
    res.render('home', { products });
});

// Ruta para la vista realTimeProducts
router.get('/realtimeproducts.handlebars', (req, res) => {
    const products = readJSONFile(productsFile);
    res.render('realTimeProducts.handlebars', { products });
});

// NUEVA RUTA: Vista de un carrito específico con productos completos
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.render('cart', { products: cart.products });  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
