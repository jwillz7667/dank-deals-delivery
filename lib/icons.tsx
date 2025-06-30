// Iconify icon configuration for optimized loading
import React, { memo } from 'react';
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

// Optimized icon component with preloaded sprites
interface OptimizedIconProps {
  name: string
  className?: string
  size?: number | string
  style?: React.CSSProperties
}

const OptimizedIcon = memo(function OptimizedIcon({ 
  name, 
  className = '', 
  size = 20,
  style 
}: OptimizedIconProps) {
  return (
    <Icon 
      icon={name} 
      className={className}
      width={size}
      height={size}
      style={style}
    />
  )
})

// Export commonly used icons with optimized sprites
export const SearchIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:search" {...props} />
)

export const LeafIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:leaf" {...props} />
)

export const CookieIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:cookie" {...props} />
)

export const CigaretteIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:cigarette" {...props} />
)

export const HeartIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:heart" {...props} />
)

export const PillIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:pill" {...props} />
)

export const SparklesIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:sparkles" {...props} />
)

export const TrendingUpIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:trending-up" {...props} />
)

export const UsersIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:users" {...props} />
)

export const ShoppingCartIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:shopping-cart" {...props} />
)

export const StarIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:star" {...props} />
)

export const ClockIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:clock" {...props} />
)

export const ActivityIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:activity" {...props} />
)

export const CheckCircleIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:check-circle" {...props} />
)

export const MenuIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:menu" {...props} />
)

export const HomeIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:home" {...props} />
)

export const MapPinIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:map-pin" {...props} />
)

export const PhoneIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:phone" {...props} />
)

export const UserIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:user" {...props} />
)

export const TruckIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:truck" {...props} />
)

export const XIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:x" {...props} />
)

export const PlusIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:plus" {...props} />
)

export const MinusIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:minus" {...props} />
)

export const FilterIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:filter" {...props} />
)

export const ArrowUpIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:arrow-up" {...props} />
)

export const ArrowDownIcon = memo((props: Omit<OptimizedIconProps, 'name'>) => 
  <OptimizedIcon name="lucide:arrow-down" {...props} />
)

// Preload critical icon sprites on app startup
export const preloadCriticalIcons = () => {
  if (typeof window !== 'undefined') {
    // Use Iconify's loadIcons API for better performance
    import('@iconify/react').then(({ loadIcons }) => {
      loadIcons([
        'lucide:search',
        'lucide:leaf', 
        'lucide:menu',
        'lucide:home',
        'lucide:shopping-cart',
        'lucide:user',
        'lucide:truck'
      ])
    })
  }
}

export default OptimizedIcon 