import { db } from '@/lib/db';
import { userProfiles, UserProfile, NewUserProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UpdateProfileInput {
  phoneNumber?: string;
  deliveryAddress?: string;
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
        deliveryAddress: data?.deliveryAddress,
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
      const profile = await this.getProfile(userId);
      
      if (profile) {
        return profile;
      }
      
      return await this.createProfile(userId);
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
      
      return !!(profile.phoneNumber && profile.deliveryAddress);
    } catch (error) {
      console.error('Error checking delivery info:', error);
      throw new Error('Failed to check delivery info');
    }
  }
} 