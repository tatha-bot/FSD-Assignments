function validateForm() {

    let name = document.getElementById("name").value;
    let sid = document.getElementById("sid").value;
    let age = document.getElementById("age").value;
    let book = document.getElementById("book").value;
    let operation = document.getElementById("operation").value;
    let result = document.getElementById("result");

    // Check empty fields
    if (name === "" || sid === "" || age === "" || book === "" || operation === "") {
        result.style.color = "red";
        result.innerHTML = "Please fill all the fields.";
        return;
    }

    // Age validation
    if (age < 18 || age > 30) {
        result.style.color = "red";
        result.innerHTML = "Only students aged between 18 and 30 can lend or return books.";
        return;
    }

    // Success message
    result.style.color = "green";
    result.innerHTML = "Book " + operation + " Successful!";
}