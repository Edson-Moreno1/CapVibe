import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para registro de usuario
export const validateUserRegistration = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  handleValidationErrors
];

// Validaciones para productos
export const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto es requerido'),
  
  body('price')
    .isNumeric()
    .withMessage('El precio debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor a 0'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  
  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida'),
  
  handleValidationErrors
];

// Validador personalizado para ObjectId
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Middleware para validar parámetros ObjectId
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .custom(isValidObjectId)
    .withMessage(`${paramName} debe ser un ObjectId válido`),
  handleValidationErrors
];

// Validación mejorada para productos con ObjectId
export const validateProductImproved = [
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('price')
    .isNumeric()
    .withMessage('El precio debe ser un número')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser mayor a 0.01'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  
  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .custom(isValidObjectId)
    .withMessage('La categoría debe ser un ObjectId válido'),
  
  handleValidationErrors
];