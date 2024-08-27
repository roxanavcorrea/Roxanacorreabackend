import express from 'express';

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products.js', productsRouter);
app.use('/api/carts.js', cartsRouter);

app.listen(PORT, () =>{
    console.log(`servidor escuchando el puerto ${PORT}`);

});

// Verificar porque no me toma el comando en la terminal 
