CREATE DATABASE IF NOT EXISTS arena_booking;
USE arena_booking;

CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  date_start DATE,
  date_end DATE,
  is_active TINYINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(64),
  seating_type VARCHAR(64),
  ticket_amount INT,
  payment_method VARCHAR(64),
  special_requirements TEXT,
  id_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(64),
  inquiry_type VARCHAR(64),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (username, password)
VALUES ('admin', '$2b$10$Q9Zm7e8pS/jt4K9q6r6o1.QjF3E3P8Vxv4cQw1Q/Y2f6ZybjXB0Ni'); -- password: admin123