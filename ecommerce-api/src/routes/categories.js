import express from 'express';
import { auth, adminAuth } from '../middlewares/auth.js';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';

const router = express.Router();

// GET todas las categorías (PÚBLICO)
router.get('/', getAllCategories);

// GET categoría por ID (PÚBLICO)
router.get('/:id', getCategoryById);

// POST crear categoría (ADMIN)
router.post('/', adminAuth, createCategory);

// PUT actualizar categoría (ADMIN)
router.put('/:id', adminAuth, updateCategory);

// DELETE eliminar categoría (ADMIN)
router.delete('/:id', adminAuth, deleteCategory);

export default router;
