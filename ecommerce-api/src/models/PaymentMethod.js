import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipo: {
    type: String,
    enum: ['tarjeta_credito', 'tarjeta_debito', 'paypal', 'oxxo', 'transferencia'],
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  // Para tarjetas
  numeroTarjeta: {
    type: String,
    select: false // No mostrar en consultas por seguridad
  },
  fechaVencimiento: {
    type: String,
    select: false
  },
  nombreTitular: {
    type: String
  },
  // Para otros métodos
  email: {
    type: String // Para PayPal
  },
  telefono: {
    type: String // Para OXXO
  },
  esPorDefecto: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('PaymentMethod', paymentMethodSchema);
