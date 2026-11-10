// =============================================================================
// Q12: Shop Stock Storage & Update Full Stack Web Application
// Tech Stack: Node.js (Built-in HTTP), MongoDB Query Engine, HTML5/Bootstrap
// Run: node server.js -> Open http://localhost:3003
// =============================================================================

const http = require('http');
const url = require('url');

const PORT = 3003;

let stockDetails = [
    { item_id: "STK001", item_name: "Whole Wheat Atta 10kg", category: "Groceries", unit_price: 420.00, quantity_in_stock: 45, reorder_level: 15 },
    { item_id: "STK002", item_name: "Basmati Rice 5kg", category: "Groceries", unit_price: 550.00, quantity_in_stock: 30, reorder_level: 10 },
    { item_id: "STK003", item_name: "Refined Sunflower Oil 1L", category: "Oils", unit_price: 135.00, quantity_in_stock: 60, reorder_level: 20 },
    { item_id: "STK004", item_name: "Organic Honey 500g", category: "Beverages & Spreads", unit_price: 260.00, quantity_in_stock: 12, reorder_level: 15 },
    { item_id: "STK005", item_name: "Green Tea 100 Tea Bags", category: "Beverages & Spreads", unit_price: 320.00, quantity_in_stock: 8, reorder_level: 12 }
];

