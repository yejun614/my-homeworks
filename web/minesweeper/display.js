
class GameDisplay {

  images = {
    'idle': './smile-idle.png',
    'cool': './smile-cool.png',
    'over': './smile-over.png',
    'click': './smile-click.png',
  };

  defaultImage = 'idle'
  gameOverModalCheck = false;

  constructor (game) {
    this.game = game;

    // Setting Buttons
    this.window = document.querySelector('#game-window');
    this.setting = document.querySelector('#game-setting');
    this.startBtn = document.querySelector('#game-start-btn');
    this.closeBtn = document.querySelector('#window-close-btn');

    // Reset Button
    this.resetBtn = document.querySelector('#reset-btn');
    this.resetBtnImage = this.resetBtn.querySelector('img');

    // 7-Segment Display
    this.mineCounter = document.querySelector('#mine-counter');
    this.playTime = document.querySelector('#play-time');

    // Modal
    this.gameOverModal = document.querySelector('#game-over-modal');
    this.modalCloseBtn = document.querySelector('#modal-close-btn');

    // Initialize
    this.addEvents();
    this.display();
    this.update();
  }

  addEvents() {
    this.startBtn.addEventListener('click', () => this.windowOpen());
    this.closeBtn.addEventListener('click', () => this.windowClose());
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.modalCloseBtn.addEventListener('click', () => this.toggleModal());
    this.game.canvas.addEventListener('mousedown', () => this.changeResetButton('click'));
    this.game.canvas.addEventListener('mouseup', () => this.changeResetButton('idle'));
  }

  windowOpen() {
    const columns = parseInt(this.setting.querySelector('input[name="column"]').value);
    const rows = parseInt(this.setting.querySelector('input[name="row"]').value);
    const mines = parseInt(this.setting.querySelector('input[name="mines"]').value);

    if (columns < 5) alert('columns 값은 최소 5이상이 되어야 합니다');
    if (rows < 5) alert('rows 값은 최소 5이상이 되어야 합니다');
    if (mines < 10) alert('mines 값은 최소 10이상이 되어야 합니다');
    if (mines >= columns * rows) alert('mines 값이 너무 큽니다.');

    if ((columns >= 5) && (rows >= 5) && (mines >= 10) && (mines < columns * rows)) {
      this.game.columns = columns;
      this.game.rows = rows;
      this.game.mineLength = mines;
      this.game.reset();
  
      this.gameOverModalCheck = false;
      this.window.classList.add('active');
    }
  }

  windowClose() {
    this.game.stop();
    this.window.classList.remove('active');
  }

  padLeft(number, digits) {
    let numStr = number.toString();

    if (numStr.length < digits) {
      for (let i = 0; i <= digits - numStr.length; i ++) {
        numStr = '0' + numStr;
      }
    }

    return numStr;
  }

  resetGame() {
    this.gameOverModalCheck = false;
    this.game.reset();
  }

  toggleModal() {
    this.gameOverModal.querySelector('.modal-title').innerText = this.game.isGameClear ? 'Game Clear!!' : 'Game OVER!';
    this.gameOverModal.querySelector('.info.time').innerText = this.game.playTime;
    this.gameOverModal.querySelector('.info.count').innerText = this.game.mouseEventCounter;

    this.gameOverModal.classList.toggle('active');
  }

  changeResetButton(image = '') {
    if (image != '') {
      this.defaultImage = image;

    } else if (this.game.isGameOver) {
      this.resetBtnImage.src = this.images['over'];

    } else if (this.game.isGameClear) {
      this.resetBtnImage.src = this.images['cool'];

    } else {
      this.resetBtnImage.src = this.images[this.defaultImage];
    }
  }

  display() {
    this.mineCounter.innerText = this.padLeft(this.game.mineCounter <= 0 ? 0 : this.game.mineCounter, 3);
    this.playTime.innerText = this.padLeft(this.game.playTime, 3);
    this.changeResetButton();

    if (!this.gameOverModalCheck && (this.game.isGameClear || this.game.isGameOver)) {
      this.gameOverModalCheck = true;
      this.toggleModal();
    }
  }

  update(timestamp) {
    this.display();
    window.requestAnimationFrame(timestamp => this.update(timestamp));
  }
}

