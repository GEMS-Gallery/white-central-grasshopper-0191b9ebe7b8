import React, { useState } from 'react';
import { backend } from 'declarations/backend';
import { Button, CircularProgress, Container, Paper } from '@mui/material';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, inputValue);
        if (result !== null) {
          setDisplay(result.toString());
          setFirstOperand(result);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }

    setWaitingForSecondOperand(true);
    setOperation(nextOperation);
  };

  return (
    <Container maxWidth="sm" className="calculator-container">
      <Paper elevation={3} className="calculator">
        <div className="display">
          {display}
          {loading && <CircularProgress size={24} />}
        </div>
        <div className="keypad">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((key) => (
            <Button
              key={key}
              className={`key number`}
              onClick={() => key === '.' ? inputDecimal() : inputDigit(key)}
              variant="contained"
            >
              {key}
            </Button>
          ))}
          {['+', '-', '*', '/'].map((op) => (
            <Button
              key={op}
              className={`key operation`}
              onClick={() => performOperation(op)}
              variant="contained"
              color="secondary"
            >
              {op}
            </Button>
          ))}
          <Button className="key clear" onClick={clear} variant="contained" color="error">C</Button>
          <Button className="key equals" onClick={() => performOperation('=')} variant="contained" color="success">=</Button>
        </div>
      </Paper>
    </Container>
  );
};

export default App;
