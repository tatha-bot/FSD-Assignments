# Assignment 12: Storing and Updating Shop Stock Details in MongoDB

## Aim
To develop a database program in MongoDB for storing and updating stock details in a retail shop, including inward restocking, customer sales deductions, and unit price revisions.

---

## Database Design
- **Database Name:** `shop_inventory_db`
- **Collection Name:** `stock_details`

### Sample Schema
```json
{
  "_id": ObjectId("..."),
  "item_id": "STK001",
  "item_name": "Whole Wheat Atta 10kg",
  "category": "Groceries",
  "unit_price": 420.00,
  "quantity_in_stock": 45,
  "reorder_level": 15
}
```

---

## Core MongoDB Operations

### 1. Storing Initial Stock Details
```javascript
use shop_inventory_db;

db.stock_details.insertMany([
    {
        item_id: "STK001",
        item_name: "Whole Wheat Atta 10kg",
        category: "Groceries",
        unit_price: 420.00,
        quantity_in_stock: 45,
        reorder_level: 15
    },
    {
        item_id: "STK002",
        item_name: "Basmati Rice 5kg",
        category: "Groceries",
        unit_price: 550.00,
        quantity_in_stock: 30,
        reorder_level: 10
    },
    {
        item_id: "STK003",
        item_name: "Refined Sunflower Oil 1L",
        category: "Oils",
        unit_price: 135.00,
        quantity_in_stock: 60,
        reorder_level: 20
    }
]);
```

### 2. Updating Stock Details

#### A. Inward Restocking (+25 units added to stock)
```javascript
db.stock_details.updateOne(
    { item_id: "STK001" },
    { $inc: { quantity_in_stock: 25 } }
);
```

#### B. Outward Customer Sale (Deduct 5 units safely)
```javascript
db.stock_details.updateOne(
    { item_id: "STK002", quantity_in_stock: { $gte: 5 } },
    { $inc: { quantity_in_stock: -5 } }
);
```

#### C. Price Revision ($set)
```javascript
db.stock_details.updateOne(
    { item_id: "STK003" },
    { $set: { unit_price: 142.00 } }
);
```

### 3. Querying Low Stock Alerts
```javascript
// Find items whose quantity is at or below reorder level
db.stock_details.find({
    $expr: { $lte: ["$quantity_in_stock", "$reorder_level"] }
});
```

---

## How to Run

### Method 1: In MongoDB Shell (`mongosh`)
```bash
mongosh < mongo_queries.js
```

### Method 2: Running Full Stack Web Application
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser at:
   ```
   http://localhost:3003
   ```
   Use the interactive portal to view inventory, restock items, record sales, edit prices, or store new products.

---

## Result
A shop stock management system was developed in MongoDB, and operations for storing stock details, updating quantities, revising prices, and querying low stock items were executed successfully.
