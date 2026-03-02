import 'dotenv/config';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import jwt from 'jsonwebtoken';  // ← nuevo: para validar JWT manualmente en sockets

import { __dirname } from './utils.js';
import connectToDB from './config/db.config.js';

// Routers
import viewsRouter    from './routers/viewsRouter.js';
import productsRouter from './routers/productsRouter.js';
import cartsRouter    from './routers/cartsRouter.js';
import sessionsRouter from './routers/sessionsRouter.js';
import usersRouter    from './routers/usersRouter.js';

// Cargar Passport (estrategia JWT "current")
import './config/passport.config.js';

// Manager para eventos real-time
import ProductManager from './managers/ProductManager.js';
const productManager = ProductManager.getInstance();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Passport sin sesiones (JWT)
app.use(passport.initialize());

// Handlebars
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users',    usersRouter);
app.use('/',             viewsRouter);

// Conexión DB
connectToDB();

// Servidor HTTP + Socket.IO
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
app.set('socketio', io);

// Middleware para autenticar sockets (se ejecuta en cada conexión)
io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('coderCookieToken=')[1]?.split(';')[0];

    if (!token) {
        return next(new Error('Autenticación requerida para socket'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;  // ← guardamos el usuario decodificado en el socket
        next();
    } catch (error) {
        next(new Error('Token inválido'));
    }
});

// Eventos Socket.IO - ahora con autenticación
io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado → socket id: ${socket.id} | Usuario: ${socket.user?.email || 'Anónimo'}`);

    // Agregar producto (solo admin)
    socket.on('addProduct', async (productData) => {
        if (!socket.user || socket.user.role !== 'admin') {
            return socket.emit('error', { message: 'Solo administradores pueden agregar productos' });
        }

        try {
            const newProduct = await productManager.create(productData);
            io.emit('newProduct', newProduct);          // Notificar a todos
            socket.emit('productAdded', { success: true, product: newProduct });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Eliminar producto (solo admin)
    socket.on('deleteProduct', async (pid) => {
        if (!socket.user || socket.user.role !== 'admin') {
            return socket.emit('error', { message: 'Solo administradores pueden eliminar productos' });
        }

        try {
            await productManager.delete(pid);
            io.emit('productDeleted', { id: pid });     // Notificar a todos
            socket.emit('productDeletedSuccess', { id: pid });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado → socket id: ${socket.id}`);
    });
});

export default app;
