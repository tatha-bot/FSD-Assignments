// =============================================================================
// Q12: Shop Stock Management System in MongoDB
// Database: shop_inventory_db
// Collection: stock_details
// =============================================================================

// 1. Switch to database
use shop_inventory_db;

// Clean up existing collection
db.stock_details.drop();

print("========== 1. STORING INITIAL SHOP STOCK DETAILS ==========");

db.stock_details.insertMany([
    {
        item_id: "STK001",
        item_name: "Whole Wheat Atta 10kg",
        category: "Groceries",
        unit_price: 420.00,
        quantity_in_stock: 45,
        reorder_level: 15,
        last_updated: new Date()
    },
    {
        item_id: "STK002",
        item_name: "Basmati Rice 5kg",
        category: "Groceries",
        unit_price: 550.00,
        quantity_in_stock: 30,
        reorder_level: 10,
        last_updated: new Date()
    },
    {
        item_id: "STK003",
        item_name: "Refined Sunflower Oil 1L",
        category: "Oils",
        unit_price: 135.00,
        quantity_in_stock: 60,
        reorder_level: 20,
        last_updated: new Date()
    },
    {
        item_id: "STK004",
        item_name: "Organic Honey 500g",
        category: "Beverages & Spreads",
        unit_price: 260.00,
        quantity_in_stock: 12, // Close to reorder level
        reorder_level: 15,
        last_updated: new Date()
    },
    {
        item_id: "STK005",
        item_name: "Green Tea 100 Tea Bags",
        category: "Beverages & Spreads",
        unit_price: 320.00,
        quantity_in_stock: 8,  // Low stock!
        reorder_level: 12,
        last_updated: new Date()
    }
]);

print("Initial shop stock stored successfully.\n");

print("--- Current Shop Inventory ---");
db.stock_details.find({}, { _id: 0 }).pretty();

print("\n========== 2. UPDATING STOCK DETAILS ==========");

// 2.1 Restock: Inward shipment of goods (Increase stock by +25 for STK001)
print("\n--- 2.1 Restocking: Add 25 units to Whole Wheat Atta (STK001) ---");
db.stock_details.updateOne(
    { item_id: "STK001" },
    {
        $inc: { quantity_in_stock: 25 },
        $set: { last_updated: new Date() }
    }
);

// 2.2 Customer Sale: Outward stock deduction (Sell 5 units of Basmati Rice STK002)
// Protect against negative stock using { quantity_in_stock: { $gte: 5 } }
print("\n--- 2.2 Sales: Deduct 5 units from Basmati Rice (STK002) upon sale ---");
db.stock_details.updateOne(
    { item_id: "STK002", quantity_in_stock: { $gte: 5 } },
    {
        $inc: { quantity_in_stock: -5 },
        $set: { last_updated: new Date() }
    }
);

// 2.3 Price Revision: Update unit price of Sunflower Oil (STK003) from 135 to 142
print("\n--- 2.3 Price Revision: Update price of Sunflower Oil (STK003) to 142.00 ---");
db.stock_details.updateOne(
    { item_id: "STK003" },
    {
        $set: {
            unit_price: 142.00,
            last_updated: new Date()
        }
    }
);

// 2.4 Upsert Operation: Add new product or update if existing
print("\n--- 2.4 Upsert: Add new stock item (STK006 - Almond Milk) if not exists ---");
db.stock_details.updateOne(
    { item_id: "STK006" },
    {
        $set: {
            item_name: "Almond Milk 1L",
            category: "Dairy Alternatives",
            unit_price: 210.00,
            reorder_level: 10,
            last_updated: new Date()
        },
        $setOnInsert: {
            quantity_in_stock: 40
        }
    },
    { upsert: true }
);

print("\n========== 3. INVENTORY QUERIES & STOCK ALERTS ==========");

// 3.1 Find items that need to be reordered (Low Stock Alert: quantity <= reorder_level)
print("\n--- 3.1 Low Stock Alert (quantity_in_stock <= reorder_level) ---");
db.stock_details.find(
    {
        $expr: { $lte: ["$quantity_in_stock", "$reorder_level"] }
    },
    { _id: 0, item_id: 1, item_name: 1, quantity_in_stock: 1, reorder_level: 1 }
).pretty();

// 3.2 Total Inventory Valuation using Aggregation
print("\n--- 3.2 Total Inventory Stock Valuation ---");
db.stock_details.aggregate([
    {
        $project: {
            _id: 0,
            item_name: 1,
            quantity_in_stock: 1,
            unit_price: 1,
            item_total_value: { $multiply: ["$quantity_in_stock", "$unit_price"] }
        }
    },
    {
        $group: {
            _id: null,
            total_items: { $sum: 1 },
            total_stock_count: { $sum: "$quantity_in_stock" },
            overall_inventory_value: { $sum: "$item_total_value" }
        }
    }
]).forEach(printjson);

print("\n========================================================");
print("               UPDATED FINAL STOCK DETAILS              ");
print("========================================================");
db.stock_details.find({}, { _id: 0 }).pretty();
