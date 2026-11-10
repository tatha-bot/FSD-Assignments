function showDomain() {
    // Uses document.domain as required by the assignment
    let domain = document.domain;
    if (!domain || domain === "") {
        domain = window.location.hostname || "localhost (served via file:// protocol)";
    }
    document.getElementById("domain").innerHTML =
        "<strong>Domain Name:</strong> " + domain;
}
