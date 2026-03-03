# Backend II - Entrega N°1  
**CRUD de Usuarios + Autenticación y Autorización con JWT y Passport**

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
   
       git clone https://github.com/sanchezign/Backend2-Entrega1.git
       cd Backend2-Entrega1

2. Instalar dependencias
         
    npm install

3. Crear .env

       PORT=8080
       MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/backend-entrega1
       JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_2025

 4. Iniciar

        npm start    



## Endpoints clave:

  Método,Ruta,Descripción,Autenticación  
  POST,/api/sessions/register,Registro (crea carrito automáticamente),Pública  
  POST,/api/sessions/login,Login → JWT en cookie httpOnly,Pública  
  GET,/api/sessions/current,"Datos del usuario logueado (estrategia ""current"")",JWT  
  GET,/api/sessions/logout,Elimina cookie,Pública  
  GET,/api/users,Lista usuarios,JWT  
  GET,/api/users/:uid,Usuario por ID,JWT  
  POST,/api/users,Crea usuario (solo admin),JWT + admin  
  PUT,/api/users/:uid,Actualiza usuario,JWT  
  DELETE,/api/users/:uid,Elimina usuario,JWT + admin  

## Puntos de la consigna:  

  Modelo User con todos los campos + email único + role default 'user'  
  Encriptación con bcrypt.hashSync  
  Estrategias Passport configuradas para el modelo  
  Login con JWT + cookie httpOnly  
  Ruta /api/sessions/current con estrategia "current"  
  Validación segura (401 si token inválido/inexistente)  
  Creación automática de carrito al registrar  
  CRUD completo de usuarios protegido  

## Notas adicionales:

  Vista /products pública con paginación y botones condicionales  
  Solo admin puede eliminar productos/usuarios  
  Código modular (routers, managers, models)  
  Preparado para real-time con Socket.IO  





























































