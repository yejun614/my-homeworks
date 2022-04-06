/*
 * 2022-04-06
 * YeJun, Jung (yejun614@naver.com)
 */

class Calc {
  constructor() {
    this.memory = ['0'];
    this.extraMemory = 0;
    this.operator = '';

    this.debug = document.getElementById('debug');
    this.updateDebug();

    this.screen = document.getElementById('screen');
    this.screen.value = 'Hello, everyone!';

    this.clearButtons = document.querySelectorAll('.btn.func.clear');
    this.changeClearButton();

    this.addEvents();
  }

  addEvents() {
    const funcButtons = document.querySelectorAll('.btn.func');

    funcButtons.forEach(element => {
      element.addEventListener('click', button => this.funcButtonClick(button));
    });

    const numButtons = document.querySelectorAll('.btn.num');

    numButtons.forEach(element => {
      element.addEventListener('click', button => this.numButtonClick(button));
    });

    const calcButtons = document.querySelectorAll('.btn.calc');

    calcButtons.forEach(element => {
      element.addEventListener('click', button => this.calcButtonClick(button));
    });
  }

  updateDebug() {
    this.debug.innerText = "";

    if (this.operator !== '') {
      this.debug.innerText += `연산자: "${this.operator}", `;
    }

    if (this.extraMemory !== 0) {
      this.debug.innerText += `저장: "${this.extraMemory}"`;
    }

    this.debug.innerText += " 메모리: [ ";

    for (let i = 0; i < this.memory.length; i++) {
      this.debug.innerText += ` ${this.memory[i]}`;
    }

    this.debug.innerText += " ]";
  }

  commaNum(number) {
    const nums = number.toString().split('.');
    let result = nums[0];

    if (!result.includes('e') && !result.includes("Infinity")) {
      let index = result.length - 3;

      while (index > 0) {
        result = result.slice(0, index) + "," + result.slice(index);
        index -= 3;
      }
    }

    if (nums.length > 1) {
      result += ".";
      result += nums[1];
    }

    return result;
  }

  changeClearButton() {
    const length = this.memory.length;
    const last = this.memory[length-1];

    if (length === 1 || last === '0') {
      for (let i = 0; i < this.clearButtons.length; i ++) {
        this.clearButtons[i].innerText = 'AC';
      }
    } else {
      for (let i = 0; i < this.clearButtons.length; i ++) {
        this.clearButtons[i].innerText = 'CE';
      }
    }
  }

  updateScreen() {
    let result = this.commaNum(this.memory[0]);
    
    if (this.memory.length > 1) {
      result += " " + this.operator + " ";
      result += this.commaNum(this.memory[1]);
    }

    this.screen.value = result;

    // Change CE/AC Buttons
    this.changeClearButton();
  }

  calc() {
    let result = parseFloat(this.memory[0]);

    if (this.operator === '+') {
      result += parseFloat(this.memory[1]);
    } else if (this.operator === '-') {
      result -= parseFloat(this.memory[1]);
    } else if (this.operator === 'x') {
      result *= parseFloat(this.memory[1]);
    } else if (this.operator === '\u00f7') {
      result /= parseFloat(this.memory[1]);
    }

    return result;
  }

  funcButtonClick(button) {
    if (this.memory.length === 0) {
      this.memory.push('0');
    }

    const text = button.target.innerText;
    let length = this.memory.length
    let current = parseFloat(this.memory[length-1]);

    if (text === 'mc') {
      this.extraMemory = 0;

    } else if (text === 'mr') {
      current = this.extraMemory;

    } else if (text === 'm+') {
      this.extraMemory += current;
      current = 0;

    } else if (text === 'm-') {
      this.extraMemory -= current;
      current = 0;

    } else if (text === 'CE') {
      if (current != 0) {
        current = 0;
      }

    } else if (text === 'AC') {
      this.memory = ['0'];
      this.operator = '';

      current = 0;
      length = 1;

    } else if (text === '\u03c0') {
      // PI
      current = Math.PI;

    } else if (text === 'x\u00b2') {
      current = Math.pow(current, 2);

    } else if (text === '\u221ax') {
      current = Math.sqrt(current, 2);

    } else if (text === '%') {
      current /= 100;

    } else if (text === '+/-') {
      current *= -1;

    } else if (text === 'R0') {
      current = Math.round(current);

    } else if (text === 'R2') {
      current = +(Math.round(current + "e+2") + "e-2");

    } else {
      console.log(`Not support operator: ${text}`)
    }

    this.memory[length-1] = current.toString();

    this.updateScreen();
    this.updateDebug();
  }

