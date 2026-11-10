<?php
require_once 'db.php';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: index.php");
    exit;
}

$stmt = $conn->prepare("SELECT * FROM workshops WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$workshop = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$workshop) {
    die("Workshop record not found!");
}

// Fetch photos
$pStmt = $conn->prepare("SELECT * FROM workshop_photos WHERE workshop_id = ?");
$pStmt->bind_param("i", $id);
$pStmt->execute();
$photos = $pStmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($workshop['title']); ?> - Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .dept-header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 25px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .gallery-img { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; transition: transform 0.2s; cursor: pointer; }
        .gallery-img:hover { transform: scale(1.03); }
    </style>
</head>
<body>

<div class="dept-header text-center mb-4">
    <div class="container">
        <h2 class="fw-bold">Department of Computer Science</h2>
        <p class="mb-0 text-white-50">Workshop Documentation</p>
    </div>
</div>

<div class="container pb-5">
    <div class="mb-3">
        <a href="index.php" class="btn btn-outline-secondary btn-sm">&larr; Back to Workshops</a>
    </div>

    <div class="card card-custom p-4 bg-white mb-4">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
                <span class="badge bg-primary px-3 py-2 fs-6 mb-2">
                    <i class="bi bi-calendar-event me-1"></i>
                    Period: <?= date('d M Y', strtotime($workshop['start_date'])); ?> to <?= date('d M Y', strtotime($workshop['end_date'])); ?>
                </span>
                <h2 class="fw-bold text-dark mt-2"><?= htmlspecialchars($workshop['title']); ?></h2>
                <h5 class="text-secondary"><i class="bi bi-person-circle me-1"></i> Coordinator: <?= htmlspecialchars($workshop['coordinator']); ?></h5>
            </div>
            <?php if (!empty($workshop['report_path'])): ?>
                <a href="<?= htmlspecialchars($workshop['report_path']); ?>" download class="btn btn-success shadow-sm">
                    <i class="bi bi-download me-1"></i> Download Workshop Report
                </a>
            <?php endif; ?>
        </div>

        <h5 class="fw-bold text-dark mt-3">Workshop Overview & Summary</h5>
        <p class="text-muted" style="white-space: pre-line;">
            <?= htmlspecialchars($workshop['description'] ?: 'No detailed description provided.'); ?>
        </p>
    </div>

    <div class="row g-4">
        <!-- Flyer section -->
        <div class="col-lg-5">
            <div class="card card-custom p-3 bg-white h-100">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-file-earmark-image me-1"></i> Official Flyer / Poster</h5>
                <?php if (!empty($workshop['flyer_path'])): ?>
                    <a href="<?= htmlspecialchars($workshop['flyer_path']); ?>" target="_blank">
                        <img src="<?= htmlspecialchars($workshop['flyer_path']); ?>" class="img-fluid rounded border shadow-sm" alt="Flyer">
                    </a>
                    <div class="text-center mt-2">
                        <a href="<?= htmlspecialchars($workshop['flyer_path']); ?>" target="_blank" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-box-arrow-up-right me-1"></i> Open Full Flyer
                        </a>
                    </div>
                <?php else: ?>
                    <p class="text-muted small">No flyer uploaded for this event.</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- Photos section -->
        <div class="col-lg-7">
            <div class="card card-custom p-3 bg-white h-100">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-images me-1"></i> Event Photographs</h5>
                <?php if ($photos->num_rows > 0): ?>
                    <div class="row g-2">
                        <?php while ($p = $photos->fetch_assoc()): ?>
                            <div class="col-md-4 col-6">
                                <a href="<?= htmlspecialchars($p['photo_path']); ?>" target="_blank">
                                    <img src="<?= htmlspecialchars($p['photo_path']); ?>" class="gallery-img border" alt="Workshop Photo">
                                </a>
                            </div>
                        <?php endwhile; ?>
                    </div>
                <?php else: ?>
                    <div class="text-muted py-4 text-center">
                        <i class="bi bi-camera fs-3 d-block mb-1"></i>
                        No event photos uploaded yet.
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
