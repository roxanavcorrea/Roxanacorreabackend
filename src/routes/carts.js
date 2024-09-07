import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const cartsFile = join(__dirname, '../data/carrito.json');
const productsFile = join(__dirname, '../data/productos.json'); 

function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`Leyendo ERROR ${filename}:`, err);
        return [];
    }
}

function writeJSONFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        console.log(`Error escribiendo ${filename}:`, err);
    }
}

let carts = readJSONFile(cartsFile);
let products = readJSONFile(productsFile); 

// GET todos los carritos
router.get('/', (req, res) => {
    res.json(carts);
});

// GET carrito por ID
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

// POST nuevo carrito
router.post('/', (req, res) => {
    const id = carts.length + 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    writeJSONFile(cartsFile, carts);
    res.status(201).json(newCart);
});

// POST agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid));
    const product = products.find(p => p.id === parseInt(pid));

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === parseInt(pid));

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: parseInt(pid), quantity: 1 });
    }

    writeJSONFile(cartsFile, carts);
    res.json(cart);
});

export default router;
