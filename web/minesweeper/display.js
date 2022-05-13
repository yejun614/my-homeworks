
class GameDisplay {

  images = {
    'idle': './smile-idle.png',
    'cool': './smile-cool.png',
    'over': './smile-over.png',
    'click': './smile-click.png',
  };

  defaultImage = 'idle'

  constructor (game, resetBtn, mineCounter, playTime) {
    this.game = game;
    this.resetBtn = resetBtn;
    this.resetBtnImage = this.resetBtn.querySelector('img');
    this.mineCounter = mineCounter;
    this.playTime = playTime;

    this.addEvents();
    this.display();
    this.update();
  }

  addEvents() {
    this.resetBtn.addEventListener('click', () => this.game.reset());
    this.game.canvas.addEventListener('mousedown', () => this.changeResetButton('click'));
    this.game.canvas.addEventListener('mouseup', () => this.changeResetButton('idle'));
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
  }

  update(timestamp) {
    this.display();
    window.requestAnimationFrame(timestamp => this.update(timestamp));
  }
}

