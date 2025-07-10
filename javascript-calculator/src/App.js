import './App.css';
import { useState } from 'react';

const buttonConfig = [
  { id: 'clear', label: 'AC', className: 'span-two' },
  { id: 'divide', label: '/', className: 'operator' },
  { id: 'multiply', label: 'x', className: 'operator' },
  { id: 'seven', label: '7' },
  { id: 'eight', label: '8' },
  { id: 'nine', label: '9' },
  { id: 'subtract', label: '-', className: 'operator' },
  { id: 'four', label: '4' },
  { id: 'five', label: '5' },
  { id: 'six', label: '6' },
  { id: 'add', label: '+', className: 'operator' },
  { id: 'one', label: '1' },
  { id: 'two', label: '2' },
  { id: 'three', label: '3' },
  { id: 'equals', label: '=', className: 'span-two equals' },
  { id: 'zero', label: '0', className: 'span-two' },
  { id: 'decimal', label: '.' },
];

const isOperator = (val) => /[\/+\-x]/.test(val);

function App() {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setEvaluated(false);
  };

  const handleNumber = (val) => {
    if (evaluated) {
      setDisplay(val);
      setFormula(val === '0' ? '' : val);
      setEvaluated(false);
      return;
    }
    if (display === '0' && val === '0') return;
    if (display === '0' && val !== '0') {
      setDisplay(val);
      setFormula(formula.replace(/([\d.]+)$/g, '') + val);
      return;
    }
    if (/([\d.]+)$/.test(formula)) {
      setDisplay(display + val);
      setFormula(formula + val);
    } else {
      setDisplay(val);
      setFormula(formula + val);
    }
  };

  const handleDecimal = () => {
    if (evaluated) {
      setDisplay('0.');
      setFormula('0.');
      setEvaluated(false);
      return;
    }
    if (display.includes('.')) return;
    if (isOperator(formula.slice(-1)) || formula === '' || /[\/+\-x]$/.test(formula)) {
      setDisplay('0.');
      setFormula(formula + '0.');
    } else {
      setDisplay(display + '.');
      setFormula(formula + '.');
    }
  };

  const handleOperator = (val) => {
    let op = val === 'x' ? '*' : val;
    if (evaluated) {
      setFormula(display + op);
      setEvaluated(false);
      setDisplay(op);
      return;
    }
    if (formula === '' && val === '-') {
      setFormula('-');
      setDisplay('-');
      return;
    }
    if (isOperator(formula.slice(-1))) {
      if (val === '-' && formula.slice(-1) !== '-') {
        setFormula(formula + '-');
        setDisplay('-');
      } else {
        let newFormula = formula.replace(/[\/+\-*]+$/, op);
        setFormula(newFormula);
        setDisplay(val);
      }
    } else {
      setFormula(formula + op);
      setDisplay(val);
    }
  };

  const handleEquals = () => {
    let exp = formula;
    if (isOperator(exp.slice(-1))) {
      exp = exp.replace(/[\/+\-*]+$/, '');
    }
    exp = exp.replace(/x/g, '*');
    exp = exp.replace(/--/g, '+0+0+0+0+0+0+'); // hack to handle double negatives
    try {
      // eslint-disable-next-line no-eval
      let result = eval(exp);
      result = Math.round((result + Number.EPSILON) * 1000000000000) / 1000000000000;
      setDisplay(result.toString());
      setFormula(exp + '=' + result);
      setEvaluated(true);
    } catch {
      setDisplay('Error');
      setEvaluated(true);
    }
  };

  const handleClick = (id, label) => {
    if (id === 'clear') return handleClear();
    if (id === 'equals') return handleEquals();
    if (id === 'decimal') return handleDecimal();
    if (isOperator(label)) return handleOperator(label);
    return handleNumber(label);
  };

  return (
    <div className="calculator-container">
      <div id="calculator">
        <div id="display" className="display">{display}</div>
        <div className="buttons">
          {buttonConfig.map(({ id, label, className }) => (
            <button
              key={id}
              id={id}
              className={`button ${className || ''}`}
              onClick={() => handleClick(id, label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <footer className="footer">Built by Maxwell</footer>
    </div>
  );
}

export default App;
