# Q4: Display Server Domain Name (HTML, CSS, JavaScript)

## 📌 Problem Statement
Write a JavaScript program to retrieve and display the domain name of the server on which the web application is running, using the `document.domain` property.

---

## 🛠️ Tech Stack
- **HTML5:** Centered container layout and display element
- **CSS3:** Modern gradient background, button hover animations, card shadows
- **JavaScript (Vanilla):** DOM property inspection using `document.domain`

---

## 📂 File Structure
```
Q4/
└── 4/
    ├── index.html       # Web page with trigger button and result display
    ├── script.js        # JavaScript function fetching and rendering document.domain
    └── style.css         # Gradient background and card UI styling
```

---

## 🚀 How to Run

### Option 1: Using a Local HTTP Server (Recommended)
Because `document.domain` is specifically designed for web servers, running through an HTTP server displays the actual domain/host name:

```bash
# Navigate to the question directory
cd "Q4/4"

# Start a local HTTP server
python -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080
```
Click **"Display Domain"** — it will output:
```
Domain Name: localhost
```

### Option 2: Direct File Open
Double-click `index.html`. The updated script gracefully identifies the `file://` protocol and reports `localhost (served via file:// protocol)` or current origin host.
