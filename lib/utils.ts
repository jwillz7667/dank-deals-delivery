import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCityFromEmail(email: string): string {
  const cityMap: { [key: string]: string } = {
    "akron": "Akron",
    "alliance": "Alliance",
    "ashland": "Ashland",
    // ... existing code ...
  };
  
  const match = email.match(/@([^.]+)\./);
  if (match && cityMap[match[1]]) {
    return cityMap[match[1]];
  }
  return "Unknown City";
}

// Helper function to create slug from product name
export function createProductSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
