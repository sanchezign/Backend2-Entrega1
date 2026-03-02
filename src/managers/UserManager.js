import User from '../models/User.js';
import CartManager from './CartManager.js';
import bcrypt from 'bcrypt';

export default class UserManager {
  static #instance;

  static getInstance() {
    if (!this.#instance) this.#instance = new UserManager();
    return this.#instance;
  }

  async getUsers() {
    return await User.find().select('-password').lean();
  }

  async getById(id) {
    return await User.findById(id).select('-password').populate('cart').lean();
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    // Si no trae cart → lo creamos automáticamente
    if (!userData.cart) {
      const cartManager = CartManager.getInstance();
      const cart = await cartManager.create();
      userData.cart = cart._id;
    }

    // Encriptación obligatoria
    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    const user = new User(userData);
    return await user.save();
  }

  async update(id, updateData) {
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}