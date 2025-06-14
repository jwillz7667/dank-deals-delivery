import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { OrderService } from '@/lib/services/order.service';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { CartService } from '@/lib/services/cart.service';
import { successResponse, handleApiError } from '@/lib/api/utils';
import { z } from 'zod';

// Validation schema for checkout
const checkoutSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  houseType: z.string().min(1, 'House type is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']),
  tip: z.number().min(0, 'Tip cannot be negative').default(0),
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
        houseType: validatedData.houseType,
        houseNumber: validatedData.houseNumber,
        streetName: validatedData.streetName,
        aptNumber: validatedData.aptNumber,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        deliveryInstructions: validatedData.deliveryInstructions,
        preferredPaymentMethod: validatedData.paymentMethod,
      });
    }
    
    // Create order
    const order = await OrderService.createOrder({
      userId,
      deliveryHouseType: validatedData.houseType,
      deliveryHouseNumber: validatedData.houseNumber,
      deliveryStreetName: validatedData.streetName,
      deliveryAptNumber: validatedData.aptNumber,
      deliveryCity: validatedData.city,
      deliveryState: validatedData.state,
      deliveryZipCode: validatedData.zipCode,
      deliveryInstructions: validatedData.deliveryInstructions,
      paymentMethod: validatedData.paymentMethod,
      tip: validatedData.tip,
    });
    
    // TODO: Process payment based on payment method
    // In production, integrate with payment gateway
    // await PaymentService.processPayment(order, validatedData.paymentMethod);
    
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