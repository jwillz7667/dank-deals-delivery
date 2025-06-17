'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface CartItem {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  estimatedTax: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, productName: string, productPrice: number, quantity?: number) => Promise<void>;
  addItem: (productId: string, productName: string, productPrice: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, requireAuth } = useAuth();

  const fetchCart = useCallback(async () => {
    // Only fetch cart if authenticated
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        setCart(data.data);
      } else {
        console.error('Cart fetch error:', data.error);
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (
    productId: string,
    productName: string,
    productPrice: number,
    quantity: number = 1
  ) => {
    // Require authentication before adding to cart
    if (!requireAuth()) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    try {
      // Show loading state
      toast.loading('Adding to cart...', { id: 'add-to-cart' });

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          productPrice,
          quantity,
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss('add-to-cart');

      if (data.success) {
        setCart(data.data);
        toast.success(`Added ${productName} to cart!`);
      } else {
        console.error('Add to cart error:', data.error);
        toast.error(data.error?.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.dismiss('add-to-cart');
      console.error('Failed to add to cart:', error);
      toast.error('Network error. Please check your connection and try again.');
    }
  };

  const removeFromCart = async (productId: string) => {
    // Require authentication for cart operations
    if (!requireAuth()) {
      toast.error('Please sign in to manage your cart');
      return;
    }

    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        toast.success('Removed from cart');
      } else {
        console.error('Remove from cart error:', data.error);
        toast.error(data.error?.message || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    // Require authentication for cart operations
    if (!requireAuth()) {
      toast.error('Please sign in to manage your cart');
      return;
    }

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
      } else {
        console.error('Update quantity error:', data.error);
        toast.error(data.error?.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const clearCart = async () => {
    // Require authentication for cart operations
    if (!requireAuth()) {
      toast.error('Please sign in to manage your cart');
      return;
    }

    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        toast.success('Cart cleared');
      } else {
        console.error('Clear cart error:', data.error);
        toast.error(data.error?.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const refreshCart = async () => {
    // Only refresh if authenticated
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 