-- =========================================================
-- Order Management System - Complete Schema
-- MySQL 8.0+
-- =========================================================

CREATE DATABASE IF NOT EXISTS order_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE order_management;

-- =========================================================
-- USERS
-- Internal team members who operate the system (NOT customers)
-- =========================================================
CREATE TABLE users (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(191) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,        -- bcrypt hash, never plain text
  role              ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  avatar_public_id  VARCHAR(255) NULL,             -- Cloudinary public_id
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- =========================================================
-- REFRESH TOKENS
-- Allows real logout / session revocation
-- =========================================================
CREATE TABLE refresh_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,      -- hashed refresh token, never stored raw
  expires_at  DATETIME NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_user (user_id),
  INDEX idx_refresh_expires (expires_at)
) ENGINE=InnoDB;

-- =========================================================
-- WORKSPACE SETTINGS
-- Single-row global configuration (NOT multi-tenant).
-- Backs the Settings page without implementing full
-- multi-workspace isolation, which is out of scope for this test.
-- =========================================================
CREATE TABLE workspace_settings (
  id                          TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  workspace_name              VARCHAR(150) NOT NULL DEFAULT 'Orderly HQ',
  default_timezone            VARCHAR(60)  NOT NULL DEFAULT 'America/New_York',
  default_currency            VARCHAR(3)   NOT NULL DEFAULT 'USD',
  default_order_status        ENUM('pending','completed','cancelled')
                               NOT NULL DEFAULT 'pending',
  require_order_review        BOOLEAN NOT NULL DEFAULT FALSE,
  allow_partial_fulfillment   BOOLEAN NOT NULL DEFAULT FALSE,
  notify_customers_on_status  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_single_row CHECK (id = 1)
) ENGINE=InnoDB;

INSERT INTO workspace_settings (id) VALUES (1);

-- =========================================================
-- CUSTOMERS
-- =========================================================
CREATE TABLE customers (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  company_name   VARCHAR(150) NULL,
  customer_type  ENUM('individual','smb','enterprise')
                 NOT NULL DEFAULT 'individual',
  email          VARCHAR(191) NOT NULL,
  phone          VARCHAR(30)  NULL,
  address        VARCHAR(255) NULL,
  status         ENUM('active','paused') NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMP NULL DEFAULT NULL,     -- soft delete: preserve order history
  UNIQUE KEY uq_customers_email (email),
  INDEX idx_customers_name (name),
  INDEX idx_customers_type (customer_type),
  INDEX idx_customers_status (status)
) ENGINE=InnoDB;

-- =========================================================
-- PRODUCTS
-- =========================================================
CREATE TABLE products (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  description      VARCHAR(500) NULL,
  category         VARCHAR(100) NULL,
  sku              VARCHAR(50)  NULL,
  price            DECIMAL(10,2) NOT NULL,
  stock            INT UNSIGNED NULL,               -- nullable: digital products may not track stock
  status           ENUM('active','draft','out_of_stock')
                   NOT NULL DEFAULT 'active',
  image_public_id  VARCHAR(255) NULL,                -- Cloudinary public_id (generates all sizes on the fly)
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMP NULL DEFAULT NULL,     -- soft delete: preserve order history
  UNIQUE KEY uq_products_sku (sku),
  INDEX idx_products_name (name),
  INDEX idx_products_category (category),
  INDEX idx_products_status (status),
  CONSTRAINT chk_products_price CHECK (price >= 0)
) ENGINE=InnoDB;

-- =========================================================
-- ORDERS
-- Only 3 statuses per test requirements: pending / completed / cancelled
-- =========================================================
CREATE TABLE orders (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id         BIGINT UNSIGNED NOT NULL,
  created_by_user_id  BIGINT UNSIGNED NULL,          -- internal user who registered the order
  status              ENUM('pending', 'completed', 'cancelled')
                      NOT NULL DEFAULT 'pending',
  total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                      ON UPDATE CURRENT_TIMESTAMP,
  cancelled_at        TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
      REFERENCES customers(id) ON DELETE RESTRICT,
  CONSTRAINT fk_orders_created_by FOREIGN KEY (created_by_user_id)
      REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at),
  INDEX idx_orders_created_by (created_by_user_id)
) ENGINE=InnoDB;

-- =========================================================
-- ORDER_ITEMS
-- Resolves the M:N relationship between orders and products
-- =========================================================
CREATE TABLE order_items (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  quantity    INT UNSIGNED NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,               -- price snapshot at order time
  subtotal    DECIMAL(10,2)
              GENERATED ALWAYS AS (quantity * unit_price) STORED,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id)
      REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id)
      REFERENCES products(id) ON DELETE RESTRICT,
  CONSTRAINT uq_order_product UNIQUE (order_id, product_id),  -- one row per product per order
  INDEX idx_items_order (order_id),
  INDEX idx_items_product (product_id),
  CONSTRAINT chk_items_quantity CHECK (quantity > 0)
) ENGINE=InnoDB;



-- =========================================================
-- WORKSPACES
-- Minimal multi-workspace support: shared customers/products,
-- workspace-scoped orders only.
-- =========================================================
CREATE TABLE workspaces (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_workspaces_slug (slug)
) ENGINE=InnoDB;

INSERT INTO workspaces (name, slug) VALUES
  ('Orderly HQ', 'orderly-hq'),
  ('Orderly EU', 'orderly-eu');

-- Add workspace_id to orders
ALTER TABLE orders
  ADD COLUMN workspace_id BIGINT UNSIGNED NOT NULL DEFAULT 1 AFTER customer_id,
  ADD CONSTRAINT fk_orders_workspace FOREIGN KEY (workspace_id)
      REFERENCES workspaces(id) ON DELETE RESTRICT,
  ADD INDEX idx_orders_workspace (workspace_id);