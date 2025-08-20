import PaymentMethod from '../models/PaymentMethod.js';

export const getUserPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ 
      user: req.user._id,
      activo: true 
    }).sort({ esPorDefecto: -1, createdAt: -1 });

    res.json({
      paymentMethods,
      totalPaymentMethods: paymentMethods.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const getPaymentMethodById = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }

    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const createPaymentMethod = async (req, res) => {
  try {
    const paymentData = { ...req.body, user: req.user._id };

    // Si es método por defecto, desactivar otros
    if (paymentData.esPorDefecto) {
      await PaymentMethod.updateMany(
        { user: req.user._id },
        { esPorDefecto: false }
      );
    }

    const paymentMethod = new PaymentMethod(paymentData);
    await paymentMethod.save();

    res.status(201).json(paymentMethod);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear método de pago', error: error.message });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    // Si es método por defecto, desactivar otros
    if (req.body.esPorDefecto) {
      await PaymentMethod.updateMany(
        { user: req.user._id },
        { esPorDefecto: false }
      );
    }

    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }

    res.json(paymentMethod);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar método de pago', error: error.message });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { activo: false },
      { new: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }

    res.json({ message: 'Método de pago desactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};