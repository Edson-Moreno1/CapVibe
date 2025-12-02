import express from 'express';
import { 
  getAllProducts,      
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { auth } from '../middlewares/auth.js';
import { validateProduct, validateProductImproved, validateObjectId } from '../middlewares/validators.js';

const router = express.Router();

router.get('/', getAllProducts);              
router.get('/:id', validateObjectId('id'), getProductById);

// Aplicar validaciones mejoradas a crear y actualizar productos
router.post('/', auth, validateProductImproved, createProduct);
router.put('/:id', auth, validateObjectId('id'), validateProductImproved, updateProduct);
router.delete('/:id', auth, validateObjectId('id'), deleteProduct);

export default router;