  numButtonClick(button) {
    if (this.memory.length === 0) {
      this.memory.push('0');
    }

    const length = this.memory.length;
    const text = button.target.innerText;

    if (text === '+/-') {
      const result = parseFloat(this.memory[length-1]) * -1;
      this.memory[length-1] = result.toString();

    } else if (text === '.') {
      if (!this.memory[length-1].includes('.'))
        this.memory[length-1] += '.';

    } else {
      this.memory[length-1] += text;
      this.memory[length-1] = parseFloat(this.memory[length-1]).toString();
    }

    this.updateScreen();
    this.updateDebug();
  }

  calcButtonClick(button) {
    if (this.memory.length === 0) {
      this.memory.push('0');
    }

    const text = button.target.innerText;

    if (text === '=') {
      this.memory = [this.calc()];
      this.operator = '';

    } else {
      if (this.operator !== '') {
        this.memory = [this.calc()];
      }

      this.operator = text;

      this.memory.push('0');
    }

    this.updateScreen();
    this.updateDebug();
  }
}

class CalcHelper {
  messages = {
    'mc': 'Memory Clear<br />저장해 두었던 값을 0으로 만듭니다.',
    'm+': 'Memory Plus<br />현재 값을 저장해 둔 값과 합칩니다.',
    'm-': 'Memory Minus<br />현재 값과 저장해둔 값의 차를 구합니다.',
    'mr': 'Memory Recall<br />저장해둔 값을 불러옵니다.',
    '\u03c0': 'PI 값을 입력합니다.',
    'x\u00b2': '현재 값에 제곱을 구합니다.',
    '\u221ax': '현재 값의 제곱근을 구합니다.',
    '%': '비율(퍼센트)를 산출합니다.<br />567에서 12%를 구하기 위해서는 567 x 12 한 결과에서 %를 누르면 됩니다!',
    'R0': '소수점 첫번째 자리에서<br />반올림한 결과를 구합니다.',
    'R2': '소수점 세번째 자리에서<br />반올림한 결과를 구합니다.',
    'CE': '제일 마지막에 있는 값을 0으로 만듭니다.',
    'AC': '계산 하고 있는 모든 값을 삭제 합니다.',
    '+': '두 수를 더합니다.',
    '-': '두 수의 차를 구합니다.',
    'x': '두 수의 곱을 구합니다.',
    '\u00f7': '두 수를 나누어 결과를 표시합니다.',
    '=': '계산 결과를 확인합니다.',
    '+/-': '현재 값에 -1을 곱합니다.<br />(부호를 변경하는 효과가 있습니다.)',
    '.': '소수점을 표현합니다.',
  };

  constructor(calc, helper) {
    this.calc = document.querySelector(calc);
    this.helper = document.querySelector(helper);
    this.helperText = this.helper.querySelector('p');

    this.changeHelperMessage('계산기 버튼위에 마우스를 올려보세요!');

    this.addEvents();
  }

  addEvents() {
    const buttons = this.calc.querySelectorAll('.btn');

    buttons.forEach(element => {
      element.addEventListener('mouseover', button => this.buttonHover(button));
    });
  }

  changeHelperMessage(str) {
    this.helperText.innerHTML = str;
  }

  buttonHover(button) {
    const text = button.target.innerText;
    const keys = Object.keys(this.messages);

    if (keys.includes(text)) {
      this.changeHelperMessage(this.messages[text]);

    } else if (+text != NaN) {
      this.changeHelperMessage(`숫자 버튼 ${text} 이군요!`);

    } else {
      this.changeHelperMessage('지원하지 않는 버튼 입니다.');
    }
  }
}

window.onload = () => {
  // Entry point
  const calc = new Calc();
  const calcHelper = new CalcHelper('#calculator', '#button-hover-help');

  // 도움말 & 추가기능 버튼
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleBtnIcon = document.querySelector('#toggle-btn .icon');

  toggleBtn.addEventListener('click', () => {
    const wrap = document.querySelector('.wrap');
    wrap.classList.toggle('active');

    if (wrap.classList.contains('active')) {
      toggleBtnIcon.innerText = '\u25bc';
    } else {
      toggleBtnIcon.innerText = '\u25b6';
    }
  })
}