import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import sessionRoutes from './routes/sessions.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import './config/passport-config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
connectDB();

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
app.use(cookieParser());
app.use(passport.initialize());

// Configurar rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', sessionRoutes);


server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
