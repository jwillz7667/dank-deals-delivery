-- Migration: Update address fields and add tip functionality
-- Date: 2025-06-14

-- Update user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN house_type TEXT,
ADD COLUMN house_number TEXT,
ADD COLUMN street_name TEXT,
ADD COLUMN apt_number TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT;

-- Update orders table
ALTER TABLE orders 
ADD COLUMN tip DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN delivery_house_type TEXT,
ADD COLUMN delivery_house_number TEXT,
ADD COLUMN delivery_street_name TEXT,
ADD COLUMN delivery_apt_number TEXT,
ADD COLUMN delivery_city TEXT,
ADD COLUMN delivery_state TEXT,
ADD COLUMN delivery_zip_code TEXT;

-- Migrate existing delivery_address data (if any exists)
-- This will attempt to parse existing addresses, but new structured format is preferred
UPDATE user_profiles 
SET street_name = delivery_address 
WHERE delivery_address IS NOT NULL AND street_name IS NULL;

UPDATE orders 
SET delivery_street_name = delivery_address 
WHERE delivery_address IS NOT NULL AND delivery_street_name IS NULL;

-- Note: The old delivery_address columns will be kept for backward compatibility
-- They can be dropped in a future migration after data migration is complete 