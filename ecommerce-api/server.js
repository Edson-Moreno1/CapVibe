import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar logger
import logger from './src/config/logger.js';

// Para resolver __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import userRoutes from './src/routes/users.js';
import orderRoutes from './src/routes/orders.js';
import cartRoutes from './src/routes/cart.js';
import categoryRoutes from './src/routes/categories.js';
import shippingAddressRoutes from './src/routes/shippingAddresses.js';
import paymentMethodRoutes from './src/routes/paymentMethods.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// config para  codespace quitar cuando este en  local 

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos para imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de logging básico
app.use((req, res, next) => {
  logger.info('Request recibido', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
});

// Conexión MongoDB
import dbConnection from './src/config/database.js';
dbConnection();

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'CapVibe API funcionando' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});