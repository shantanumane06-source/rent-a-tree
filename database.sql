CREATE DATABASE IF NOT EXISTS rent_a_tree;
USE rent_a_tree;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  address TEXT,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT NULL,
  status ENUM('active','suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  farm_location TEXT,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT NULL,
  status ENUM('pending','approved','suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  tree_code VARCHAR(50) UNIQUE NOT NULL,
  tree_type VARCHAR(100) NOT NULL,
  age_years INT DEFAULT 0,
  city VARCHAR(100) NOT NULL,
  farm_location TEXT,
  tree_image VARCHAR(255),
  maintenance_cost DECIMAL(10,2) NOT NULL,
  delivery_cost DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('pending','approved','rejected','adopted','harvested') DEFAULT 'pending',
  growth_status ENUM('Planted','Flowering','Fruits Ready','Harvested') DEFAULT 'Planted',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS adoptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  tree_id INT NOT NULL,
  delivery_type ENUM('market_sale','home_delivery') NOT NULL,
  adoption_fee DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  total_payment DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending','paid','refunded') DEFAULT 'paid',
  profit_share DECIMAL(10,2) DEFAULT 0.00,
  adopted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (tree_id) REFERENCES trees(id)
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tree_id INT NOT NULL,
  farmer_id INT NOT NULL,
  activity_type ENUM('fertilizer','water','labor','other') NOT NULL,
  description TEXT,
  log_image VARCHAR(255),
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tree_id) REFERENCES trees(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

CREATE TABLE IF NOT EXISTS harvests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tree_id INT NOT NULL,
  adoption_id INT NOT NULL,
  fruit_image VARCHAR(255),
  yield_kg DECIMAL(8,2),
  market_price_per_kg DECIMAL(8,2),
  total_revenue DECIMAL(10,2),
  platform_commission DECIMAL(10,2) DEFAULT 0.00,
  customer_profit DECIMAL(10,2) DEFAULT 0.00,
  harvest_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tree_id) REFERENCES trees(id),
  FOREIGN KEY (adoption_id) REFERENCES adoptions(id)
);

CREATE TABLE IF NOT EXISTS disputes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adoption_id INT NOT NULL,
  raised_by_type ENUM('customer','farmer') NOT NULL,
  raised_by_id INT NOT NULL,
  issue_type ENUM('missing_images','late_delivery','payment_error','other') NOT NULL,
  description TEXT,
  status ENUM('open','resolved','closed') DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adoption_id) REFERENCES adoptions(id)
);

-- Default admin (password: admin123)
INSERT IGNORE INTO admins (name, email, password) VALUES 
('Super Admin', 'admin@rentAtree.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Sample farmer (password: farmer123)
INSERT IGNORE INTO farmers (name, email, phone, city, farm_location, password, status) VALUES
('Ramesh Patil', 'farmer@test.com', '9876543210', 'Pune', 'Village Shirur, Pune District', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa0k5K6pY.RGjzFoHd6s6ByTMMH9JIoS', 'approved');

-- Sample customer (password: customer123)
INSERT IGNORE INTO customers (name, email, phone, city, address, password) VALUES
('Priya Sharma', 'customer@test.com', '9123456780', 'Mumbai', 'Andheri West, Mumbai', '$2a$10$rIJ/u/M1VqMTMlmHiWGOVOe.LrCH2vGjYzBB3NJJ9LLe3Y6IbT0oG');
