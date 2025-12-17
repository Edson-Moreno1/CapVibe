export interface OrderData {
  orderId: string;
  orderNumber?: string; // Agregado porque tu HTML lo pide
  total: number;
  date: string; // Puede ser Date o string
  shippingInfo?: { // Agregamos el objeto anidado que tu HTML usa
    nombre: string;
    correo: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigopostal: string;
  };
  items?: any[];
}