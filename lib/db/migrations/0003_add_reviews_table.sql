-- Add reviews table for product ratings
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('leafly', 'google', 'internal')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  reviewer_name TEXT NOT NULL,
  review_text TEXT,
  date DATETIME NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_source ON reviews(source);
CREATE INDEX idx_reviews_date ON reviews(date DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Add rating columns to products table
ALTER TABLE products ADD COLUMN rating REAL DEFAULT 0;
ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;

-- Create trigger to update product ratings on review insert
CREATE TRIGGER update_product_rating_on_insert
AFTER INSERT ON reviews
BEGIN
  UPDATE products 
  SET 
    rating = (
      SELECT AVG(rating) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
END;

-- Create trigger to update product ratings on review update
CREATE TRIGGER update_product_rating_on_update
AFTER UPDATE ON reviews
BEGIN
  UPDATE products 
  SET 
    rating = (
      SELECT AVG(rating) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
END;

-- Create trigger to update product ratings on review delete
CREATE TRIGGER update_product_rating_on_delete
AFTER DELETE ON reviews
BEGIN
  UPDATE products 
  SET 
    rating = COALESCE(
      (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE product_id = OLD.product_id
      ), 
      0
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = OLD.product_id
    )
  WHERE id = OLD.product_id;
END; 