import express from 'express';
import fs from 'fs';

const router = express.Router();

const productsFile = './data/productos.json';

function readJSONFile(filename) { 
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`error leyendo ${filename}:`, err);
        return[];
    }
}

function writeJSONFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null,2));
    } catch (err) {
        console.log(`Error escribiendo ${filename}:`,err);
    }
}

let products = readJSONFile(productsFile);

//get

router.get('/',(req, res) => {
    const limit = req.query.limit;
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts);
});

router.get('/:pid', (req,res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === parseInt(pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto No encontrado'});

    }
    res.json(product);
});

// Post 

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails} = req.body;
const id = products.length + 1;
const newProduct = { id, title, description, code, price, stock, category, thumbnails, status: true};
products.push(newProduct);
writeJSONFile(productsFile, products);
res.status(201).json(newProduct);
});

// PUT

router.put('/:pid', (req, res) => {
    const { pid } =req.params;
    const { title, description, code, price, stock, category,thumbnails} = req.body;

    const product = products.find(p => p.id === parseInt(pid));
    if (!product) {
        return res.status(404).json({ error: 'producto no encontrado'});
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (code) product.code = code;
    if (price) product.price = price; 
    if (stock) product.stock = stock; 
    if (category) product.category = category;
    if (thumbnails) product.thumbnails = thumbnails;

    writeJSONFile(productsFile, products);
    res.json(product);

});

// DELETE 

router.delete ('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt (pid));

    if (productIndex === -1) {
        return res.status(404).json({error: 'producto no encontrado'});
    }
    products.splice(productIndex, 1);
    writeJSONFile(productsFile, products);
    res.status(204).send();
});

module.exports = router;