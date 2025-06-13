import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError, errorResponse } from '@/lib/api/utils';
import { API_ERROR_CODES } from '@/lib/types/api';

interface RouteParams {
  params: {
    productId: string;
  };
}

/**
 * DELETE /api/cart/remove/[productId]
 * Remove an item from the cart
 */
async function removeFromCart(
  req: AuthenticatedRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const { productId } = params;
    
    if (!productId) {
      return errorResponse({
        code: API_ERROR_CODES.INVALID_INPUT,
        message: 'Product ID is required',
      }, 400);
    }
    
    // Remove item from cart
    await CartService.removeItem(userId, productId);
    
    // Return updated cart
    const cart = await CartService.getCart(userId);
    
    return successResponse(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

export const DELETE = withAuth(removeFromCart); 