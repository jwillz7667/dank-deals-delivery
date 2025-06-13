import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { OrderService } from '@/lib/services/order.service';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError } from '@/lib/api/utils';
import { z } from 'zod';

// Validation schema for checkout
const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Delivery address is too short'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'apple_pay', 'google_pay']),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  saveProfile: z.boolean().default(false),
});

/**
 * POST /api/checkout
 * Create an order from the user's cart
 */
async function checkout(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const body = await req.json();
    
    // Validate input
    const validatedData = checkoutSchema.parse(body);
    
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
        deliveryAddress: validatedData.deliveryAddress,
        deliveryInstructions: validatedData.deliveryInstructions,
        preferredPaymentMethod: validatedData.paymentMethod,
      });
    }
    
    // Create order
    const order = await OrderService.createOrder({
      userId,
      deliveryAddress: validatedData.deliveryAddress,
      deliveryInstructions: validatedData.deliveryInstructions,
      paymentMethod: validatedData.paymentMethod,
    });
    
    // TODO: Process payment based on payment method
    // For now, we'll assume payment is successful for cash on delivery
    if (validatedData.paymentMethod !== 'cash') {
      // In production, integrate with payment gateway
      // await PaymentService.processPayment(order, validatedData.paymentMethod);
    }
    
    // TODO: Send order confirmation email
    // await EmailService.sendOrderConfirmation(userId, order);
    
    // TODO: Send order notification to admin/store
    // await NotificationService.notifyNewOrder(order);
    
    return successResponse({
      order,
      message: 'Order placed successfully',
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

export const POST = withAuth(checkout); 