<?php
require_once 'db.php';

$message = "";
$messageType = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $coordinator = trim($_POST['coordinator'] ?? '');
    $startDate = $_POST['start_date'] ?? '';
    $endDate = $_POST['end_date'] ?? '';
    $description = trim($_POST['description'] ?? '');

    if (empty($title) || empty($coordinator) || empty($startDate) || empty($endDate)) {
        $message = "Please fill in all required fields.";
        $messageType = "danger";
    } else {
        // Ensure directories exist
        $uploadDir = __DIR__ . '/uploads/';
        $flyerDir = $uploadDir . 'flyers/';
        $photoDir = $uploadDir . 'photos/';
        $reportDir = $uploadDir . 'reports/';

        foreach ([$uploadDir, $flyerDir, $photoDir, $reportDir] as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
        }

        // Handle Flyer Upload
        $flyerPath = null;
        if (isset($_FILES['flyer']) && $_FILES['flyer']['error'] === UPLOAD_ERR_OK) {
            $flyerExt = pathinfo($_FILES['flyer']['name'], PATHINFO_EXTENSION);
            $flyerFileName = 'flyer_' . time() . '_' . uniqid() . '.' . $flyerExt;
            $dest = $flyerDir . $flyerFileName;
            if (move_uploaded_file($_FILES['flyer']['tmp_name'], $dest)) {
                $flyerPath = 'uploads/flyers/' . $flyerFileName;
            }
        }

        // Handle Report Upload (PDF/DOC)
        $reportPath = null;
        if (isset($_FILES['report']) && $_FILES['report']['error'] === UPLOAD_ERR_OK) {
            $reportExt = pathinfo($_FILES['report']['name'], PATHINFO_EXTENSION);
            $reportFileName = 'report_' . time() . '_' . uniqid() . '.' . $reportExt;
            $dest = $reportDir . $reportFileName;
            if (move_uploaded_file($_FILES['report']['tmp_name'], $dest)) {
                $reportPath = 'uploads/reports/' . $reportFileName;
            }
        }

        // Insert Workshop Record
        $stmt = $conn->prepare("INSERT INTO workshops (title, coordinator, start_date, end_date, description, flyer_path, report_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $title, $coordinator, $startDate, $endDate, $description, $flyerPath, $reportPath);
        
        if ($stmt->execute()) {
            $workshopId = $conn->insert_id;

            // Handle Multiple Photos Upload
            if (isset($_FILES['photos']) && !empty($_FILES['photos']['name'][0])) {
                $photoCount = count($_FILES['photos']['name']);
                for ($i = 0; $i < $photoCount; $i++) {
                    if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                        $pExt = pathinfo($_FILES['photos']['name'][$i], PATHINFO_EXTENSION);
                        $photoFileName = 'photo_' . time() . '_' . $i . '_' . uniqid() . '.' . $pExt;
                        $destPhoto = $photoDir . $photoFileName;
                        if (move_uploaded_file($_FILES['photos']['tmp_name'][$i], $destPhoto)) {
                            $savedPhotoPath = 'uploads/photos/' . $photoFileName;
                            $pStmt = $conn->prepare("INSERT INTO workshop_photos (workshop_id, photo_path) VALUES (?, ?)");
                            $pStmt->bind_param("is", $workshopId, $savedPhotoPath);
                            $pStmt->execute();
                            $pStmt->close();
                        }
                    }
                }
            }

            $message = "Workshop details, flyer, photos, and report successfully uploaded!";
            $messageType = "success";
        } else {
            $message = "Database error: " . $conn->error;
            $messageType = "danger";
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Workshop Details - Department of Computer Science</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .dept-header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 25px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .btn-primary-custom { background-color: #1e3c72; border-color: #1e3c72; }
        .btn-primary-custom:hover { background-color: #162d55; }
    </style>
</head>
<body>

<div class="dept-header text-center mb-4">
    <div class="container">
        <h2 class="fw-bold">Department of Computer Science</h2>
        <p class="mb-0 text-white-50">Workshop Management & Documentation Portal</p>
    </div>
</div>

<div class="container pb-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <a href="index.php" class="btn btn-outline-secondary btn-sm">&larr; Back to Workshops List</a>
            </div>

            <?php if (!empty($message)): ?>
                <div class="alert alert-<?= $messageType; ?> alert-dismissible fade show" role="alert">
                    <?= htmlspecialchars($message); ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php endif; ?>

            <div class="card card-custom p-4 bg-white">
                <h4 class="fw-bold text-dark mb-3 border-bottom pb-2">Upload Workshop Details</h4>
                <form action="upload.php" method="POST" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Workshop Title / Topic <span class="text-danger">*</span></label>
                        <input type="text" name="title" class="form-control" placeholder="e.g. Modern Trends in Artificial Intelligence & Deep Learning" required>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Coordinator / Resource Person <span class="text-danger">*</span></label>
                            <input type="text" name="coordinator" class="form-control" placeholder="e.g. Dr. John Doe, Associate Professor" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label fw-semibold">Start Date <span class="text-danger">*</span></label>
                            <input type="date" name="start_date" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label fw-semibold">End Date <span class="text-danger">*</span></label>
                            <input type="date" name="end_date" class="form-control" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Workshop Description / Summary</label>
                        <textarea name="description" class="form-control" rows="4" placeholder="Brief outline of the objectives, participant count, key outcomes..."></textarea>
                    </div>

                    <div class="border rounded p-3 mb-3 bg-light">
                        <h6 class="fw-bold text-secondary mb-3">Attachments & Files</h6>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">1. Workshop Flyer (Poster)</label>
                            <input type="file" name="flyer" class="form-control" accept="image/*,application/pdf">
                            <div class="form-text">Upload image (PNG, JPG) or PDF flyer.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">2. Event Photos (Multiple Selection Allowed)</label>
                            <input type="file" name="photos[]" class="form-control" accept="image/*" multiple>
                            <div class="form-text">Select one or more photos captured during the session.</div>
                        </div>

                        <div class="mb-2">
                            <label class="form-label fw-semibold">3. Workshop Report (Document / PDF)</label>
                            <input type="file" name="report" class="form-control" accept=".pdf,.doc,.docx">
                            <div class="form-text">Upload complete workshop summary report.</div>
                        </div>
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-primary-custom text-white px-4 py-2 fw-semibold">Upload Workshop Details</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
