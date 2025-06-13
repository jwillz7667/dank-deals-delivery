import { db } from '@/lib/db';
import { carts, cartItems, CartItem, NewCartItem } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { CartDTO, CartItemDTO } from '@/lib/types/api';
import { calculateOrderTotals } from '@/lib/api/utils';

export class CartService {
  /**
   * Get or create cart for user
   */
  static async getOrCreateCart(userId: string): Promise<number> {
    // Try to get existing cart
    const existingCart = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);
    
    if (existingCart.length > 0) {
      return existingCart[0].id;
    }
    
    // Create new cart
    const newCart = await db
      .insert(carts)
      .values({ userId })
      .returning({ id: carts.id });
    
    return newCart[0].id;
  }
  
  /**
   * Get cart with items
   */
  static async getCart(userId: string): Promise<CartDTO | null> {
    const cartData = await db
      .select({
        cart: carts,
        items: sql<CartItem[]>`
          COALESCE(
            json_agg(
              json_build_object(
                'id', ${cartItems.id},
                'cartId', ${cartItems.cartId},
                'productId', ${cartItems.productId},
                'productName', ${cartItems.productName},
                'productPrice', ${cartItems.productPrice},
                'quantity', ${cartItems.quantity},
                'createdAt', ${cartItems.createdAt},
                'updatedAt', ${cartItems.updatedAt}
              ) ORDER BY ${cartItems.createdAt} DESC
            ) FILTER (WHERE ${cartItems.id} IS NOT NULL),
            '[]'::json
          )
        `,
      })
      .from(carts)
      .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
      .where(eq(carts.userId, userId))
      .groupBy(carts.id)
      .limit(1);
    
    if (cartData.length === 0) {
      return null;
    }
    
    const cart = cartData[0].cart;
    const items: CartItemDTO[] = cartData[0].items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productPrice: parseFloat(item.productPrice as string),
      quantity: item.quantity,
    }));
    
    const subtotal = items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    const totals = calculateOrderTotals(subtotal);
    
    return {
      id: cart.id,
      userId: cart.userId,
      items,
      subtotal: totals.subtotal,
      estimatedTax: totals.tax,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      createdAt: cart.createdAt as Date,
      updatedAt: cart.updatedAt as Date,
    };
  }
  
  /**
   * Add item to cart
   */
  static async addItem(
    userId: string,
    item: Omit<CartItemDTO, 'quantity'> & { quantity: number }
  ): Promise<void> {
    const cartId = await this.getOrCreateCart(userId);
    
    // Check if item already exists
    const existingItem = await db
      .select({ id: cartItems.id, quantity: cartItems.quantity })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, item.productId)
        )
      )
      .limit(1);
    
    if (existingItem.length > 0) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ 
          quantity: existingItem[0].quantity + item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      // Add new item
      await db
        .insert(cartItems)
        .values({
          cartId,
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice.toString(),
          quantity: item.quantity,
        });
    }
    
    // Update cart's updatedAt
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cartId));
  }
  
  /**
   * Update item quantity
   */
  static async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<void> {
    const cartId = await this.getOrCreateCart(userId);
    
    if (quantity <= 0) {
      // Remove item
      await this.removeItem(userId, productId);
      return;
    }
    
    const result = await db
      .update(cartItems)
      .set({ 
        quantity,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, productId)
        )
      )
      .returning({ id: cartItems.id });
    
    if (result.length > 0) {
      // Update cart's updatedAt
      await db
        .update(carts)
        .set({ updatedAt: new Date() })
        .where(eq(carts.id, cartId));
    }
  }
  
  /**
   * Remove item from cart
   */
  static async removeItem(userId: string, productId: string): Promise<void> {
    const cartId = await this.getOrCreateCart(userId);
    
    const result = await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, productId)
        )
      )
      .returning({ id: cartItems.id });
    
    if (result.length > 0) {
      // Update cart's updatedAt
      await db
        .update(carts)
        .set({ updatedAt: new Date() })
        .where(eq(carts.id, cartId));
    }
  }
  
  /**
   * Clear all items from cart
   */
  static async clearCart(userId: string): Promise<void> {
    const cartId = await this.getOrCreateCart(userId);
    
    await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId));
    
    // Update cart's updatedAt
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cartId));
  }
  
  /**
   * Merge guest cart with user cart
   */
  static async mergeGuestCart(
    userId: string,
    guestItems: CartItemDTO[],
    strategy: 'merge' | 'replace' = 'merge'
  ): Promise<void> {
    if (strategy === 'replace') {
      await this.clearCart(userId);
    }
    
    // Add each guest item to user cart
    for (const item of guestItems) {
      await this.addItem(userId, item);
    }
  }
  
  /**
   * Validate cart items (check prices, availability, etc.)
   */
  static async validateCart(userId: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const cart = await this.getCart(userId);
    const errors: string[] = [];
    
    if (!cart || cart.items.length === 0) {
      errors.push('Cart is empty');
      return { valid: false, errors };
    }
    
    // Here you would typically:
    // 1. Check product availability
    // 2. Verify current prices
    // 3. Check quantity limits
    // 4. Validate delivery area
    
    // For now, basic validation
    for (const item of cart.items) {
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for ${item.productName}`);
      }
      if (item.productPrice <= 0) {
        errors.push(`Invalid price for ${item.productName}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Get cart item count
   */
  static async getItemCount(userId: string): Promise<number> {
    const result = await db
      .select({
        count: sql<number>`COALESCE(SUM(${cartItems.quantity}), 0)`,
      })
      .from(carts)
      .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
      .where(eq(carts.userId, userId))
      .groupBy(carts.id);
    
    return result.length > 0 ? Number(result[0].count) : 0;
  }
} 