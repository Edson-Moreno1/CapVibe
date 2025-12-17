import { Category } from "./category.interface";

export type ProductSize = 'S/M'| 'L/XL'| 'Ajustable';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  // Haz opcionales los que dan guerra por ahora:
  stock?: number;
  category?: string | Category;
  brand?: string;
  size?: ProductSize;
  color?: string;
  material?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}