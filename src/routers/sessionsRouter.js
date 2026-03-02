import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';  
import UserManager from '../managers/UserManager.js';

const router = Router();
const userManager = UserManager.getInstance();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validación manual de campos obligatorios
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos obligatorios: first_name, last_name, email, age, password'
      });
    }

    // Verificar si el email ya existe
    const exists = await userManager.getByEmail(email);
    if (exists) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario (aquí se crea el carrito automáticamente)
    const newUser = await userManager.create({
      first_name,
      last_name,
      email,
      age: Number(age),
      password
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      user: {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
        cart: newUser.cart
      }
    });
  } catch (error) {
    console.error('[POST /register] Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error interno al registrar usuario'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y password son obligatorios'
      });
    }

    const user = await userManager.getByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Guardar token en cookie httpOnly
    res.cookie('coderCookieToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      status: 'success',
      message: 'Login exitoso',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[POST /login] Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error interno al iniciar sesión'
    });
  }
});

// Current (usuario logueado)
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  res.json({
    status: 'success',
    user
  });
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('coderCookieToken');
  res.json({
    status: 'success',
    message: 'Sesión cerrada'
  });
});

export default router;
