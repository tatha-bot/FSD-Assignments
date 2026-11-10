<?php
require_once 'db.php';

// Filter by period if provided
$filterStart = $_GET['from_date'] ?? '';
$filterEnd = $_GET['to_date'] ?? '';

$sql = "SELECT * FROM workshops WHERE 1=1";
$params = [];
$types = "";

if (!empty($filterStart) && !empty($filterEnd)) {
    $sql .= " AND (start_date <= ? AND end_date >= ?)";
    $params[] = $filterEnd;
    $params[] = $filterStart;
    $types .= "ss";
}

$sql .= " ORDER BY start_date DESC";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Department of Computer Science - Workshops</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .dept-header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 35px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); transition: transform 0.2s; }
        .card-custom:hover { transform: translateY(-3px); }
        .btn-primary-custom { background-color: #1e3c72; border-color: #1e3c72; color: white; }
        .btn-primary-custom:hover { background-color: #162d55; color: white; }
        .badge-date { background-color: #e3ebf7; color: #1e3c72; font-weight: 600; padding: 6px 12px; border-radius: 20px; }
    </style>
</head>
<body>

<div class="dept-header text-center mb-4">
    <div class="container">
        <h1 class="fw-bold">Department of Computer Science</h1>
        <p class="fs-5 mb-0 text-white-50">Workshops, Seminars & Academic Events Repository</p>
    </div>
</div>

<div class="container pb-5">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 class="fw-bold text-dark mb-0">Conducted Workshops</h3>
        <a href="upload.php" class="btn btn-primary-custom fw-semibold shadow-sm">
            <i class="bi bi-cloud-arrow-up-fill me-1"></i> Upload New Workshop Details
        </a>
    </div>

    <!-- Filter by period -->
    <div class="card card-custom bg-white p-3 mb-4">
        <form method="GET" action="index.php" class="row g-3 align-items-end">
            <div class="col-md-4">
                <label class="form-label fw-semibold text-secondary small">From Date:</label>
                <input type="date" name="from_date" class="form-control" value="<?= htmlspecialchars($filterStart); ?>">
            </div>
            <div class="col-md-4">
                <label class="form-label fw-semibold text-secondary small">To Date:</label>
                <input type="date" name="to_date" class="form-control" value="<?= htmlspecialchars($filterEnd); ?>">
            </div>
            <div class="col-md-4 d-flex gap-2">
                <button type="submit" class="btn btn-primary-custom flex-grow-1"><i class="bi bi-filter"></i> Filter Period</button>
                <a href="index.php" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>
    </div>

    <!-- Workshop Cards -->
    <div class="row g-4">
        <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
                <?php
                    // Count photos
                    $pStmt = $conn->prepare("SELECT COUNT(*) AS total_photos FROM workshop_photos WHERE workshop_id = ?");
                    $pStmt->bind_param("i", $row['id']);
                    $pStmt->execute();
                    $photoCount = $pStmt->get_result()->fetch_assoc()['total_photos'] ?? 0;
                    $pStmt->close();
                ?>
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom h-100 bg-white">
                        <?php if (!empty($row['flyer_path'])): ?>
                            <img src="<?= htmlspecialchars($row['flyer_path']); ?>" class="card-img-top" alt="Flyer" style="height: 200px; object-fit: cover;">
                        <?php else: ?>
                            <div class="bg-light d-flex align-items-center justify-content-center text-muted" style="height: 200px;">
                                <span><i class="bi bi-image me-1"></i> No Flyer Uploaded</span>
                            </div>
                        <?php endif; ?>

                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge-date small">
                                    <i class="bi bi-calendar3 me-1"></i>
                                    <?= date('d M Y', strtotime($row['start_date'])); ?> - <?= date('d M Y', strtotime($row['end_date'])); ?>
                                </span>
                            </div>

                            <h5 class="card-title fw-bold text-dark mt-2 mb-1"><?= htmlspecialchars($row['title']); ?></h5>
                            <p class="text-secondary small mb-2"><i class="bi bi-person-badge me-1"></i> Coordinator: <?= htmlspecialchars($row['coordinator']); ?></p>
                            
                            <p class="card-text text-muted small flex-grow-1">
                                <?= htmlspecialchars(substr($row['description'] ?? '', 0, 110)) . (strlen($row['description'] ?? '') > 110 ? '...' : ''); ?>
                            </p>

                            <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                                <span class="small text-muted"><i class="bi bi-images me-1"></i> <?= $photoCount; ?> Photo(s)</span>
                                <div>
                                    <?php if (!empty($row['report_path'])): ?>
                                        <a href="<?= htmlspecialchars($row['report_path']); ?>" target="_blank" class="btn btn-outline-success btn-sm" title="Download Report">
                                            <i class="bi bi-file-earmark-pdf"></i> Report
                                        </a>
                                    <?php endif; ?>
                                    <a href="view.php?id=<?= $row['id']; ?>" class="btn btn-outline-primary btn-sm">
                                        View Details &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="col-12">
                <div class="alert alert-info text-center py-4">
                    <i class="bi bi-info-circle fs-3 d-block mb-2"></i>
                    No workshop details found for the selected period. Click <strong>"Upload New Workshop Details"</strong> to add one!
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
