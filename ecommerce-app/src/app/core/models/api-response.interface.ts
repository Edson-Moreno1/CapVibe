export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    products?: T;
    totalProducts?: number;
    totalPages?: number;
    currentPage?: number;
}
