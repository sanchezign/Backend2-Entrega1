# Backend II - Entrega N°1  
**CRUD de Usuarios + Autenticación y Autorización con JWT y Passport**

Proyecto desarrollado para la **Entrega N°1** del curso Backend II

Implementación completa de:
- Modelo de Usuario con todos los campos requeridos
- Encriptación de contraseña con bcrypt
- Estrategia Passport "current" con JWT desde cookie httpOnly
- Login con generación de token JWT
- Ruta protegida `/api/sessions/current`
- CRUD completo de usuarios protegido con JWT + rol admin para delete
- Creación automática de carrito al registrar usuario

## Tecnologías utilizadas

- Node.js + Express
- MongoDB Atlas + Mongoose + mongoose-paginate-v2
- JWT (jsonwebtoken) + Passport + passport-jwt
- bcrypt
- cookie-parser
- express-handlebars
- Socket.IO (heredado)

## Instalación

1. Clonar repositorio
   ```bash
   git clone https://github.com/sanchezign/Backend2-Entrega1.git
   cd Backend2-Entrega1

Instalar dependenciasBashnpm install
Crear .env (copia de .env.example)envPORT=8080
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/backend-entrega1
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_2025
IniciarBashnpm start

→ http://localhost:8080
Endpoints clave cumpliendo consigna

































































MétodoRutaDescripciónAutenticaciónPOST/api/sessions/registerRegistro (crea carrito automáticamente)PúblicaPOST/api/sessions/loginLogin → JWT en cookie httpOnlyPúblicaGET/api/sessions/currentDatos del usuario logueado (estrategia "current")JWTGET/api/sessions/logoutElimina cookiePúblicaGET/api/usersLista usuariosJWTGET/api/users/:uidUsuario por IDJWTPOST/api/usersCrea usuario (solo admin)JWT + adminPUT/api/users/:uidActualiza usuarioJWTDELETE/api/users/:uidElimina usuarioJWT + admin
Puntos de la consigna cumplidos

 Modelo User con todos los campos + email único + role default 'user'
 Encriptación con bcrypt.hashSync
 Estrategias Passport configuradas para el modelo
 Login con JWT + cookie httpOnly
 Ruta /api/sessions/current con estrategia "current"
 Validación segura (401 si token inválido/inexistente)
 Creación automática de carrito al registrar
 CRUD completo de usuarios protegido

Notas adicionales

Vista /products pública con paginación y botones condicionales
Solo admin puede eliminar productos/usuarios
Código modular (routers, managers, models)
Preparado para real-time con Socket.IO







