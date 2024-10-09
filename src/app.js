import express from 'express';
import product from './data/models/product.js';
import cart from './data/models/cart.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url'; 
import connectDB from './config/db.js'; 
import dotenv from 'dotenv'; 
import mongoose from 'mongoose';

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
connectDB();
console.log(process.env);


// Crear servidor HTTP y configurar Socket.io
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, '../views/layouts'), 
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views')); 

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Conexión a Mongoose
mongoose.connect('mongodb+srv://roxanacorrea33:KNEy2QkPhN7uIvOx@cluster0.qtwb3.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority&appName=Cluster0');

// Rutas
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
app.use('/api/product', productsRouter);
app.use('/api/cart', cartsRouter);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
