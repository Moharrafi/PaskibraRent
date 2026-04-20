-- Migration: Add indexes and fix missing schema issues
-- Run this ONCE on the database. Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS checks).

-- 1. Add item_id column to booking_items (used in code but missing from schema)
ALTER TABLE booking_items
  ADD COLUMN IF NOT EXISTS item_id VARCHAR(255) NOT NULL DEFAULT '' AFTER booking_id;

-- 2. Add UNIQUE constraint on cart_items(user_id, item_id)
--    Required for ON DUPLICATE KEY UPDATE to work correctly
ALTER TABLE cart_items
  ADD UNIQUE IF NOT EXISTS uniq_user_item (user_id, item_id);

-- 3. Add verification columns to users (used in auth flow)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 1 AFTER role,
  ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) DEFAULT NULL AFTER is_verified;

-- 4. Indexes for bookings table
--    (user_id FK already indexed by MySQL, but status and return_date are not)
CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings (status);

CREATE INDEX IF NOT EXISTS idx_bookings_return_date
  ON bookings (return_date);

CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date
  ON bookings (pickup_date);

-- 5. Composite index for availability query
--    WHERE status IN (...) AND pickup_date/return_date range
CREATE INDEX IF NOT EXISTS idx_bookings_status_dates
  ON bookings (status, pickup_date, return_date);

-- 6. Index for booking_items.item_id (used in availability GROUP BY)
CREATE INDEX IF NOT EXISTS idx_booking_items_item_id
  ON booking_items (item_id);

-- 7. Index for newsletter_subscribers lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_email
  ON newsletter_subscribers (email);

-- 8. Index for products category filter (used in catalog/filter)
CREATE INDEX IF NOT EXISTS idx_products_category
  ON products (category);
