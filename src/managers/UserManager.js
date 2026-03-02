import User from '../models/User.js';
import bcrypt from 'bcrypt';
import CartManager from './CartManager.js';

export default class UserManager {
    static #instance;

    static getInstance() {
        if (!this.#instance) this.#instance = new UserManager();
        return this.#instance;
    }

    /**
     * Obtiene todos los usuarios (sin contraseña)
     */
    async getUsers() {
        return await User.find()
            .select('-password')
            .lean();
    }

    /**
     * Busca un usuario por ID, populando el carrito
     * @returns {Object|null} usuario con cart populado (sin password)
     */
    async getById(id) {
        if (!id) return null;
        return await User.findById(id)
            .select('-password')
            .populate('cart')
            .lean();
    }

    /**
     * Busca un usuario por email (devuelve el documento completo, con password)
     * Útil para login
     */
    async getByEmail(email) {
        if (!email) return null;
        return await User.findOne({ email });
    }

    /**
     * Crea un nuevo usuario
     * - Crea carrito automáticamente si no viene uno
     * - Encripta la contraseña
     * - Retorna el usuario creado (sin password + cart populado)
     */
    async create(userData) {
        try {
            // 1. Validación mínima de campos obligatorios
            if (!userData.first_name || !userData.last_name || !userData.email || !userData.age || !userData.password) {
                throw new Error('Faltan campos obligatorios: first_name, last_name, email, age, password');
            }

            // 2. Verificar si el email ya existe
            const existing = await this.getByEmail(userData.email);
            if (existing) {
                throw new Error('El email ya está registrado');
            }

            // 3. Crear carrito si no viene uno
            if (!userData.cart) {
                const cartManager = CartManager.getInstance();
                const newCart = await cartManager.create();
                userData.cart = newCart._id;
            }

            // 4. Encriptar contraseña
            if (userData.password) {
                userData.password = bcrypt.hashSync(userData.password, 10);
            }

            // 5. Crear y guardar el usuario
            const user = new User(userData);
            await user.save();

            // 6. Retornar versión limpia (sin password + cart populado)
            return await this.getById(user._id);
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    /**
     * Actualiza un usuario
     * - Encripta contraseña si se envía nueva
     * - Retorna versión actualizada sin password
     */
    async update(id, updateData) {
        try {
            if (!id) throw new Error('ID requerido');

            // Encriptar nueva contraseña si se envía
            if (updateData.password) {
                updateData.password = bcrypt.hashSync(updateData.password, 10);
            }

            const updated = await User.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            )
                .select('-password')
                .lean();

            if (!updated) throw new Error('Usuario no encontrado');

            return updated;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    /**
     * Elimina un usuario por ID
     */
    async delete(id) {
        try {
            if (!id) throw new Error('ID requerido');

            const deleted = await User.findByIdAndDelete(id);
            if (!deleted) throw new Error('Usuario no encontrado');

            // Opcional: eliminar el carrito asociado si se desea
            // if (deleted.cart) await CartManager.getInstance().delete(deleted.cart);

            return { message: 'Usuario eliminado correctamente', id };
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}
