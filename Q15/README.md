# Assignment 15: Greeting Application Based on Current Time using React JS

## Aim
To design and develop a dynamic greeting application in React JS that detects the current system time, displays a real-time digital clock, and renders personalized contextual greetings (Good Morning, Good Afternoon, Good Evening, Good Night) with matching visual themes.

---

## Time-Based Greeting Logic
The application checks the 24-hour format hour (`new Date().getHours()`) to determine the greeting and theme:

| Time Range | Hour Condition | Greeting | Theme & Color | Context Icon |
| :--- | :--- | :--- | :--- | :---: |
| **05:00 to 11:59** | `hour >= 5 && hour < 12` | **Good Morning** | Warm Amber (`#f59e0b`) | 🌅 |
| **12:00 to 16:59** | `hour >= 12 && hour < 17` | **Good Afternoon** | Sky Blue (`#0284c7`) | ☀️ |
| **17:00 to 20:59** | `hour >= 17 && hour < 21` | **Good Evening** | Sunset Violet (`#8b5cf6`) | 🌆 |
| **21:00 to 04:59** | `hour >= 21 || hour < 5` | **Good Night** | Midnight Indigo (`#38bdf8`) | 🌙 |

---

## React Component Architecture
- **State Variables (`useState`):**
  - `currentTime`: Stores active `Date` object, refreshed every 1000ms.
  - `userName`: User-customizable string to display personalized greetings ("Good Morning, Tathagata!").
  - `simulatedHour`: Allows evaluators to test morning, afternoon, evening, and night states on demand without altering computer clocks.
- **Lifecycle Hook (`useEffect`):**
  - Starts a `setInterval` timer on component mount that updates `currentTime` every second.
  - Clears the interval in the cleanup return callback to prevent memory leaks when the component unmounts.
- **Dynamic Theming:**
  - Changes the outer wrapper background gradient and accent colors dynamically based on the active time period.

---

## Project Structure
```
Q15/
├── package.json          # Node.js project manifest
├── server.js             # Local HTTP server (port 3003)
├── index.html            # Standalone browser runnable bundle
├── public/
│   └── index.html        # Public HTML template
├── src/
│   ├── App.js            # Greeting logic, live clock & simulator
│   ├── App.css           # Time-based CSS theme gradients
│   └── index.js          # Entrypoint rendering to DOM
└── README.md             # Lab report documentation
```

---

## How to Run

### Method 1: Direct Browser Launch
Double-click `index.html` to open directly in any web browser.

### Method 2: Node.js Server
1. In your terminal, navigate to the `Q15` directory:
   ```bash
   cd Q15
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```
   http://localhost:3003
   ```

---

## Result
A real-time greeting application based on current system time was constructed using React JS functional components, `useState`, and `useEffect` hooks.
