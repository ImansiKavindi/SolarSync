// Calculator.js
import React, { useState } from 'react';
import '../styles/Calculator.css'

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      setResult(eval(input).toString());
    } catch {
      setResult('Error');
    }
  };

  const clear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="calculator">
      <div className="display">{input || '0'}</div>
      <div className="buttons">
        {'1234567890+-*/'.split('').map((val) => (
          <button key={val} onClick={() => handleClick(val)}>{val}</button>
        ))}
        <button onClick={clear}>C</button>
        <button onClick={calculate}>=</button>
      </div>
      {result && <div className="result">Result: {result}</div>}
    </div>
  );
};

export default Calculator;
