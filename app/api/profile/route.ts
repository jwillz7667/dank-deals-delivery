import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { successResponse, handleApiError } from '@/lib/api/utils';
import { z } from 'zod';

// Validation schema for profile update
const updateProfileSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  houseType: z.string().min(1, 'House type is required').optional(),
  houseNumber: z.string().min(1, 'House number is required').optional(),
  streetName: z.string().min(1, 'Street name is required').optional(),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().min(2, 'State is required').optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional(),
  deliveryInstructions: z.string().optional(),
});

/**
 * GET /api/profile
 * Get user profile
 */
async function getProfile(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    
    const profile = await UserProfileService.getOrCreateProfile(userId);
    
    // Get user info from Stack Auth
    const { stackServerApp } = await import('@/stack');
    const user = await stackServerApp.getUser();
    
    return successResponse({
      profile: {
        ...profile,
        email: user?.primaryEmail,
        displayName: user?.displayName,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/profile
 * Update user profile
 */
async function updateProfile(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const body = await req.json();
    
    // Validate input
    const validatedData = updateProfileSchema.parse(body);
    
    const updatedProfile = await UserProfileService.updateProfile(userId, validatedData);
    
    return successResponse({
      profile: updatedProfile,
      message: 'Profile updated successfully',
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

export const GET = withAuth(getProfile);
export const PUT = withAuth(updateProfile); 