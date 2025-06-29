import { pgTable, serial, text, timestamp, integer, decimal, unique, index, boolean, real } from 'drizzle-orm/pg-core';

// User profiles extension (Stack Auth handles base user data)
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  phoneNumber: text('phone_number'),
  // Structured address fields
  houseType: text('house_type'), // house, townhouse, apartment, condo, etc.
  houseNumber: text('house_number'),
  streetName: text('street_name'),
  aptNumber: text('apt_number'), // apartment/unit number if applicable
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  deliveryInstructions: text('delivery_instructions'),
  preferredPaymentMethod: text('preferred_payment_method'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_user_profiles_user_id').on(table.userId),
}));

// Shopping cart
export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdUnique: unique().on(table.userId),
  userIdIdx: index('idx_carts_user_id').on(table.userId),
}));

// Cart items
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').references(() => carts.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  productPrice: decimal('product_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status').notNull().default('pending'), // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull(),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Structured delivery address fields
  deliveryHouseType: text('delivery_house_type'),
  deliveryHouseNumber: text('delivery_house_number'),
  deliveryStreetName: text('delivery_street_name'),
  deliveryAptNumber: text('delivery_apt_number'),
  deliveryCity: text('delivery_city'),
  deliveryState: text('delivery_state'),
  deliveryZipCode: text('delivery_zip_code'),
  deliveryInstructions: text('delivery_instructions'),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_orders_user_id').on(table.userId),
  createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
}));

// Order items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  productPrice: decimal('product_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category'),
  thcContent: text('thc_content'),
  cbdContent: text('cbd_content'),
  imageUrl: text('image_url'),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  inStock: boolean('in_stock').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_products_category').on(table.category),
  ratingIdx: index('idx_products_rating').on(table.rating),
}));

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  source: text('source').notNull(), // 'leafly', 'google', 'internal'
  rating: integer('rating').notNull(),
  reviewerName: text('reviewer_name').notNull(),
  reviewText: text('review_text'),
  date: timestamp('date').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  productIdIdx: index('idx_reviews_product_id').on(table.productId),
  sourceIdx: index('idx_reviews_source').on(table.source),
  dateIdx: index('idx_reviews_date').on(table.date),
  ratingIdx: index('idx_reviews_rating').on(table.rating),
}));

// Types for TypeScript
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert; 