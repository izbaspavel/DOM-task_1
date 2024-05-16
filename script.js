const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");
const info = document.querySelector(".info");

display.innerText = "";
let result = "";

const operatorRegex = /[+\-*/]/;

const checkCorrectPeriod = () =>
  display.innerText.split(operatorRegex).at(-1).includes(".");

const operatorQuantity = (operator) =>
  display.innerText.split("").filter((el) => el === operator).length;

const mathOperator = function (operator) {
  const prevChar = display.innerText.at(-1);

  if (/[*/]/.test(operator) && prevChar === "(") return;

  if (
    (operatorRegex.test(prevChar) && !/[())]/.test(operator)) ||
    (display.innerText.length === 0 && !/[()+-]/.test(operator))
  )
    return;

  if (
    operator === "(" &&
    (!isNaN(Number(prevChar)) || prevChar === "." || prevChar === ")")
  )
    return;

  if (
    operator === ")" &&
    (/[(+*/.-]/.test(prevChar) ||
      operatorQuantity("(") <= operatorQuantity(")"))
  )
    return;

  if (
    operator === "." &&
    (result === +display.innerText || checkCorrectPeriod())
  )
    return console.log("Extra period");

  display.innerText += operator;
};

const formatBeforeCalculation = function (mathExpresion) {
  let mathExpresionCorrected = "";

  if (/[+-]/.test(mathExpresion[0])) mathExpresionCorrected += "0";

  mathExpresion.split("").forEach((char, i) => {
    if (/[+-]/.test(char) && mathExpresion[i - 1] === "(") {
      mathExpresionCorrected += "0" + char;
    } else {
      mathExpresionCorrected += char;
    }
  });

  return mathExpresionCorrected;
};

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const currentBtn = e.target.innerText;

    // Check that after calculation, not to put other digits and not to delete characters from result
    if (
      result === +display.innerText &&
      (!isNaN(currentBtn) || currentBtn === "DEL")
    )
      return;

    // Clears the display and start a new math expresion
    if (currentBtn === "C") return (display.innerText = "");

    // Delete the last charther from display and math expresion
    if (currentBtn === "DEL")
      return (display.innerText = display.innerText.slice(0, -1));

    //  Check if input is an operator and executes mathOperator function
    if (/[+/*()-\.]/.test(currentBtn)) return mathOperator(currentBtn);

    if (currentBtn === "0" && display.innerText.at(-1) === "/") {
      return console.log("Division by 0 is imposible");
    }

    if (currentBtn === "=" && operatorQuantity("(") !== operatorQuantity(")"))
      // Doesn't return result if not all paranthesis are closed
      return;

    // If last char in math expresion is not a number or closing paranthesis -> then calculation is imposible
    if (currentBtn === "=" && !/[0-9)]/.test(display.innerText.at(-1))) return;

    // Get the result of math expresion
    if (currentBtn === "=")
      return (display.innerText = result =
        Math.round(
          evaluate(formatBeforeCalculation(display.innerText)) * 10 ** 10
        ) /
        10 ** 10);

    // Add another digit to display
    display.innerText += currentBtn;
  });
});

/* A Javascript program to evaluate a given expression*/

function evaluate(expression) {
  let tokens = expression.split("");

  // Stack for numbers: 'values'
  let values = [];

  // Stack for Operators: 'ops'
  let ops = [];

  for (let i = 0; i < tokens.length; i++) {
    // Current token is a whitespace, skip it
    if (tokens[i] == " ") {
      continue;
    }

    // Current token is a number, push it to stack for numbers
    if ((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] === ".") {
      let sbuf = "";

      // There may be more than one digits in number
      while (
        i < tokens.length &&
        ((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] === ".")
      ) {
        sbuf = sbuf + tokens[i++];
      }

      values.push(parseFloat(sbuf, 10));

      // Right now the i points to the character next to the digit, since the for loop also increases the i, we would skip one token position; we need to decrease the value of i by 1 to correct the offset.
      i--;
    }

    // Current token is an opening brace, push it to 'ops'
    if (tokens[i] === "(") {
      ops.push(tokens[i]);
    }

    // Closing brace encountered, solve entire brace
    if (tokens[i] === ")") {
      while (ops[ops.length - 1] != "(") {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }

      // Pops '('
      ops.pop();
    }

    // Current token is an operator.
    if (operatorRegex.test(tokens[i])) {
      // While top of 'ops' has same or greater precedence to current token, which is an operator. Apply operator on top of 'ops' to top two elements in values stack
      while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1])) {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }

      // Push current token to 'ops'.
      ops.push(tokens[i]);
    }
  }

  // Entire expression has been parsed at this point, apply remaining ops to remaining values
  while (ops.length > 0) {
    values.push(applyOp(ops.pop(), values.pop(), values.pop()));
  }

  // Top of 'values' contains
  // result, return it
  return values.pop();
}

// Returns true if 'prevOp' has higher or same precedence as 'curOp', otherwise returns false.
function hasPrecedence(curOp, prevOp) {
  if (prevOp == "(") {
    return false;
  }
  if ((curOp == "*" || curOp == "/") && (prevOp == "+" || prevOp == "-")) {
    return false;
  } else {
    return true;
  }
}

// A utility method to apply an operator 'op' on operands 'a' and 'b'. Return the result.
function applyOp(op, b, a) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b == 0) {
        document.write("Cannot divide by zero");
      }
      return parseFloat(a / b, 10);
  }
  return 0;
}

// add a comment
