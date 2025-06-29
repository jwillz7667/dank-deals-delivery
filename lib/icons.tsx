// Iconify icon configuration for optimized loading
import React from 'react';
import { Icon } from '@iconify/react';

// Map of commonly used icons
export const icons = {
  // Navigation
  home: 'solar:home-2-bold',
  menu: 'solar:cannabis-bold',
  cart: 'solar:cart-large-4-bold',
  user: 'solar:user-circle-bold',
  
  // Actions
  search: 'solar:magnifer-bold',
  close: 'solar:close-circle-bold',
  add: 'solar:add-circle-bold',
  remove: 'solar:minus-circle-bold',
  trash: 'solar:trash-bin-trash-bold',
  
  // UI Elements
  chevronDown: 'solar:alt-arrow-down-bold',
  chevronUp: 'solar:alt-arrow-up-bold',
  chevronLeft: 'solar:alt-arrow-left-bold',
  chevronRight: 'solar:alt-arrow-right-bold',
  arrowRight: 'solar:arrow-right-bold',
  
  // Status
  check: 'solar:check-circle-bold',
  info: 'solar:info-circle-bold',
  warning: 'solar:danger-triangle-bold',
  error: 'solar:close-circle-bold',
  
  // Features
  delivery: 'solar:delivery-bold',
  location: 'solar:map-point-bold',
  phone: 'solar:phone-bold',
  email: 'solar:letter-bold',
  clock: 'solar:clock-circle-bold',
  calendar: 'solar:calendar-bold',
  
  // Products
  cannabis: 'solar:cannabis-bold',
  flame: 'solar:fire-bold',
  star: 'solar:star-bold',
  starOutline: 'solar:star-linear',
  heart: 'solar:heart-bold',
  heartOutline: 'solar:heart-linear',
  
  // Social
  instagram: 'ri:instagram-fill',
  twitter: 'ri:twitter-x-fill',
  facebook: 'ri:facebook-fill',
  
  // Payment
  creditCard: 'solar:card-bold',
  wallet: 'solar:wallet-bold',
  
  // Misc
  settings: 'solar:settings-bold',
  help: 'solar:question-circle-bold',
  share: 'solar:share-bold',
  copy: 'solar:copy-bold',
  download: 'solar:download-bold',
  upload: 'solar:upload-bold',
  filter: 'solar:filter-bold',
  sort: 'solar:sort-bold',
} as const;

// Create a typed icon component
export type IconName = keyof typeof icons;

interface DankIconProps {
  name: IconName;
  className?: string;
  size?: number | string;
  color?: string;
  onClick?: () => void;
}

export function DankIcon({ 
  name, 
  className = '', 
  size = 24, 
  color,
  onClick 
}: DankIconProps) {
  return <Icon 
    icon={icons[name]} 
    className={className}
    width={size}
    height={size}
    color={color}
    onClick={onClick}
  />;
}

// Preload critical icons for performance
export function preloadCriticalIcons() {
  if (typeof window === 'undefined') return;
  
  const criticalIcons = [
    icons.home,
    icons.menu,
    icons.cart,
    icons.user,
    icons.search,
    icons.cannabis,
  ];
  
  // Load icons in the background using the loadIcons API
  import('@iconify/react').then(({ loadIcons }) => {
    loadIcons(criticalIcons);
  });
} 