import { CartItem } from "./cart";


export interface OrderData{
    items: CartItem[];
    total: number;
    shippingInfo: {
        nombre: string;
        correo: string;
        direccion: string;
        ciudad: string;
        estado: string;
        codigopostal: string;
    };
    orderNumber: string;
    date: string;
}

export interface ShippingInfo{
    nombre: string;
    correo: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigopostal: string;
}