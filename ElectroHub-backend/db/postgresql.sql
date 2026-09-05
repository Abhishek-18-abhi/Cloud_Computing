-- Run this after creating/selecting the `electronic_store` database in pgAdmin.
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  product_category VARCHAR(100),
  product_description TEXT,
  product_price NUMERIC(10,2) NOT NULL,
  product_stock INTEGER NOT NULL DEFAULT 0,
  product_image VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(300) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  transaction_id VARCHAR(100),
  total_amount NUMERIC(10,2) NOT NULL,
  order_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  product_name VARCHAR(200) NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  product_quantity INTEGER NOT NULL CHECK (product_quantity > 0),
  product_image VARCHAR(500),
  subtotal NUMERIC(10,2) NOT NULL
);
