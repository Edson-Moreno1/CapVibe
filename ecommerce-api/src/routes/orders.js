import express from 'express';
import { auth, adminAuth } from '../middlewares/auth.js';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/my-orders', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.get('/', adminAuth, getAllOrders);
router.put('/:id/status', adminAuth, updateOrderStatus);

export default router;
