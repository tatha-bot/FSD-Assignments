import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Handle number button input
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  // Handle decimal dot
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  // Clear display (AC)
  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Backspace (Delete last digit)
  const deleteLast = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Perform calculation
  const calculate = (firstVal, secondVal, op) => {
    switch (op) {
      case '+':
        return firstVal + secondVal;
      case '-':
        return firstVal - secondVal;
      case '*':
        return firstVal * secondVal;
      case '/':
        return secondVal === 0 ? 'Error' : firstVal / secondVal;
      case '%':
        return firstVal % secondVal;
      default:
        return secondVal;
    }
  };

  // Handle operator button (+, -, *, /, %)
  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const result = calculate(currentValue, inputValue, operator);
      if (result === 'Error') {
        setDisplay('Error');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setDisplay(String(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Handle Equals (=)
  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      if (result === 'Error') {
        setDisplay('Error');
      } else {
        setDisplay(String(result));
      }
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-card">
        <div className="calculator-header">
          <h3>React Calculator</h3>
          <span className="subtext">Basic Arithmetic Operations</span>
        </div>

        {/* Display Screen */}
        <div className="calculator-screen">
          <div className="screen-history">
            {prevValue !== null && operator ? `${prevValue} ${operator}` : ''}
          </div>
          <div className="screen-main">{display}</div>
        </div>

        {/* Keypad */}
        <div className="calculator-keypad">
          <button className="btn btn-action" onClick={clearAll}>AC</button>
          <button className="btn btn-action" onClick={deleteLast}>DEL</button>
          <button className="btn btn-operator" onClick={() => performOperation('%')}>%</button>
          <button className="btn btn-operator" onClick={() => performOperation('/')}>÷</button>

          <button className="btn btn-num" onClick={() => inputDigit(7)}>7</button>
          <button className="btn btn-num" onClick={() => inputDigit(8)}>8</button>
          <button className="btn btn-num" onClick={() => inputDigit(9)}>9</button>
          <button className="btn btn-operator" onClick={() => performOperation('*')}>×</button>

          <button className="btn btn-num" onClick={() => inputDigit(4)}>4</button>
          <button className="btn btn-num" onClick={() => inputDigit(5)}>5</button>
          <button className="btn btn-num" onClick={() => inputDigit(6)}>6</button>
          <button className="btn btn-operator" onClick={() => performOperation('-')}>−</button>

          <button className="btn btn-num" onClick={() => inputDigit(1)}>1</button>
          <button className="btn btn-num" onClick={() => inputDigit(2)}>2</button>
          <button className="btn btn-num" onClick={() => inputDigit(3)}>3</button>
          <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>

          <button className="btn btn-num btn-zero" onClick={() => inputDigit(0)}>0</button>
          <button className="btn btn-num" onClick={inputDot}>.</button>
          <button className="btn btn-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
