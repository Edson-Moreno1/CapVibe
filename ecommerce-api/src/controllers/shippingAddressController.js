import ShippingAddress from '../models/ShippingAddress.js';

export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await ShippingAddress.find({ user: req.user._id })
      .sort({ esPorDefecto: -1, createdAt: -1 });

    res.json({
      addresses,
      totalAddresses: addresses.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await ShippingAddress.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const addressData = { ...req.body, user: req.user._id };

    // Si es dirección por defecto, desactivar otras
    if (addressData.esPorDefecto) {
      await ShippingAddress.updateMany(
        { user: req.user._id },
        { esPorDefecto: false }
      );
    }

    const address = new ShippingAddress(addressData);
    await address.save();

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear dirección', error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    // Si es dirección por defecto, desactivar otras
    if (req.body.esPorDefecto) {
      await ShippingAddress.updateMany(
        { user: req.user._id },
        { esPorDefecto: false }
      );
    }

    const address = await ShippingAddress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar dirección', error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await ShippingAddress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    res.json({ message: 'Dirección eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};