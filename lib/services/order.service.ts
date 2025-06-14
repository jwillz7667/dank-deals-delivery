import { db } from '@/lib/db';
import { orders, orderItems, carts, cartItems, NewOrder, NewOrderItem, Order } from '@/lib/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { CartService } from './cart.service';

export interface CreateOrderInput {
  userId: string;
  deliveryHouseType: string;
  deliveryHouseNumber: string;
  deliveryStreetName: string;
  deliveryAptNumber?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  tip: number;
}

export interface CreateTextOrderInput {
  userId: string;
  deliveryHouseType: string;
  deliveryHouseNumber: string;
  deliveryStreetName: string;
  deliveryAptNumber?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryInstructions?: string;
  phoneNumber: string;
}

export interface OrderWithItems extends Order {
  items: Array<{
    id: number;
    productId: string;
    productName: string;
    productPrice: string;
    quantity: number;
  }>;
}

export class OrderService {
  /**
   * Create a new text/call order from the user's cart
   */
  static async createTextOrder(input: CreateTextOrderInput): Promise<OrderWithItems> {
    const { 
      userId, 
      deliveryHouseType,
      deliveryHouseNumber,
      deliveryStreetName,
      deliveryAptNumber,
      deliveryCity,
      deliveryState,
      deliveryZipCode,
      deliveryInstructions,
      phoneNumber
    } = input;
    
    // Get user's cart
    const cart = await CartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate order totals
    const subtotal = cart.subtotal;
    const tax = cart.estimatedTax;
    const deliveryFee = cart.deliveryFee;
    const total = cart.total;
    
    // Generate order number
    const orderNumber = `TXT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    try {
      // Create order with 'pending_contact' status
      const [order] = await db.insert(orders).values({
        userId,
        orderNumber,
        status: 'pending_contact',
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        deliveryFee: deliveryFee.toString(),
        tip: '0.00',
        total: total.toString(),
        deliveryHouseType,
        deliveryHouseNumber,
        deliveryStreetName,
        deliveryAptNumber,
        deliveryCity,
        deliveryState,
        deliveryZipCode,
        deliveryInstructions,
        paymentMethod: 'text_call',
      }).returning();
      
      // Create order items
      const orderItemsData: NewOrderItem[] = cart.items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice.toString(),
        quantity: item.quantity,
      }));
      
      const createdItems = await db.insert(orderItems).values(orderItemsData).returning();
      
      // Don't clear the cart automatically - let customer decide after contact
      
      return {
        ...order,
        items: createdItems,
      };
    } catch (error) {
      console.error('Error creating text order:', error);
      throw new Error('Failed to create text order');
    }
  }

  /**
   * Create a new order from the user's cart
   */
  static async createOrder(input: CreateOrderInput): Promise<OrderWithItems> {
    const { 
      userId, 
      deliveryHouseType,
      deliveryHouseNumber,
      deliveryStreetName,
      deliveryAptNumber,
      deliveryCity,
      deliveryState,
      deliveryZipCode,
      deliveryInstructions, 
      paymentMethod,
      tip 
    } = input;
    
    // Get user's cart
    const cart = await CartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate order totals
    const subtotal = cart.subtotal;
    const tax = cart.estimatedTax;
    const deliveryFee = cart.deliveryFee;
    const total = cart.total + tip;
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    try {
      // Create order
      const [order] = await db.insert(orders).values({
        userId,
        orderNumber,
        status: 'pending',
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        deliveryFee: deliveryFee.toString(),
        tip: tip.toString(),
        total: total.toString(),
        deliveryHouseType,
        deliveryHouseNumber,
        deliveryStreetName,
        deliveryAptNumber,
        deliveryCity,
        deliveryState,
        deliveryZipCode,
        deliveryInstructions,
        paymentMethod,
      }).returning();
      
      // Create order items
      const orderItemsData: NewOrderItem[] = cart.items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice.toString(),
        quantity: item.quantity,
      }));
      
      const createdItems = await db.insert(orderItems).values(orderItemsData).returning();
      
      // Clear the cart after successful order creation
      await CartService.clearCart(userId);
      
      return {
        ...order,
        items: createdItems,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }
  
  /**
   * Get order by ID
   */
  static async getOrderById(orderId: number, userId?: string): Promise<OrderWithItems | null> {
    try {
      const conditions = userId 
        ? and(eq(orders.id, orderId), eq(orders.userId, userId))
        : eq(orders.id, orderId);
        
      const [order] = await db.select().from(orders).where(conditions);
      
      if (!order) {
        return null;
      }
      
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
      
      return {
        ...order,
        items,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }
  
  /**
   * Get order by order number
   */
  static async getOrderByNumber(orderNumber: string, userId?: string): Promise<OrderWithItems | null> {
    try {
      const conditions = userId 
        ? and(eq(orders.orderNumber, orderNumber), eq(orders.userId, userId))
        : eq(orders.orderNumber, orderNumber);
        
      const [order] = await db.select().from(orders).where(conditions);
      
      if (!order) {
        return null;
      }
      
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      
      return {
        ...order,
        items,
      };
    } catch (error) {
      console.error('Error fetching order by number:', error);
      throw new Error('Failed to fetch order');
    }
  }
  
  /**
   * Get user's orders
   */
  static async getUserOrders(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ orders: OrderWithItems[]; total: number }> {
    try {
      const limit = options?.limit || 10;
      const offset = options?.offset || 0;
      
      const conditions = [];
      conditions.push(eq(orders.userId, userId));
      
      if (options?.status) {
        conditions.push(eq(orders.status, options.status));
      }
      
      if (options?.startDate) {
        conditions.push(gte(orders.createdAt, options.startDate));
      }
      
      if (options?.endDate) {
        conditions.push(lte(orders.createdAt, options.endDate));
      }
      
      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];
      
      // Get total count
      const [{ count }] = await db
        .select({ count: db.$count(orders) })
        .from(orders)
        .where(whereClause);
      
      // Get orders
      const userOrders = await db
        .select()
        .from(orders)
        .where(whereClause)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Get items for each order
      const ordersWithItems: OrderWithItems[] = await Promise.all(
        userOrders.map(async (order) => {
          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));
          
          return {
            ...order,
            items,
          };
        })
      );
      
      return {
        orders: ordersWithItems,
        total: count,
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }
  
  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: number,
    status: string,
    userId?: string
  ): Promise<Order> {
    try {
      const conditions = userId 
        ? and(eq(orders.id, orderId), eq(orders.userId, userId))
        : eq(orders.id, orderId);
      
      const [updatedOrder] = await db
        .update(orders)
        .set({ 
          status,
          updatedAt: new Date(),
        })
        .where(conditions)
        .returning();
      
      if (!updatedOrder) {
        throw new Error('Order not found');
      }
      
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }
  
  /**
   * Cancel order
   */
  static async cancelOrder(orderId: number, userId: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId, userId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== 'pending' && order.status !== 'confirmed') {
        throw new Error('Order cannot be cancelled');
      }
      
      return await this.updateOrderStatus(orderId, 'cancelled', userId);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error('Failed to cancel order');
    }
  }
} 