import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

export default class CartManager {
    static #instance;

    static getInstance() {
        if (!this.#instance) this.#instance = new CartManager();
        return this.#instance;
    }

    /**
     * Crea un nuevo carrito vacío
     * @returns {Promise<Cart>} Carrito recién creado
     */
    async create() {
        try {
            const cart = new Cart({ products: [] });
            return await cart.save();
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    /**
     * Obtiene un carrito por ID con productos populados
     * @param {string} id - ID del carrito
     * @returns {Promise<Cart|null>} Carrito populado o null
     */
    async getById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de carrito inválido');
            }
            return await Cart.findById(id)
                .populate('products.product')
                .lean();
        } catch (error) {
            throw new Error(`Error al obtener carrito: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los carritos (con productos populados)
     * @returns {Promise<Cart[]>}
     */
    async getAll() {
        try {
            return await Cart.find()
                .populate('products.product')
                .lean();
        } catch (error) {
            throw new Error(`Error al listar carritos: ${error.message}`);
        }
    }

    /**
     * Agrega o actualiza la cantidad de un producto en el carrito
     * @param {string} cid - ID del carrito
     * @param {string} pid - ID del producto
     * @param {number} [quantity=1] - Cantidad a sumar
     */
    async addProduct(cid, pid, quantity = 1) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
                throw new Error('ID inválido (carrito o producto)');
            }

            const cart = await Cart.findById(cid);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += Number(quantity);
            } else {
                cart.products.push({ product: pid, quantity: Number(quantity) });
            }

            await cart.save();
            return await this.getById(cid); // retornamos carrito actualizado y populado
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    /**
     * Elimina un producto del carrito
     */
    async removeProduct(cid, pid) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
                throw new Error('ID inválido');
            }

            const updated = await Cart.findByIdAndUpdate(
                cid,
                { $pull: { products: { product: pid } } },
                { new: true }
            ).populate('products.product').lean();

            if (!updated) throw new Error('Carrito no encontrado');

            return updated;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    /**
     * Reemplaza todos los productos del carrito
     */
    async updateProducts(cid, productsArray) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('ID de carrito inválido');
            }

            const updated = await Cart.findByIdAndUpdate(
                cid,
                { products: productsArray.map(p => ({
                    product: p.product,
                    quantity: Number(p.quantity) || 1
                })) },
                { new: true, runValidators: true }
            ).populate('products.product').lean();

            if (!updated) throw new Error('Carrito no encontrado');

            return updated;
        } catch (error) {
            throw new Error(`Error al actualizar productos: ${error.message}`);
        }
    }

    /**
     * Actualiza la cantidad de un producto específico
     */
    async updateProductQuantity(cid, pid, quantity) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
                throw new Error('ID inválido');
            }

            if (quantity < 0) throw new Error('Cantidad no puede ser negativa');

            const updated = await Cart.findOneAndUpdate(
                { _id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': Number(quantity) } },
                { new: true }
            ).populate('products.product').lean();

            if (!updated) throw new Error('Carrito o producto no encontrado');

            return updated;
        } catch (error) {
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    }

    /**
     * Vacía el carrito (elimina todos los productos)
     */
    async clear(cid) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('ID inválido');
            }

            const updated = await Cart.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            ).lean();

            if (!updated) throw new Error('Carrito no encontrado');

            return updated;
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }

    /**
     * Elimina un carrito completo (útil al borrar usuario)
     */
    async delete(cid) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('ID inválido');
            }

            const deleted = await Cart.findByIdAndDelete(cid);
            if (!deleted) throw new Error('Carrito no encontrado');

            return { message: 'Carrito eliminado', id: cid };
        } catch (error) {
            throw new Error(`Error al eliminar carrito: ${error.message}`);
        }
    }
}
