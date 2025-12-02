import { Category } from "./category.interface";

export type ProductSize = 'S/M'| 'L/XL'| 'Ajustable';

export interface Product{
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string | Category;
    brand: string;
    size: ProductSize;
    material: string;
    color: string;
    images: string[];
    createdAt?: string;
    updatedAt?: string;
}