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
}

export class UserProfileService {
  /**
   * Get user profile
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
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();
      
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }
      
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
      let profile = await this.getProfile(userId);
      
      if (!profile) {
        profile = await this.createProfile(userId);
      }
      
      return profile;
    } catch (error) {
      console.error('Error getting or creating user profile:', error);
      throw new Error('Failed to get or create user profile');
    }
  }
  
  /**
   * Delete user profile
   */
  static async deleteProfile(userId: string): Promise<void> {
    try {
      await db
        .delete(userProfiles)
        .where(eq(userProfiles.userId, userId));
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