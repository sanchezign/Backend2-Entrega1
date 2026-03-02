// src/app.js

import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { __dirname } from './utils.js';
// import connectToDB from './config/db.config.js';       -Descomentar cuando use MongoDB

// Routers
import viewsRouter    from './routers/viewsRouter.js';
import productsRouter from './routers/productsRouter.js';
import cartsRouter    from './routers/cartsRouter.js';
import sessionsRouter from './routers/sessionsRouter.js';   // ← nuevo
import usersRouter    from './routers/usersRouter.js';      // ← nuevo

// Cargar configuración de Passport (estrategia JWT "current")
import './config/passport.config.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ────────────────────────────────────────────────
// Middlewares
// ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());                        // Necesario para leer jwt de cookie

// Inicializamos Passport (sin sesiones → JWT stateless)
app.use(passport.initialize());

// ────────────────────────────────────────────────
// Motor de plantillas Handlebars
// ────────────────────────────────────────────────
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// ────────────────────────────────────────────────
// Rutas
// ────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);
app.use('/api/sessions', sessionsRouter);       // login, register, current, logout
app.use('/api/users',    usersRouter);          // CRUD usuarios (entrega requerida)

app.use('/',             viewsRouter);          // vistas principales (home, login, register, profile, etc.)

// ────────────────────────────────────────────────
// Conexión a base de datos
// ────────────────────────────────────────────────
//  connectToDB();     -Descomentar cuando use MongoDB

// ────────────────────────────────────────────────
// Servidor HTTP + WebSocket
// ────────────────────────────────────────────────
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

app.set('socketio', io); // para poder usarlo desde los routers si es necesario

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado → socket id: ${socket.id}`);

    // Aquí irían los eventos de productos en tiempo real que ya tenías
    // Ejemplo:
    // socket.on('addProduct', async (data) => { ... });
    // socket.on('deleteProduct', async (pid) => { ... });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado → socket id: ${socket.id}`);
    });
});

export default app;