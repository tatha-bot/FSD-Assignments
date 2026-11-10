<?php
include 'db_connect.php';

$employee_id = $_POST['employee_id'];
$employee_name = $_POST['employee_name'];
$gender = $_POST['gender'];
$dob = $_POST['dob'];
$department = $_POST['department'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$designation = $_POST['designation'];
$joining_date = $_POST['joining_date'];
$experience = $_POST['experience'];
$employment_type = $_POST['employment_type'];

$sql = "INSERT INTO employees
(employee_id, employee_name, gender, dob, department, email, phone, address, designation, joining_date, experience, employment_type)
VALUES
('$employee_id', '$employee_name', '$gender', '$dob', '$department', '$email', '$phone', '$address', '$designation', '$joining_date', '$experience', '$employment_type')";

if ($conn->query($sql) === TRUE) {
    echo "Employee Registered Successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>