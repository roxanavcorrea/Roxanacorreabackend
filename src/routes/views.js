import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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
router.get('/realtimeproducts', (req, res) => {
    const products = readJSONFile(productsFile);
    res.render('realTimeProducts', { products });
});

export default router;
