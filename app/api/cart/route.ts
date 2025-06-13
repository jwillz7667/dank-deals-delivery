import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError } from '@/lib/api/utils';
import { API_ERROR_CODES } from '@/lib/types/api';

/**
 * GET /api/cart
 * Get the current user's cart
 */
async function getCart(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    
    const cart = await CartService.getCart(userId);
    
    if (!cart) {
      // Return empty cart structure
      return successResponse({
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
      });
    }
    
    return successResponse(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getCart); 