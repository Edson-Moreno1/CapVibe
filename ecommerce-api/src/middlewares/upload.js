import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear directorio uploads/products si no existe
    const uploadPath = path.join(process.cwd(), 'uploads', 'products');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + fileExtension);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Tipos de imagen permitidos
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn('Intento de subir archivo no válido', {
      mimetype: file.mimetype,
      originalname: file.originalname,
      ip: req.ip
    });
    cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG, WebP)'), false);
  }
};

// Configuración del middleware de multer
export const uploadProductImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 5 // Máximo 5 archivos
  }
}).array('images', 5); // Campo 'images', máximo 5 archivos

// Middleware para manejar errores de multer
export const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error('Error de multer:', {
      error: error.message,
      code: error.code,
      ip: req.ip
    });

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'Error de archivo',
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Error de archivo',
        error: 'Demasiados archivos. Máximo permitido: 5'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Error de archivo',
        error: 'Campo de archivo inesperado'
      });
    }
  }

  if (error.message.includes('Solo se permiten archivos de imagen')) {
    return res.status(400).json({
      message: 'Error de archivo',
      error: error.message
    });
  }

  next(error);
};