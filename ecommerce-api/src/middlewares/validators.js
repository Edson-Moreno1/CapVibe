import { body, validationResult } from 'express-validator';

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