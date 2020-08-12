// 集中管理计算器的状态
var calculator = {
  displayValue: "0",
  currentOperator:null,
  leftOperand: null,
  waitingSecondOperand: false,
  time: null,
  timeEvents: [],

  // 按需求添加其他属性
};

bindKeyPress();

// 绑定各种按键触发
function bindKeyPress() {
  var keys = document.querySelector(".calculator-keys");
  console.log(keys);
  keys.addEventListener('click', function(event){
    console.log(event);

    var target = event.target;
    var value = target.value;

    if (calculator.time) {
      removeTime();
    };

    if (target.classList.contains("decimal")) { 
      handleDecimal();
      return;
    };

    if (target.classList.contains("clear")) {
      handleClear();
      return;
    };

    if (target.classList.contains("operator")) {
      handleOperator(value);
      return;
    };

    if (target.classList.contains("equal")) {
      handleEqual();
      return;
    };

    if (target.classList.contains("clock")) {
      handleClock();
      return;
    };

    handleDigit(value);
  });
  // 获取按键
  // 给按键添加点击事件
}

// 处理数字点击
function handleDigit(value) {
  // 获取当前显示的数字
  var displayValue = calculator.displayValue;
  if (calculator.waitingSecondOperand) {
    calculator.displayValue = value;
    calculator.waitingSecondOperand = false;
  }else {
  // 更新数字
  calculator.displayValue = displayValue === "0" ? value : displayValue + value;
  }
  // 更新面板
  updateDisplay();
}

// 处理归零点击
function handleClear() {
  calculator.displayValue = "0";
  updateDisplay();
}

// 处理等号点击
function handleEqual() {
  if (!calculator.currentOperator || calculator.waitingSecondOperand) {
    return;
  };

  var leftOperand = parseFloat(calculator.leftOperand);
  var rightOperand = parseFloat(calculator.displayValue);
  var answer;

  switch (calculator.currentOperator) {
    case "+":
      answer = leftOperand + rightOperand;
      break;
    case "-":
      answer = leftOperand - rightOperand;
      break;
    case "*":
      answer = leftOperand * rightOperand;
      break;
    case "/":
      answer = leftOperand / rightOperand;
      break;
    default:
      return;
  };

  calculator.displayValue = '' + answer;
  calculator.currentOperator = null;
  calculator.waitingSecondOperand = false;
  updateDisplay()
}

// 处理运算符号点击
function handleOperator(operator) {
  if (calculator.currentOperator) {
    if (calculator.waitingSecondOperand) {
      calculator.currentOperator = operator;
      return;
    };
    handleEqual();
  };

  calculator.currentOperator = operator;
  calculator.waitingSecondOperand = true;
  calculator.leftOperand = calculator.displayValue;
  calculator.displayValue = "0";
}

// 处理小数点点击
function handleDecimal() {
  // 逻辑处理
  if (calculator.displayValue.includes('.')) return;
  calculator.displayValue += '.'
  waitingSecondOperand = false;
  // 更新面板
  updateDisplay();
}

// 处理面板更新
function updateDisplay() {
  // 获取面板元素
  var display = document.querySelector('.calculator-screen');
  if (calculator.time) {
    display.value = calculator.time;
  } else {
    // 更新显示内容
    display.value = calculator.displayValue;
  }
}

// 处理时钟点击
function handleClock() {
  calculator.time = new Date().toLocaleString();
  var display = document.querySelector('.calculator-screen');
  display.classList.add('time-screen');
  updateDisplay();

  var interval = setInterval(function () {
    calculator.time = new Date().toLocaleString();
    updateDisplay();
  }, 1000);

  var timeout = setTimeout(function () {
    removeTime();
  }, 5000);

  calculator.timeEvents.push({ type:'timeout', event: timeout });
  calculator.timeEvents.push({ type:'interval', event: interval });
}

function removeTime() {
  while (calculator.timeEvents.length > 0 ) {
    var event = calculator.timeEvents.pop();
    if (event.type ===  "interval") {
      clearInterval(event.event);
    } else {
      clearTimeout(event.event);
    }
  }

  calculator.time = null;
  var display = document.querySelector('.calculator-screen');
  display.classList.remove('time-screen');
  updateDisplay();
}