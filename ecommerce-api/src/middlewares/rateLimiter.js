import rateLimit from 'express-rate-limit';

// Rate limiter general para la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 requests por ventana de tiempo
  message: {
    error: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
    statusCode: 429
  },
  standardHeaders: true, // Devolver info de rate limit en headers `RateLimit-*`
  legacyHeaders: false // Desactivar headers `X-RateLimit-*`
});

// Rate limiter más estricto para endpoints de autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limitar cada IP a 5 intentos de login por ventana de tiempo
  message: {
    error: 'Demasiados intentos de autenticación, inténtalo de nuevo más tarde.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // No contar requests exitosos
});

// Rate limiter para creación de cuentas
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Limitar cada IP a 3 registros por hora
  message: {
    error: 'Demasiadas cuentas creadas desde esta IP, inténtalo de nuevo más tarde.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para recuperación de contraseña
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // Limitar cada IP a 3 intentos por ventana
  message: {
    error: 'Demasiados intentos de recuperación de contraseña, inténtalo de nuevo más tarde.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});