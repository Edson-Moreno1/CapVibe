import Product from '../models/Product.js';
import Category from '../models/Category.js';
import logger from '../config/logger.js';

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1,_id:1 });

    const total = await Product.countDocuments({ isActive: true });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    logger.info('Producto obtenido exitosamente', {
      productId: req.params.id,
      ip: req.ip
    });
    
    res.json(product);
  } catch (error) {
    logger.error('Error al obtener producto:', {
      error: error.message,
      productId: req.params.id,
      ip: req.ip
    });

    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de producto inválido',
        error: 'El ID proporcionado no es válido'
      });
    }

    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    // Verificar que la categoría existe
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      logger.warn('Intento de crear producto con categoría inexistente', {
        category: req.body.category,
        ip: req.ip
      });
      return res.status(400).json({
        message: 'Error de validación',
        errors: [{
          field: 'category',
          message: 'La categoría especificada no existe'
        }]
      });
    }

    const product = new Product(req.body);
    await product.save();
    await product.populate('category', 'name');

    logger.info('Producto creado exitosamente', {
      productId: product._id,
      name: product.name,
      category: product.category.name,
      ip: req.ip
    });

    res.status(201).json(product);
  } catch (error) {
    logger.error('Error al crear producto:', {
      error: error.message,
      body: req.body,
      ip: req.ip
    });

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Error de validación',
        errors
      });
    }

    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};