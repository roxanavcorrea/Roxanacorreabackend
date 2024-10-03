import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url'; 
import connectDB from './config/db.js'; 
import dotenv from 'dotenv'; 

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

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
    layoutsDir: path.join(__dirname, '../views/layouts'), // Asegúrate de que sea correcto
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views')); // Asegúrate de que sea correcto

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
