import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, withRateLimit } from '@/lib/auth/middleware';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError, validateRequestBody } from '@/lib/api/utils';
import { addToCartSchema } from '@/lib/validations/cart';

/**
 * POST /api/cart/add
 * Add an item to the cart
 */
async function addToCart(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    
    // Validate request body
    const data = await validateRequestBody(req, addToCartSchema);
    
    // Add item to cart
    await CartService.addItem(userId, data);
    
    // Return updated cart
    const cart = await CartService.getCart(userId);
    
    return successResponse(cart, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// Apply rate limiting and authentication
export const POST = withAuth(addToCart); 