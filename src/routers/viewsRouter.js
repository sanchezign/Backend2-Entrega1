import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = ProductManager.getInstance();

// Home (pública)
router.get('/', async (req, res) => {
  res.render('home', {
    title: 'Proyecto con MongoDB, carritos, paginación y vistas Handlebars',
    user: req.user || null
  });
});

// Lista de productos con paginación y filtros
// → SIN AUTENTICACIÓN: ruta pública para que todos vean el catálogo
router.get('/products', async (req, res) => {
  try {
    // 1. Lectura y sanitización de query params
    const limit   = Math.max(1, Math.min(100, parseInt(req.query.limit) || 50));
    const page    = Math.max(1, parseInt(req.query.page) || 1);
    const sortStr = req.query.sort === 'desc' ? 'desc' : 'asc';
    const query   = (req.query.query || '').trim();

    // 2. Opciones de paginación
    const options = {
      limit,
      page,
      lean: true,
      sort: sortStr === 'desc' ? { price: -1 } : { price: 1 },
    };

    // 3. Filtro
    const filter = {};
    if (query) {
      filter.$or = [
        { category: query },
        { title: { $regex: query, $options: 'i' } }
      ];
    }

    // 4. Consulta paginada
    const result = await productManager.getProducts(filter, options);

    // 5. Links de paginación
    const queryParams = new URLSearchParams(req.query);

    const prevLink = result.hasPrevPage
      ? `/products?${new URLSearchParams({
          ...Object.fromEntries(queryParams),
          page: result.prevPage.toString(),
        }).toString()}`
      : null;

    const nextLink = result.hasNextPage
      ? `/products?${new URLSearchParams({
          ...Object.fromEntries(queryParams),
          page: result.nextPage.toString(),
        }).toString()}`
      : null;

    // 6. Render de la vista (pasamos user si está logueado, aunque la ruta sea pública)
    res.render('products', {
      docs:          result.docs          || [],
      page:          result.page          || 1,
      totalPages:    result.totalPages    || 1,
      hasPrevPage:   result.hasPrevPage   || false,
      hasNextPage:   result.hasNextPage   || false,
      prevLink,
      nextLink,
      query,
      sort:          sortStr,
      user:          req.user || null,          // ← si está logueado, lo tenemos (por si hay rutas protegidas antes)
      cartId:        req.user?.cart || null,
      isAdmin:       req.user?.role === 'admin' || false,
      debugInfo: {
        totalDocs: result.totalDocs ?? 'no disponible',
        filterApplied: !!Object.keys(filter).length,
        limitApplied: limit,
      }
    });

  } catch (error) {
    console.error('[GET /products] Error:', error.message, error.stack);
    res.status(500).render('error', {
      message: 'Error al cargar los productos. Intenta nuevamente más tarde.'
    });
  }
});

export default router;
