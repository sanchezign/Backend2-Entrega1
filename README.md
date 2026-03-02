Implementación completa de una **API REST de e-commerce** con productos, carritos, persistencia en **MongoDB Atlas**, paginación profesional, vistas Handlebars y lógica avanzada de gestión de carritos.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-blue?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-orange?style=flat-square)
![Handlebars](https://img.shields.io/badge/Handlebars-7.x-orange?style=flat-square)
![Socket.IO](https://img.shields.io/badge/Socket.IO-real--time-010101?style=flat-square&logo=socket.io)

## Objetivos cumplidos ✓

- Persistencia principal en **MongoDB Atlas** (productos y carritos)
- Endpoints completos y RESTful para productos y carritos (CRUD total)
- **Paginación, ordenamiento y filtros avanzados** en GET /api/products
  - Parámetros: `limit`, `page`, `sort` (asc/desc), `query` (JSON o string)
- Formato de respuesta profesional y consistente:
  - `status`, `payload`, `totalPages`, `prevPage`, `nextPage`, `hasPrevPage`, `hasNextPage`, `prevLink`, `nextLink`
- Gestión completa de carritos:
  - Crear carrito vacío
  - Agregar / eliminar / actualizar cantidades / reemplazar productos
  - Vaciar carrito
  - **Populate** automático de productos en todas las consultas
- Vistas Handlebars funcionales y responsivas:
  - `/` → página principal / bienvenida
  - `/products` → lista paginada con filtros básicos
  - `/products/:pid` → detalle de producto
  - `/carts/:cid` → vista del carrito con productos detallados
- Uso intensivo de `.lean()` para mejor rendimiento en vistas
- Código limpio, modular y escalable (routers separados, managers, models)
- Validaciones en managers + manejo de errores claro
- Preparado para Socket.IO (real-time updates en productos/carritos)


1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sanchezign/Backend.Proyecto.Final.git
   cd Backend.Proyecto.Final  

2. **Instalar dependencias** 

       npm install

Crear y configurar .env

Copia .env.example a .env y completa:
    envPORT=8080
    MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.xxx.mongodb.net/backend-final?retryWrites=true&w=majority

Iniciar el servidor

    Bashnpm start
    # o con nodemon (recomendado)
    npm run dev
    → Servidor corriendo en: http://localhost:8080

-Todos los endpoints respetan formato RESTful

-Se usa .lean() en consultas para vistas → mejor rendimiento

-Populate automático en carritos → productos completos sin consultas extra

-Paginación con links funcionales (prevLink, nextLink)

-Validaciones básicas en managers + manejo de errores

-Preparado para escalar.







