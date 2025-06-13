import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError } from '@/lib/api/utils';

/**
 * DELETE /api/cart/clear
 * Clear all items from the cart
 */
async function clearCart(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    
    // Clear the cart
    await CartService.clearCart(userId);
    
    // Return empty cart
    return successResponse({
      message: 'Cart cleared successfully',
      cart: {
        id: 0,
        userId,
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        deliveryFee: 0,
        total: 0,
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const DELETE = withAuth(clearCart); 