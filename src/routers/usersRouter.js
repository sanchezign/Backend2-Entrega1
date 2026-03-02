import { Router } from 'express';
import passport from 'passport';
import UserManager from '../managers/UserManager.js';

const router = Router();
const userManager = UserManager.getInstance();
const auth = passport.authenticate('current', { session: false });

// Middleware de autorización (solo admin puede eliminar)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'No autorizado' });
  }
  next();
};

router.get('/', auth, async (req, res) => {
  const users = await userManager.getUsers();
  res.json({ status: 'success', users });
});

router.get('/:uid', auth, async (req, res) => {
  const user = await userManager.getById(req.params.uid);
  user ? res.json({ status: 'success', user }) : res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
});

router.post('/', auth, async (req, res) => {
  const newUser = await userManager.create(req.body);
  res.status(201).json({ status: 'success', user: newUser });
});

router.put('/:uid', auth, async (req, res) => {
  const updated = await userManager.update(req.params.uid, req.body);
  res.json({ status: 'success', user: updated });
});

router.delete('/:uid', auth, isAdmin, async (req, res) => {
  await userManager.delete(req.params.uid);
  res.json({ status: 'success', message: 'Usuario eliminado' });
});

export default router;
