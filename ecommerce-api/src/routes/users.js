import express from 'express';
import { auth, adminAuth } from '../middlewares/auth.js';
import { 
  getAllUsers, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', adminAuth, getAllUsers);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router;