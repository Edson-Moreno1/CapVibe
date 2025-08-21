import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;

    await mongoose.connect(dbURI, {
      // Opciones adicionales si son necesarias
    });

    console.log('MongoDB conectado exitosamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnection;