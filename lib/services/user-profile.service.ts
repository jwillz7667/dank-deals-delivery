import { db } from '@/lib/db';
import { userProfiles, UserProfile, NewUserProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UpdateProfileInput {
  phoneNumber?: string;
  houseType?: string;
  houseNumber?: string;
  streetName?: string;
  aptNumber?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  deliveryInstructions?: string;
  preferredPaymentMethod?: string;
}

export class UserProfileService {
  /**
   * Get user profile by userId
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));
      
      return profile || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }
  
  /**
   * Create user profile
   */
  static async createProfile(userId: string, data?: UpdateProfileInput): Promise<UserProfile> {
    try {
      const profileData: NewUserProfile = {
        userId,
        phoneNumber: data?.phoneNumber,
        houseType: data?.houseType,
        houseNumber: data?.houseNumber,
        streetName: data?.streetName,
        aptNumber: data?.aptNumber,
        city: data?.city,
        state: data?.state,
        zipCode: data?.zipCode,
        deliveryInstructions: data?.deliveryInstructions,
        preferredPaymentMethod: data?.preferredPaymentMethod,
      };
      
      const [profile] = await db
        .insert(userProfiles)
        .values(profileData)
        .returning();
      
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }
  
  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: UpdateProfileInput): Promise<UserProfile> {
    try {
      // Check if profile exists
      const existingProfile = await this.getProfile(userId);
      
      if (!existingProfile) {
        // Create profile if it doesn't exist
        return await this.createProfile(userId, data);
      }
      
      // Update existing profile
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
  
  /**
   * Get or create user profile
   */
  static async getOrCreateProfile(userId: string): Promise<UserProfile> {
    try {
      // First, try to get existing profile
      const existingProfile = await this.getProfile(userId);
      if (existingProfile) {
        return existingProfile;
      }

      // If no profile exists, try to create one
      try {
        return await this.createProfile(userId);
      } catch (createError: any) {
        // If we get a duplicate key error, it means another request created the profile
        // between our check and our insert. Try to fetch it again.
        if (createError?.cause?.code === '23505' || createError?.message?.includes('duplicate key')) {
          console.log('Duplicate key error detected, attempting to fetch existing profile');
          
          // Wait a small amount to ensure the other transaction completes
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const retryProfile = await this.getProfile(userId);
          if (retryProfile) {
            return retryProfile;
          }
          
          // If we still can't find it, something is wrong
          console.error('Profile should exist after duplicate key error but was not found');
        }
        
        // Re-throw the original error if it's not a duplicate key issue
        throw createError;
      }
    } catch (error) {
      console.error('Error getting or creating user profile:', error);
      throw new Error('Failed to get or create user profile');
    }
  }
  
  /**
   * Delete user profile
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(userProfiles)
        .where(eq(userProfiles.userId, userId));
      
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw new Error('Failed to delete user profile');
    }
  }
  
  /**
   * Check if user has complete delivery information
   */
  static async hasCompleteDeliveryInfo(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      
      if (!profile) {
        return false;
      }
      
      return !!(profile.phoneNumber && profile.houseNumber && profile.streetName && profile.city && profile.state && profile.zipCode);
    } catch (error) {
      console.error('Error checking delivery info:', error);
      throw new Error('Failed to check delivery info');
    }
  }
} 