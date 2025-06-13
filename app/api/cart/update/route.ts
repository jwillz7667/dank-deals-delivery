import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, withRateLimit } from '@/lib/auth/middleware';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError, validateRequestBody } from '@/lib/api/utils';
import { updateCartItemSchema } from '@/lib/validations/cart';

/**
 * PUT /api/cart/update
 * Update the quantity of an item in the cart
 */
async function updateCartItem(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    
    // Validate request body
    const data = await validateRequestBody(req, updateCartItemSchema);
    
    // Update item quantity
    await CartService.updateItemQuantity(userId, data.productId, data.quantity);
    
    // Return updated cart
    const cart = await CartService.getCart(userId);
    
    return successResponse(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

// Apply rate limiting and authentication
export const PUT = withAuth(updateCartItem); 