import { useReducer } from 'react';
import './style.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',

}

function reducer(state , { type , payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite == true) { //overwrite is true when we have get an ans , and we still put something , so it overwrites the answer
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }

      if (payload.digit === "0" && state.currentOperand === "0") {//if we have only 0in input and type 0 again,it remains 0 and not 00
        return state
      }
      if (payload.digit === "." && state.currentOperand && state.currentOperand.includes(".")) {// can't add more decimal points than one , need to first see if current operand is not null , then only we can check inlcudes
        return state
      }
      if(state.currentOperand===null && payload.digit==="."){ 
        return{
          ...state,
          currentOperand: `${payload.digit}`
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.CHOOSE_OPERATION:

      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      /// idk what done with overwrite here
      if (state.currentOperand == null)
        return state
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null // put null instead of empty string
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1) // remove last digit from currentOperand
      }

  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break;
    case "-":
      computation = prev - current
      break;
    case "/":
      computation = prev / current;
      break;
    case "*":
      computation = prev * current;
      break;
  }
  return computation.toString();
}

const IntegerFormatter = new Intl.NumberFormat("en-us", { // format only integers bcz after decimal do not have commax
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) {
    return null
  }
  const [integer, decimal] = operand.split('.')
  if (decimal == null)       // decimal null, so just format integer part and return
    return IntegerFormatter.format(integer)
  return `${IntegerFormatter.format(integer)}.${decimal}` // returns integer with format with decimal without commas
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='twospan' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button className='twospan' onClick={() => dispatch({ type: ACTIONS.EVALUATE })} >=</button>
    </div>
  );
}

export default App;
