<?php
require_once 'db.php';

$message = "";
$messageType = "";
$hikeApplied = false;

// Store previous prices in session or temporary array for visual diff if needed
$oldPrices = [];

// Handle 5% Price Increase Action
if (isset($_POST['apply_price_increase'])) {
    // Fetch current prices before update to display old vs new
    $prevQuery = $conn->query("SELECT product_id, price FROM product");
    while ($row = $prevQuery->fetch_assoc()) {
        $oldPrices[$row['product_id']] = floatval($row['price']);
    }

    $updateSQL = "UPDATE product SET price = ROUND(price * 1.05, 2)";
    if ($conn->query($updateSQL)) {
        $affected = $conn->affected_rows;
        $message = "Successfully applied a 5% price increase across all products! ($affected products updated)";
        $messageType = "success";
        $hikeApplied = true;
    } else {
        $message = "Error updating product prices: " . $conn->error;
        $messageType = "danger";
    }
}

// Handle Reset Data Action
if (isset($_POST['reset_products'])) {
    seedProducts($conn);
    $message = "Product inventory reset to initial base prices!";
    $messageType = "info";
}

// Handle Add Product
if (isset($_POST['add_product'])) {
    $prdId = strtoupper(trim($_POST['product_id'] ?? ''));
    $prdName = trim($_POST['product_name'] ?? '');
    $price = floatval($_POST['price'] ?? 0);

    if (!empty($prdId) && !empty($prdName) && $price > 0) {
        $stmt = $conn->prepare("INSERT INTO product (product_id, product_name, price) VALUES (?, ?, ?)");
        $stmt->bind_param("ssd", $prdId, $prdName, $price);
        if ($stmt->execute()) {
            $message = "Product '$prdName' ($prdId) added successfully!";
            $messageType = "success";
        } else {
            $message = "Error: " . ($conn->errno === 1062 ? "Product ID already exists." : $conn->error);
            $messageType = "danger";
        }
        $stmt->close();
    }
}

// Fetch all products
$products = $conn->query("SELECT * FROM product ORDER BY product_id ASC");

// Calculate inventory statistics
$stats = $conn->query("SELECT COUNT(*) AS total_items, AVG(price) AS avg_price, SUM(price) AS total_val FROM product")->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Product Prices (+5% Increase) - PHP/MySQL</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #f7f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .hero-banner { background: linear-gradient(135deg, #1f4068, #162447); color: white; padding: 30px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .price-badge { background-color: #e8f5e9; color: #1b5e20; font-size: 1rem; font-weight: 700; border: 1px solid #c8e6c9; }
        .stat-box { background: white; border-radius: 10px; padding: 18px; border-left: 5px solid #1f4068; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
    </style>
</head>
<body>

<div class="hero-banner text-center mb-4">
    <div class="container">
        <h1 class="fw-bold">Product Inventory & Pricing System</h1>
        <p class="fs-5 mb-0 text-white-50">Assignment Q8: Update Product Prices by Giving 5% Increase in PHP</p>
    </div>
</div>

<div class="container pb-5">
    <?php if (!empty($message)): ?>
        <div class="alert alert-<?= $messageType; ?> alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> <?= htmlspecialchars($message); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Summary Stats -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="stat-box">
                <span class="text-secondary small fw-semibold">Total Product Catalog</span>
                <h3 class="fw-bold text-dark mt-1 mb-0"><?= $stats['total_items'] ?? 0; ?> Products</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-box" style="border-left-color: #28a745;">
                <span class="text-secondary small fw-semibold">Average Item Price</span>
                <h3 class="fw-bold text-success mt-1 mb-0">₹<?= number_format($stats['avg_price'] ?? 0, 2); ?></h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-box" style="border-left-color: #fd7e14;">
                <span class="text-secondary small fw-semibold">Total Inventory Value</span>
                <h3 class="fw-bold text-warning mt-1 mb-0">₹<?= number_format($stats['total_val'] ?? 0, 2); ?></h3>
            </div>
        </div>
    </div>

    <!-- Action Toolbar -->
    <div class="card card-custom bg-white p-3 mb-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
                <h5 class="fw-bold text-dark mb-1">Pricing Operations</h5>
                <p class="text-muted small mb-0">Apply inflation or standard margin adjustment (+5%) to all inventory items.</p>
            </div>
            <div class="d-flex gap-2">
                <form method="POST" action="index.php" onsubmit="return confirm('Are you sure you want to increase the price of ALL products by 5%?');">
                    <button type="submit" name="apply_price_increase" class="btn btn-primary fw-semibold shadow-sm">
                        <i class="bi bi-tag-fill me-1"></i> Apply 5% Price Increase
                    </button>
                </form>
                <form method="POST" action="index.php">
                    <button type="submit" name="reset_products" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Initial Prices
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Products Table -->
    <div class="card card-custom bg-white overflow-hidden mb-4">
        <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="fw-bold text-dark mb-0"><i class="bi bi-box-seam me-2"></i> Current Product Price List</h5>
            <code>Query: UPDATE product SET price = price * 1.05;</code>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 text-center">
                <thead class="table-light">
                    <tr>
                        <th style="width: 80px;">#</th>
                        <th class="text-start">Product ID</th>
                        <th class="text-start">Product Name</th>
                        <?php if ($hikeApplied): ?>
                            <th class="text-end">Old Price</th>
                            <th class="text-end text-success">+5% Hike</th>
                        <?php endif; ?>
                        <th class="text-end">Current Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($products->num_rows > 0): ?>
                        <?php 
                            $i = 1;
                            while ($row = $products->fetch_assoc()): 
                        ?>
                            <tr>
                                <td class="text-muted"><?= $i++; ?></td>
                                <td class="text-start fw-bold text-primary"><?= htmlspecialchars($row['product_id']); ?></td>
                                <td class="text-start fw-semibold text-dark"><?= htmlspecialchars($row['product_name']); ?></td>
                                
                                <?php if ($hikeApplied): ?>
                                    <td class="text-end text-muted">
                                        ₹<?= isset($oldPrices[$row['product_id']]) ? number_format($oldPrices[$row['product_id']], 2) : '-'; ?>
                                    </td>
                                    <td class="text-end text-success fw-semibold">
                                        +₹<?= isset($oldPrices[$row['product_id']]) ? number_format($row['price'] - $oldPrices[$row['product_id']], 2) : '-'; ?>
                                    </td>
                                <?php endif; ?>

                                <td class="text-end">
                                    <span class="badge price-badge px-3 py-2">
                                        ₹<?= number_format($row['price'], 2); ?>
                                    </span>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="5" class="py-4 text-muted">No products available in the database.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add Product Form -->
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card card-custom bg-white p-4">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-plus-circle me-1"></i> Add New Product to Catalog</h5>
                <form action="index.php" method="POST" class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label fw-semibold small">Product ID</label>
                        <input type="text" name="product_id" class="form-control" placeholder="PRD009" required>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label fw-semibold small">Product Name</label>
                        <input type="text" name="product_name" class="form-control" placeholder="Wireless Bluetooth Speaker" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold small">Base Price (₹)</label>
                        <div class="input-group">
                            <input type="number" step="0.01" name="price" class="form-control" placeholder="1800.00" required>
                            <button type="submit" name="add_product" class="btn btn-primary fw-semibold">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
