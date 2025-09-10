import mongoose from 'mongoose';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Ya existe un usuario admin:', existingAdmin.email);
      
      // Actualizar el admin existente si es necesario
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin actualizado correctamente');
    } else {
      // Crear nuevo usuario admin
      const adminUser = new User({
        name: 'Admin Test',
        email: 'admin@capvibe.com',
        password: '123456',
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Usuario admin creado exitosamente:', adminUser.email);
    }

    // Verificar que existen categorías
    const categories = await Category.find();
    console.log(`📁 Categorías encontradas: ${categories.length}`);
    
    if (categories.length === 0) {
      console.log('⚠️ No se encontraron categorías. Creando categoría de prueba...');
      const testCategory = new Category({
        name: 'Test Category',
        description: 'Categoría de prueba para tests'
      });
      await testCategory.save();
      console.log('✅ Categoría de prueba creada');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

createAdminUser();
