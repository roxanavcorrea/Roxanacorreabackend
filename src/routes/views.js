import express from 'express';
import fs from 'fs';

const router = express.Router();

const productsFile = './data/productos.json';

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
router.get('/realtimeproducts', (req, res) => {
    const products = readJSONFile(productsFile);
    res.render('realTimeProducts', { products });
});

export default router;