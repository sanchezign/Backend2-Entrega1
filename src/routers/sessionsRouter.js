import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserManager from '../managers/UserManager.js';
import passport from 'passport';

const router = Router();
const userManager = UserManager.getInstance();

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await userManager.getByEmail(email);
    if (exists) return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });

    const newUser = await userManager.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res.status(201).json({ status: 'success', message: 'Usuario registrado', user: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userManager.getByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('coderCookieToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ status: 'success', message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  const user = req.user.toObject();
  delete user.password; // nunca devolvemos la contraseña
  res.json({ status: 'success', user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('coderCookieToken');
  res.json({ status: 'success', message: 'Logout exitoso' });
});

export default router;