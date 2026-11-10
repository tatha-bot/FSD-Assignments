# Q8: Update Product Price (+5% Increase) in PHP & MySQL

## Problem Statement
A database contains product name, product ID and price. Write a PHP program to update the price of products available in the database by giving 5% increase in their price.

---

## Core SQL Query Used
```sql
UPDATE product SET price = ROUND(price * 1.05, 2);
```

---

## Features
- **One-Click 5% Price Increase:** Executes the SQL `UPDATE` statement across all products in inventory.
- **Dynamic Price Comparison:** Highlights Old Price vs +5% Hike vs New Updated Price.
- **Inventory Statistics:** Displays total catalog size, average product price, and overall inventory value.
- **Reset Initial Prices:** Easily reset product prices back to their original benchmark for lab demonstration.
- **Add Product Form:** Allows entering new inventory items.
- **Auto-Database Initializer:** Auto-creates database `product_inventory_db` and seeds initial products on first visit.

---

## File Structure
- `db.php` - Database connection and automatic table and catalog seeder.
- `index.php` - Complete interactive PHP page executing the 5% hike and displaying the catalog.
- `database.sql` - Standalone SQL schema and records.

---

## How to Run
1. Start **Apache** and **MySQL** in XAMPP / WAMP.
2. Put the `Q8` folder in your `htdocs` directory (e.g. `C:/xampp/htdocs/Q8`).
3. Open your browser and visit:
   ```
   http://localhost/Q8/
   ```
4. Or run via PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
   and visit `http://localhost:8000`.
