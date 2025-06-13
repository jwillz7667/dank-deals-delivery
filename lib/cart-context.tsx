"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import { CartDTO } from '@/lib/types/api';

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGuestCart = () => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  };

  const loadUserCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const result = await response.json();
        const cartData = result.data as CartDTO;
        setItems(cartData.items || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError('Network error while loading cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart from localStorage or server and handle guest cart merge
  useEffect(() => {
    const handleCartLoad = async () => {
      if (user) {
        // Check if we have a guest cart to merge
        const guestCartJson = localStorage.getItem('guestCart');
        if (guestCartJson) {
          try {
            const guestItems = JSON.parse(guestCartJson) as CartItem[];
            if (guestItems.length > 0) {
              // Clear local storage first to prevent duplicate merging
              localStorage.removeItem('guestCart');
              
              // Merge guest cart items with user cart
              for (const item of guestItems) {
                try {
                  const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                  });
                  
                  if (!response.ok) {
                    console.error('Failed to merge item:', item.productName);
                  }
                } catch (error) {
                  console.error('Error merging cart item:', error);
                }
              }
              
              toast.success('Your guest cart has been merged');
            }
          } catch (error) {
            console.error('Failed to parse guest cart:', error);
          }
        }
        
        // Load the user's cart (including merged items)
        await loadUserCart();
      } else {
        loadGuestCart();
      }
    };
    
    handleCartLoad();
  }, [user, loadUserCart]);

  const saveGuestCart = (newItems: CartItem[]) => {
    localStorage.setItem('guestCart', JSON.stringify(newItems));
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = product.quantity || 1;
    
    if (user) {
      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...product, quantity }),
        });
        
        if (response.ok) {
          await loadUserCart();
          toast.success(`${product.productName} added to cart`);
        }
      } catch (error) {
        toast.error('Failed to add item to cart');
      }
    } else {
      // Guest cart
      const existingItem = items.find(item => item.productId === product.productId);
      let newItems;
      
      if (existingItem) {
        newItems = items.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...items, { ...product, quantity }];
      }
      
      setItems(newItems);
      saveGuestCart(newItems);
      toast.success(`${product.productName} added to cart`);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadUserCart();
          toast.success('Item removed from cart');
        }
      } catch (error) {
        toast.error('Failed to remove item from cart');
      }
    } else {
      const newItems = items.filter(item => item.productId !== productId);
      setItems(newItems);
      saveGuestCart(newItems);
      toast.success('Item removed from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const response = await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
        
        if (response.ok) {
          await loadUserCart();
        }
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    } else {
      const newItems = items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setItems(newItems);
      saveGuestCart(newItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setItems([]);
          toast.success('Cart cleared');
        }
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    } else {
      setItems([]);
      localStorage.removeItem('guestCart');
      toast.success('Cart cleared');
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const refreshCart = useCallback(async () => {
    if (user) {
      await loadUserCart();
    } else {
      loadGuestCart();
    }
  }, [user, loadUserCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 