// Router dedicado a las rutas de VISTAS (HTML)
import { Router } from 'express';
const viewsRouter = Router();

// Página principal (home)
viewsRouter.get('/', (req, res) => {
    res.render('home');           
});

viewsRouter.get('/chat', (req, res) => {
    res.render('chat');
});

viewsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
});

export default viewsRouter;