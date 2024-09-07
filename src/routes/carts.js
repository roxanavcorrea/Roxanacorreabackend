import express from 'express';
import fs from 'fs';

const router = express.Router();

const cartsFile = './data/carrito.json';
const productsFile = './data/productos.json';

function readJSONFile(filename){
    try {
        const data = fs.readFileSync(filename,'utf-8' );
        return JSON.parse(data);
    } catch (err) { 
        console.log (`Leyendo ERROR ${filename}:`, err);
        return [];
    }
}

function writeJSONFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        console.log (`error escribiendo ${filename}:`, err);
    }
}

let carts = readJSONFile(cartsFile);
let products = readJSONFile(productsFile);

// GET 

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id === parseInt (cid));

    if (!cart) {
        return res.status(404).json ({ error: 'carrito no encontrado' });
    }

    res.json(cart.products);
});

// POST 

router.post ('/', (req, res) => {
    const id = carts.length + 1 ;
    const newCart = { id, products: []};
    carts.push(newCart);
    writeJSONFile (cartsFile, carts);
    res.status(201).json(newCart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cart = carts.find(c => c.id === parseInt (cid));
    const product = products.find (p => p.id === parseInt(pid));

    if (!cart) {
        return res.status(404).json({error: 'carrito no encontrado'});    
    }
    if (!product) {
        return res.status(404).json ({error: 'producto no encontrado'});   
    }

    const existingProduct = cart.products.find(p => p.id === parseInt (pid));

    if (existingProduct) {
        existingProduct.quantity +=1;
    } else {
        cart.products.push ({product: parseInt(pid),quantity: 1 });
    }

    writeJSONFile(cartsFile, carts);
    res.json(cart);

});

export default router;
