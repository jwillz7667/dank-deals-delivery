// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Cart Types
export interface CartItemDTO {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartDTO {
  id: number;
  userId: string;
  items: CartItemDTO[];
  subtotal: number;
  estimatedTax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartRequest {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

// Order Types
export interface CreateOrderRequest {
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  items: CartItemDTO[];
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  items: OrderItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDTO {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// User Profile Types
export interface UserProfileDTO {
  id: number;
  userId: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  preferredPaymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfileRequest {
  phoneNumber?: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  preferredPaymentMethod?: string;
}

// Validation
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Constants
export const API_ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Business Logic
  CART_EMPTY: 'CART_EMPTY',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES]; 