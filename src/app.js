import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;

// Crear servidor HTTP y configurar Socket.io
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar y usar routers
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    socket.on('productAdded', (product) => {
        console.log('Producto añadido:', product);
        io.emit('updateProducts', product);
    });

    socket.on('productDeleted', (productId) => {
        console.log('Producto eliminado:', productId);
        io.emit('removeProduct', productId);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});