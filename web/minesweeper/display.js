
class GameDisplay {
  constructor (game, mineCounter, playTime) {
    this.game = game;
    this.mineCounter = mineCounter;
    this.playTime = playTime;

    this.display();
    this.update();
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

  display() {
    this.mineCounter.innerText = this.padLeft(this.game.mineCounter <= 0 ? 0 : this.game.mineCounter, 3);
    this.playTime.innerText = this.padLeft(this.game.playTime, 3);
  }

  update(timestamp) {
    this.display();
    window.requestAnimationFrame(timestamp => this.update(timestamp));
  }
}

