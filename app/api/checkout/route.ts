import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { OrderService } from '@/lib/services/order.service';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError } from '@/lib/api/utils';
import { z } from 'zod';

// Validation schema for text/call order logging
const orderLogSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  houseType: z.string().min(1, 'House type is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  deliveryInstructions: z.string().optional(),
  saveProfile: z.boolean().default(false),
});

/**
 * POST /api/checkout
 * Log an order for text/call processing (no payment processing)
 */
async function logOrder(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const body = await req.json();
    
    // Validate input
    const validatedData = orderLogSchema.parse(body);
    
    // Check if cart has items
    const cart = await CartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CART_EMPTY',
            message: 'Your cart is empty',
            statusCode: 400,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }
    
    // Update user profile if requested
    if (validatedData.saveProfile) {
      await UserProfileService.updateProfile(userId, {
        phoneNumber: validatedData.phoneNumber,
        houseType: validatedData.houseType,
        houseNumber: validatedData.houseNumber,
        streetName: validatedData.streetName,
        aptNumber: validatedData.aptNumber,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        deliveryInstructions: validatedData.deliveryInstructions,
      });
    }
    
    // Create order record with 'pending_contact' status
    const order = await OrderService.createTextOrder({
      userId,
      deliveryHouseType: validatedData.houseType,
      deliveryHouseNumber: validatedData.houseNumber,
      deliveryStreetName: validatedData.streetName,
      deliveryAptNumber: validatedData.aptNumber,
      deliveryCity: validatedData.city,
      deliveryState: validatedData.state,
      deliveryZipCode: validatedData.zipCode,
      deliveryInstructions: validatedData.deliveryInstructions,
      phoneNumber: validatedData.phoneNumber,
    });
    
    // TODO: Send notification to admin about new text order
    // await NotificationService.notifyNewTextOrder(order);
    
    return successResponse({
      order,
      message: 'Order information saved. Please complete your order by text or phone.',
      redirectUrl: `/order-confirmation/${order.orderNumber}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            statusCode: 400,
            details: error.errors,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }
    
    return handleApiError(error);
  }
}

export const POST = withAuth(logOrder); 