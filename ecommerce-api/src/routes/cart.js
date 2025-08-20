import express from 'express';
import { auth } from '../middlewares/auth.js';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update/:productId', auth, updateCartItem);
router.delete('/remove/:productId', auth, removeFromCart);
router.delete('/clear', auth, clearCart);

export default router;