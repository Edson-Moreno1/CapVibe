import express from 'express';
import { auth } from '../middlewares/auth.js';
import { 
  getUserAddresses, 
  getAddressById, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/shippingAddressController.js';

const router = express.Router();

// GET todas las direcciones del usuario
router.get('/', auth, getUserAddresses);

// GET dirección por ID
router.get('/:id', auth, getAddressById);

// POST crear nueva dirección
router.post('/', auth, createAddress);

// PUT actualizar dirección
router.put('/:id', auth, updateAddress);

// DELETE eliminar dirección
router.delete('/:id', auth, deleteAddress);

export default router;