function validateForm() {

    let name = document.getElementById("name").value;
    let regno = document.getElementById("regno").value;
    let course = document.getElementById("course").value;
    let attendance = document.getElementById("attendance").value;
    let result = document.getElementById("result");

    // Check for empty fields
    if (name == "" || regno == "" || course == "" || attendance == "") {
        result.style.color = "red";
        result.innerHTML = "Please fill all the fields.";
        return;
    }

    // Attendance validation
    if (attendance < 0 || attendance > 100) {
        result.style.color = "red";
        result.innerHTML = "Attendance must be between 0 and 100.";
        return;
    }

    // Eligibility check
    if (attendance >= 75) {
        result.style.color = "green";
        result.innerHTML = "Registration Successful! Eligible for Examination.";
    } else {
        result.style.color = "red";
        result.innerHTML = "Registration Failed! Attendance is below 75%. Not Eligible.";
    }
}