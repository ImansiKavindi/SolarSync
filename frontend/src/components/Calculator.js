// CalculatorComponent.js
import React, { useState } from 'react';
import '../styles/Calculator.css'

const CalculatorComponent = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      setResult(eval(expression).toString()); // Only for simple demo purposes
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="calculator">
      <input className="calc-display" value={expression} readOnly />
      <div className="calc-buttons">
        {'123+456-789*0/'.split('').map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
        <button onClick={handleClear}>C</button>
        <button onClick={handleCalculate}>=</button>
      </div>
      {result && <p className="calc-result">Result: {result}</p>}
    </div>
  );
};

export default CalculatorComponent;
