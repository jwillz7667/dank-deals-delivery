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
  subtotal: number;
  estimatedTax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, productName: string, productPrice: number, quantity?: number) => Promise<void>;
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
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
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
      return;
    }

    try {
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

      if (data.success) {
        setCart(data.data);
        toast.success('Added to cart');
      } else {
        toast.error(data.error?.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    // Require authentication for cart operations
    if (!requireAuth()) {
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
        toast.error(data.error?.message || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    // Require authentication for cart operations
    if (!requireAuth()) {
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
        toast.error(data.error?.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    // Require authentication for cart operations
    if (!requireAuth()) {
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
        toast.error(data.error?.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const refreshCart = async () => {
    // Only refresh if authenticated
    if (!isAuthenticated) {
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