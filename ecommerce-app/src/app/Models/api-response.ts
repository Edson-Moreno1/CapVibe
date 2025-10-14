import { Product } from "./products";

export interface ApiResponse {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}