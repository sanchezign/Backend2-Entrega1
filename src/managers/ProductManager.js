import Product from '../models/Product.js';
import mongoose from 'mongoose';

export default class ProductManager {
  static #instance;

  static getInstance() {
    if (!this.#instance) this.#instance = new ProductManager();
    return this.#instance;
  }

  async getProducts(filter = {}, options = {}) {
    try {
      const defaultOptions = {
        limit: Number(options.limit) || 10,
        page: Number(options.page) || 1,
        lean: options.lean ?? true,
        sort: options.sort || { price: 1 },
      };

      console.log('[DEBUG ProductManager] Filtro:', filter);
      console.log('[DEBUG ProductManager] Opciones:', defaultOptions);

      const result = await Product.paginate(filter, defaultOptions);

      console.log('[DEBUG ProductManager] Resultado paginate:', {
        docsLength: result.docs.length,
        totalDocs: result.totalDocs,
        page: result.page,
        totalPages: result.totalPages,
      });

      return result;  // ← objeto crudo de paginate (docs, totalDocs, etc.)
    } catch (error) {
      console.error('[ERROR ProductManager.getProducts]', error.message);
      throw error;
    }
  }

  async create(productoRaw) {
    try {
      const required = ['title', 'description', 'code', 'price', 'stock', 'category'];
      for (const campo of required) {
        if (!productoRaw[campo] || String(productoRaw[campo]).trim() === '') {
          throw new Error(`El campo ${campo} es obligatorio y no puede estar vacío`);
        }
      }

      const codeExists = await Product.findOne({ code: productoRaw.code.trim() });
      if (codeExists) {
        throw new Error(`El código ${productoRaw.code} ya está en uso`);
      }

      const nuevo = new Product({
        title: String(productoRaw.title).trim(),
        description: String(productoRaw.description).trim(),
        code: String(productoRaw.code).trim(),
        price: Number(productoRaw.price),
        stock: Number(productoRaw.stock),
        category: String(productoRaw.category).trim(),
        status: productoRaw.status ?? true,
        thumbnails: Array.isArray(productoRaw.thumbnails) ? productoRaw.thumbnails : []
      });

      return await nuevo.save();
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de producto inválido');
    }
    return await Product.findById(id).lean();
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de producto inválido');
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    return deleted;
  }
}
