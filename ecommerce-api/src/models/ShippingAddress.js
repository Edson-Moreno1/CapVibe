import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  calle: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  codigoPostal: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    default: 'México'
  },
  esPorDefecto: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ShippingAddress', shippingAddressSchema);