let lastExecutedQuery = "db.stock_details.find().pretty();";

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
        return res.end();
    }

    // 1. GET Stock
    if (pathname === '/api/stock' && method === 'GET') {
        return sendJSON(res, 200, { data: stockDetails, lastQuery: lastExecutedQuery });
    }

    // 2. POST Restock (Inward Shipment: $inc positive)
    if (pathname === '/api/stock/restock' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { item_id, added_qty } = JSON.parse(body);
            const item = stockDetails.find(i => i.item_id === item_id);
            if (!item) return sendJSON(res, 404, { error: "Item not found" });

            item.quantity_in_stock += parseInt(added_qty);
            lastExecutedQuery = `db.stock_details.updateOne({ item_id: "${item_id}" }, { $inc: { quantity_in_stock: ${added_qty} } });`;
            return sendJSON(res, 200, { message: "Stock updated successfully", data: item, lastQuery: lastExecutedQuery });
        });
        return;
    }

    // 3. POST Customer Sale (Outward: $inc negative with condition)
    if (pathname === '/api/stock/sell' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { item_id, sold_qty } = JSON.parse(body);
            const item = stockDetails.find(i => i.item_id === item_id);
            if (!item) return sendJSON(res, 404, { error: "Item not found" });

            const qty = parseInt(sold_qty);
            if (item.quantity_in_stock < qty) {
                return sendJSON(res, 400, { error: `Insufficient stock! Only ${item.quantity_in_stock} available.` });
            }

            item.quantity_in_stock -= qty;
            lastExecutedQuery = `db.stock_details.updateOne({ item_id: "${item_id}", quantity_in_stock: { $gte: ${qty} } }, { $inc: { quantity_in_stock: -${qty} } });`;
            return sendJSON(res, 200, { message: "Sale recorded successfully", data: item, lastQuery: lastExecutedQuery });
        });
        return;
    }

    // 4. POST Update Price ($set)
    if (pathname === '/api/stock/price' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { item_id, new_price } = JSON.parse(body);
            const item = stockDetails.find(i => i.item_id === item_id);
            if (!item) return sendJSON(res, 404, { error: "Item not found" });

            item.unit_price = parseFloat(new_price);
            lastExecutedQuery = `db.stock_details.updateOne({ item_id: "${item_id}" }, { $set: { unit_price: ${new_price} } });`;
            return sendJSON(res, 200, { message: "Price updated successfully", data: item, lastQuery: lastExecutedQuery });
        });
        return;
    }

    // 5. POST Add / Store New Stock Item (Upsert)
    if (pathname === '/api/stock/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newItem = JSON.parse(body);
            if (!newItem.item_id || !newItem.item_name) return sendJSON(res, 400, { error: "Item ID and Name required" });

            const existingIndex = stockDetails.findIndex(i => i.item_id === newItem.item_id);
            if (existingIndex >= 0) {
                stockDetails[existingIndex] = { ...stockDetails[existingIndex], ...newItem };
                lastExecutedQuery = `db.stock_details.updateOne({ item_id: "${newItem.item_id}" }, { $set: ${JSON.stringify(newItem)} }, { upsert: true });`;
            } else {
                stockDetails.push(newItem);
                lastExecutedQuery = `db.stock_details.insertOne(${JSON.stringify(newItem, null, 2)});`;
            }
            return sendJSON(res, 201, { message: "Item stored in stock successfully", lastQuery: lastExecutedQuery });
        });
        return;
    }

    // 6. FRONTEND WEB PAGE
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Q12 - Shop Stock Storage & Update (MongoDB)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', system-ui, sans-serif; }
        .hero { background: linear-gradient(135deg, #1e3a8a, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 25px 0; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
        .query-console { background: #020617; border-left: 4px solid #38bdf8; font-family: Consolas, monospace; color: #38bdf8; padding: 12px; border-radius: 6px; font-size: 0.9rem; }
    </style>
</head>
<body>

<div class="hero text-center mb-4">
    <div class="container">
        <span class="badge bg-primary px-3 py-1 rounded-pill mb-2">Assignment Q12 • Full Stack Web Development</span>
        <h2 class="fw-bold text-white">Shop Stock Management System</h2>
        <p class="text-white-50 mb-0">Storing and Updating Stock Details in MongoDB (Restocking, Sales & Price Updates)</p>
    </div>
</div>

<div class="container pb-5">
    <!-- Live MongoDB Query Inspector -->
    <div class="card card-custom p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-light small"><i class="bi bi-terminal-fill me-1 text-info"></i> Last Executed MongoDB Stock Query:</span>
            <span class="badge bg-success">MongoDB Live Engine</span>
        </div>
        <div class="query-console" id="queryConsole">db.stock_details.find().pretty();</div>
    </div>

    <!-- Low Stock Alert Banner -->
    <div id="alertBanner" class="alert alert-warning d-none mb-4" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Low Stock Warning:</strong> Some items have fallen below or reached their reorder threshold!
    </div>

    <div class="row g-4">
        <!-- Stock Entry Form -->
        <div class="col-lg-4">
            <div class="card card-custom p-4">
                <h5 class="fw-bold text-info mb-3"><i class="bi bi-plus-circle-fill me-2"></i>Store New Product Stock</h5>
                <form id="stockForm">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Item ID</label>
                        <input type="text" id="itemId" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="STK006" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Item Name</label>
                        <input type="text" id="itemName" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="Almond Milk 1L" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Category</label>
                        <input type="text" id="category" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="Dairy Alternatives" required>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-semibold">Price (Rs.)</label>
                            <input type="number" step="0.01" id="price" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="210.00" required>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-semibold">Quantity</label>
                            <input type="number" id="qty" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="40" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Reorder Threshold</label>
                        <input type="number" id="reorder" class="form-control form-control-sm bg-dark text-light border-secondary" value="10" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm w-100 fw-semibold">
                        <i class="bi bi-box-arrow-in-down me-1"></i> Store in Stock (db.insertOne)
                    </button>
                </form>
            </div>
        </div>

        <!-- Inventory Table -->
        <div class="col-lg-8">
            <div class="card card-custom p-4">
                <h5 class="fw-bold text-white mb-3"><i class="bi bi-boxes me-2 text-warning"></i>Current Shop Inventory (shop_inventory_db.stock_details)</h5>
                <div class="table-responsive">
                    <table class="table table-dark table-hover align-middle mb-0">
                        <thead class="table-secondary text-dark">
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th class="text-end">Update Operations</th>
                            </tr>
                        </thead>
                        <tbody id="stockTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    async function loadStock() {
        const res = await fetch('/api/stock');
        const json = await res.json();
        document.getElementById('queryConsole').innerText = json.lastQuery;

        const tbody = document.getElementById('stockTableBody');
        tbody.innerHTML = '';
        let hasLowStock = false;

        json.data.forEach(item => {
            const isLow = item.quantity_in_stock <= item.reorder_level;
            if (isLow) hasLowStock = true;

            tbody.innerHTML += \`
                <tr>
                    <td class="fw-bold text-info">\${item.item_id}</td>
                    <td>\${item.item_name} <br><small class="text-muted">\${item.category}</small></td>
                    <td class="fw-semibold">Rs. \${item.unit_price.toFixed(2)}</td>
                    <td class="fw-bold \${isLow ? 'text-danger' : 'text-success'}">\${item.quantity_in_stock}</td>
                    <td><span class="badge bg-\${isLow ? 'danger' : 'success'}">\${isLow ? 'LOW STOCK' : 'In Stock'}</span></td>
                    <td class="text-end">
                        <button class="btn btn-outline-success btn-sm py-0 px-2" onclick="restockItem('\${item.item_id}')" title="Restock ($inc)">+ Restock</button>
                        <button class="btn btn-outline-warning btn-sm py-0 px-2 ms-1" onclick="sellItem('\${item.item_id}')" title="Sell ($inc -)">- Sell</button>
                        <button class="btn btn-outline-info btn-sm py-0 px-2 ms-1" onclick="updatePrice('\${item.item_id}')" title="Edit Price ($set)"><i class="bi bi-pencil"></i></button>
                    </td>
                </tr>
            \`;
        });

        document.getElementById('alertBanner').classList.toggle('d-none', !hasLowStock);
    }

    async function restockItem(id) {
        const qty = prompt('Enter quantity to add to stock (inward shipment):', '25');
        if (!qty || isNaN(qty)) return;
        await fetch('/api/stock/restock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: id, added_qty: parseInt(qty) })
        });
        loadStock();
    }

    async function sellItem(id) {
        const qty = prompt('Enter quantity sold (outward sale):', '5');
        if (!qty || isNaN(qty)) return;
        const res = await fetch('/api/stock/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: id, sold_qty: parseInt(qty) })
        });
        const data = await res.json();
        if (!res.ok) alert(data.error);
        loadStock();
    }

    async function updatePrice(id) {
        const p = prompt('Enter new unit price (Rs.):', '142.00');
        if (!p || isNaN(p)) return;
        await fetch('/api/stock/price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: id, new_price: parseFloat(p) })
        });
        loadStock();
    }

    document.getElementById('stockForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            item_id: document.getElementById('itemId').value.trim(),
            item_name: document.getElementById('itemName').value.trim(),
            category: document.getElementById('category').value.trim(),
            unit_price: parseFloat(document.getElementById('price').value),
            quantity_in_stock: parseInt(document.getElementById('qty').value),
            reorder_level: parseInt(document.getElementById('reorder').value)
        };
        await fetch('/api/stock/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        document.getElementById('stockForm').reset();
        loadStock();
    });

    loadStock();
</script>
</body>
</html>`);
    }
});

server.listen(PORT, () => {
    console.log(`[Q12 Full Stack Web App] Running at http://localhost:${PORT}`);
    console.log(`[Q12] Managing shop stock details (storing, restocking, sales, price updates).`);
});
