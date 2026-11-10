# Assignment 14: Simple Image Gallery using React JS

## Aim
To develop an interactive image gallery component using React JS featuring three images with thumbnail navigation, next/previous buttons, and descriptive captions.

---

## Gallery Content (Three Images)
1. **Mountain Alpine Lake**: Landscape photography featuring a glacial mountain lake at sunrise.
2. **Dense Evergreen Rainforest**: Forest wilderness canopy showcasing temperate rainforest vegetation.
3. **Golden Desert Dunes**: Desert landscape highlighting sand dune textures and warm sunlight.

---

## React Component Design
- **State Management:**
  - `currentIndex`: Tracks the integer index (`0`, `1`, or `2`) of the currently active/displayed image using the `useState` hook.
- **Navigation Logic:**
  - `handleNext()`: Increments the index by 1, wrapping around from index 2 back to 0.
  - `handlePrev()`: Decrements the index by 1, wrapping around from index 0 to 2.
  - `setCurrentIndex(index)`: Directly jumps to any image when its thumbnail is clicked.
- **Component Sections:**
  - **Featured Viewport:** Displays the selected full-size image with floating navigation arrows and image counter badge (`Image X of 3`).
  - **Metadata Card:** Displays category tag, image title, and descriptive summary.
  - **Thumbnails Strip:** Renders a 3-column grid of preview cards with active border highlighting.

---

## Project Structure
```
Q14/
├── package.json          # Project configuration
├── server.js             # Local Node.js server
├── index.html            # Standalone browser bundle
├── public/
│   └── index.html        # Public HTML template
├── src/
│   ├── App.js            # Image gallery component logic
│   ├── App.css           # Layout and responsive styling
│   └── index.js          # Entrypoint rendering to DOM
└── README.md             # Lab report documentation
```

---

## How to Run

### Method 1: Direct Browser Launch
Open `index.html` in any modern web browser.

### Method 2: Node.js Server
1. Navigate to the `Q14` directory:
   ```bash
   cd Q14
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```
   http://localhost:3001
   ```

---

## Result
A 3-image responsive gallery was created using React JS with thumbnail selection and bidirectional navigation controls.
