import express from 'express';
import { 
  getAllProducts,      
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { auth } from '../middlewares/auth.js';
import { validateProduct } from '../middlewares/validators.js';

const router = express.Router();

router.get('/', getAllProducts);              
router.get('/:id', getProductById);

// Aplicar validaciones a crear y actualizar productos
router.post('/', auth, validateProduct, createProduct);
router.put('/:id', auth, validateProduct, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;