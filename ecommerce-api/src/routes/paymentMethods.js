import express from 'express';
import { auth } from '../middlewares/auth.js';
import { 
  getUserPaymentMethods, 
  getPaymentMethodById, 
  createPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from '../controllers/paymentMethodController.js';

const router = express.Router();

// GET todos los métodos de pago del usuario
router.get('/', auth, getUserPaymentMethods);

// GET método de pago por ID
router.get('/:id', auth, getPaymentMethodById);

// POST crear nuevo método de pago
router.post('/', auth, createPaymentMethod);

// PUT actualizar método de pago
router.put('/:id', auth, updatePaymentMethod);

// DELETE desactivar método de pago
router.delete('/:id', auth, deletePaymentMethod);

export default router;