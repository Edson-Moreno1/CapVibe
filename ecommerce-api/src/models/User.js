import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  }
}, {
  timestamps: true
});

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(password) {
  
  // --- AÑADIR ESTOS LOGS ---
  console.log('--- DEBUG: User.js (comparePassword) ---');
  console.log('Password recibida (texto plano):', password);
  console.log('Hash almacenado (en this.password):', this.password);
  
  // 3. Ejecutamos la comparación
  const isMatch = await bcrypt.compare(password, this.password);
  
  // 4. Imprimimos el resultado
  console.log('Resultado de bcrypt.compare (isMatch):', isMatch);
  // ------------------------------------

  return isMatch;
};

export default mongoose.model('User', userSchema);