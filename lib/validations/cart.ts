import { z } from 'zod';

// Constants
export const MAX_QUANTITY = 99;
export const MIN_QUANTITY = 1;
export const MAX_PRODUCT_NAME_LENGTH = 200;
export const MAX_IMAGE_URL_LENGTH = 500;

// Cart item validation
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required').max(50),
  productName: z.string().min(1, 'Product name is required').max(MAX_PRODUCT_NAME_LENGTH),
  productPrice: z.number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .max(9999.99, 'Price cannot exceed $9,999.99'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(MIN_QUANTITY, `Quantity must be at least ${MIN_QUANTITY}`)
    .max(MAX_QUANTITY, `Quantity cannot exceed ${MAX_QUANTITY}`),
  imageUrl: z.string()
    .url('Invalid image URL')
    .max(MAX_IMAGE_URL_LENGTH)
    .optional(),
});

// Add to cart request validation
export const addToCartSchema = cartItemSchema;

// Update cart item validation
export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required').max(50),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(0) // Allow 0 to remove item
    .max(MAX_QUANTITY, `Quantity cannot exceed ${MAX_QUANTITY}`),
});

// Remove from cart validation
export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required').max(50),
});

// Get cart validation (query params)
export const getCartQuerySchema = z.object({
  includeDetails: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
});

// Clear cart validation
export const clearCartSchema = z.object({
  confirm: z.boolean().optional().default(true),
});

// Merge carts validation
export const mergeCartsSchema = z.object({
  guestCartItems: z.array(cartItemSchema).max(50, 'Too many items in cart'),
  strategy: z.enum(['merge', 'replace']).optional().default('merge'),
});

// Cart checkout validation
export const cartCheckoutSchema = z.object({
  deliveryAddress: z.string()
    .min(10, 'Delivery address is too short')
    .max(500, 'Delivery address is too long'),
  deliveryInstructions: z.string()
    .max(500, 'Delivery instructions are too long')
    .optional(),
  paymentMethod: z.enum(['cash', 'card', 'digital']),
  scheduledDeliveryTime: z.string().datetime().optional(),
  promoCode: z.string().max(20).optional(),
});

// Type exports
export type CartItem = z.infer<typeof cartItemSchema>;
export type AddToCartRequest = z.infer<typeof addToCartSchema>;
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartRequest = z.infer<typeof removeFromCartSchema>;
export type CartCheckoutRequest = z.infer<typeof cartCheckoutSchema>;
export type MergeCartsRequest = z.infer<typeof mergeCartsSchema>; 