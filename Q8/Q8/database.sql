-- Database Schema for Q8: Product Price Update
CREATE DATABASE IF NOT EXISTS `product_inventory_db`;
USE `product_inventory_db`;

CREATE TABLE IF NOT EXISTS `product` (
    `product_id` VARCHAR(20) PRIMARY KEY,
    `product_name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL
);

-- Initial Sample Product Catalog
INSERT INTO `product` (`product_id`, `product_name`, `price`) VALUES
('PRD001', 'Wireless Ergonomic Mouse', 1200.00),
('PRD002', 'Mechanical RGB Gaming Keyboard', 3500.00),
('PRD003', '27-inch 4K IPS Monitor', 24500.00),
('PRD004', 'Noise-Cancelling Bluetooth Headphones', 6800.00),
('PRD005', 'USB-C Multiport Docking Station', 2900.00),
('PRD006', '1TB External NVMe SSD', 8200.00),
('PRD007', 'Full HD 1080p Web Camera', 2100.00),
('PRD008', 'Ergonomic Laptop Stand', 950.00);

-- Query to update prices by giving 5% increase:
-- UPDATE product SET price = ROUND(price * 1.05, 2);
