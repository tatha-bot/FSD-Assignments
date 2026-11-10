# Assignment 13: Simple Calculator with Arithmetic Operations using React JS

## Aim
To design and build a simple calculator web application supporting all standard arithmetic operations (addition, subtraction, multiplication, division, modulo, decimal, and clear) using React JS components and state management.

---

## Features & Supported Operations
- **Addition (`+`)**: Adds two numeric values.
- **Subtraction (`−`)**: Subtracts the second operand from the first operand.
- **Multiplication (`×`)**: Multiplies two numeric values.
- **Division (`÷`)**: Divides the first operand by the second operand with divide-by-zero validation (`Error`).
- **Modulo (`%`)**: Computes remainder of integer division.
- **All Clear (`AC`)**: Resets calculator memory and display to zero.
- **Delete (`DEL`)**: Backspace function to remove the last entered digit.
- **Decimal Support (`.`)**: Permits floating-point decimal computations without duplicate periods.

---

## React Component Architecture
- **State Variables (`useState`):**
  - `display`: Current number displayed on the screen.
  - `prevValue`: First operand stored when an operator is pressed.
  - `operator`: The active arithmetic operator (`+`, `-`, `*`, `/`, `%`).
  - `waitingForOperand`: Boolean flag to determine whether next digit entry replaces current display.
- **Component Breakdown:**
  - `screen-history`: Displays previous operand and pending operator.
  - `screen-main`: Shows active input or final calculated result.
  - `calculator-keypad`: 4x5 grid layout containing numeric and operator buttons.

---

## Project Structure
```
Q13/
├── package.json          # Node.js / React project dependencies
├── server.js             # Lightweight HTTP server for quick demo
├── index.html            # Standalone browser runnable bundle
├── public/
│   └── index.html        # HTML template
├── src/
│   ├── App.js            # Calculator component with arithmetic logic
│   ├── App.css           # Styling and responsive grid layout
│   └── index.js          # React DOM render entrypoint
└── README.md             # Lab report documentation
```

---

## How to Run

### Method 1: Direct Browser Launch
Open `index.html` directly in any web browser (Chrome, Edge, Firefox).

### Method 2: Node.js Server
1. In the terminal, navigate to the `Q13` directory:
   ```bash
   cd Q13
   ```
2. Start the application:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## Result
A fully functional calculator application with all basic arithmetic operations was successfully implemented using React JS and verified with sample calculations.
