// YeJun, Jung (yejun614@naver.com, 20193219@office.deu.ac.kr)

const XPOS = [ -1,  1,  0,  0 ];
const YPOS = [  0,  0, -1,  1 ];

class SlidingPuzzle {

  colors = {
    'primary': 'lightskyblue',
    'secondary': 'cornflowerblue',
    'highlight': 'white',
    'check': 'royalblue',
  };

  isPlay = false;
  isGameClear = false;
  cellWidth = 60;
  cellHeight = 60;
  playtime = 0;
  playtimeCheck = null;
  mouseCounter = 0;
  tx = 0;
  ty = 0;

  constructor(canvas, columns, rows) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.columns = columns;
    this.rows = rows;

    this.addEvents();
    this.reset();
    this.start();
  }

  reset() {
    // Reset
    this.isPlay = false;
    this.playtime = 0;
    this.playtimeCheck = null;
    this.isGameClear = false;
    this.mouseCounter = 0;
    this.tx = 0;
    this.ty = 0;

    // Canvas size
    this.canvas.width = this.columns * this.cellWidth;
    this.canvas.height = this.rows * this.cellHeight;

    // Reset game board
    this.board = [...Array(this.rows)].map(x => new Array(this.columns).fill(0));
    this.hoverBoard = [...Array(this.rows)].map(x => new Array(this.columns).fill(0));

    // Set numbers for board
    let count = 0;

    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        this.board[y][x] = count++;
      }
    }

    // shake it
    this.shake(100 * this.columns * this.rows, 0);
  }

  shake_once() {
    while (true) {
      // Set random direction
      const randDir = Math.floor(Math.random() * 4);
      const x = this.tx + XPOS[randDir];
      const y = this.ty + YPOS[randDir];

      if (this.swapTile(this.tx, this.ty, x, y)) {
        this.tx = x;
        this.ty = y;

      } else {
        continue;
      }

      break;
    }
  }

  shake(count, delay = 0) {
    // Shake board by the "count" times
    while (count --) {
      setTimeout(() => this.shake_once(), count * delay);
    }
  }

  gameClearCheck() {
    let count = 0;

    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        if (this.board[y][x] != count) return false;

        count ++;
      }
    }

    console.log(new Date(), "Game Clear!");
    this.isGameClear = true;
    this.stop();
    this.draw();

    return true;
  }

  start() {
    this.isPlay = true;
    this.animation = window.requestAnimationFrame(timestamp => this.update(timestamp));
  }

  stop() {
    this.isPlay = false;
    window.cancelAnimationFrame(this.animation)
  }

  draw() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set styies
    this.context.strokeStyle = '#000';
    this.context.font = '30px sans-serif';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        const xpos = x * this.cellWidth;
        const ypos = y * this.cellHeight;
        let color = 'primary';

        if (this.board[y][x] == 0) {
          color = 'highlight';

        } else if (this.board[y][x] == y * this.columns + x) {
          color = 'check';

        } else if (this.hoverBoard[y][x] == 1) {
          color = 'secondary';
        }

        this.context.fillStyle = this.colors[color];
        this.context.fillRect(xpos, ypos, this.cellWidth, this.cellHeight);
        this.context.strokeRect(xpos, ypos, this.cellWidth, this.cellHeight);

        if (this.board[y][x] != 0) {
          this.context.fillStyle = '#000';
          this.context.fillText(this.board[y][x], xpos + (this.cellWidth/2), ypos + (this.cellHeight/2));
        }
      }
    }
  }

  update(timestamp) {
    if (this.playtimeCheck === null) {
      this.playtimeCheck = timestamp;
    } else if (timestamp - this.playtimeCheck >= 1000) {
      this.playtime ++;
      this.playtimeCheck = timestamp;
    }

    this.draw();

    if (this.isPlay) {
      this.start();
    }
  }

  addEvents() {
    this.canvas.addEventListener('mousemove', event => this.hover(event));
    this.canvas.addEventListener('click', event => this.click(event));
    document.addEventListener('keydown', event => this.keydown(event));
  }

  hover(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = Math.floor((event.pageX - rect.left) / this.cellWidth);
    const mouseY = Math.floor((event.pageY - rect.top) / this.cellHeight);
    if (mouseX < 0 || mouseX >= this.columns || mouseY < 0 || mouseY >= this.rows) return;

    this.hoverBoard[mouseY][mouseX] = 1;

    setTimeout(() => {
      this.hoverBoard[mouseY][mouseX] = 0;
    }, 100);
  }

  click(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = Math.floor((event.pageX - rect.left) / this.cellWidth);
    const mouseY = Math.floor((event.pageY - rect.top) / this.cellHeight);
    if (mouseX < 0 || mouseX >= this.columns || mouseY < 0 || mouseY >= this.rows) return;

    this.mouseCounter ++;
    this.moveTile(mouseX, mouseY);

    this.gameClearCheck();
  }

  keydown(event) {
    const validCodes = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'KeyW',
      'KeyS',
      'KeyA',
      'KeyD',
    ];

    if (!validCodes.includes(event.code)) return;

    let cx = this.tx;
    let cy = this.ty;

    // Check keyboard code
    if (event.code === 'ArrowUp' || event.code === 'KeyW') {
      // Move down
      cy ++;

    } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
      // Move up
      cy --;

    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      // Move left
      cx ++;

    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      // Move right
      cx --;
    }

    if (this.swapTile(this.tx, this.ty, cx, cy)) {
      this.tx = cx;
      this.ty = cy;
      this.mouseCounter ++;
    }

    this.gameClearCheck();
  }

  moveTile(x, y) {
    console.assert(x >= 0 && x < this.columns && y >= 0 && y < this.rows, `범위 초과: {x}, {y}`);

    for (let i = 0; i < 4; i ++) {
      const cx = x + XPOS[i];
      const cy = y + YPOS[i];

      if (cx < 0 || cx >= this.columns || cy < 0 || cy >= this.rows) continue;

      if (this.board[cy][cx] == 0) {
        this.board[cy][cx] = this.board[y][x];
        this.board[y][x] = 0;

        this.tx = cx;
        this.ty = cy;

        break;
      }
    }
  }

  swapTile(x1, y1, x2, y2) {
    if (x1 < 0 || x1 >= this.columns || y1 < 0 || y1 >= this.rows) return false;
    if (x2 < 0 || x2 >= this.columns || y2 < 0 || y2 >= this.rows) return false;

    const value = this.board[y1][x1];
    this.board[y1][x1] = this.board[y2][x2];
    this.board[y2][x2] = value;

    return true;
  }
}

class AutoSlidingPuzzle extends SlidingPuzzle {

  game = undefined;
  steps = [];
  hardLimit = 10000;

  constructor(game) {
    super(game.canvas, game.columns, game.rows);
    
    this.stop();
    this.setGame(game);
  }

  setGame(game) {
    this.game = game;

    this.board = [...this.game.board];
    this.columns = this.game.columns;
    this.rows = this.game.rows;
    this.tx = this.game.tx;
    this.ty = this.game.ty;
  }

  manhattanDistance(x1, y1, x2, y2) {
    return 2 * (Math.abs(x1 - x2) + Math.abs(y1 - y2));
  }

  heuristic() {
    let result = 0;
    let check = 0;

    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        const cx = check % this.rows;
        const cy = check / this.rows;
        result += this.manhattanDistance(x, y, cx, cy);

        check++;
      }
    }

    return result;
  }

  gameClearCheck() {
    let count = 0;

    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        if (this.board[y][x] != count) return false;

        count ++;
      }
    }

    return true;
  }

  solve() {
    const steps = [];
    let isSolve = false;

    for (let limit = 0; limit < this.hardLimit; limit ++) {
      if (this.gameClearCheck()) {
        isSolve = true;
        break;
      }

      let min_heuristic = this.columns * this.rows * 2;
      let direction = [0, 0];

      for (let i = 0; i < 4; i ++) {
        const cx = this.tx + XPOS[i];
        const cy = this.ty + YPOS[i];

        if (this.swapTile(this.tx, this.ty, cx, cy)) {
          let current_heuristic = this.heuristic();
          if (current_heuristic < min_heuristic) {
            min_heuristic = current_heuristic;
            direction = [cx, cy];
          }

          this.swapTile(cx, cy, this.tx, this.ty);
        }
      }

      if (this.swapTile(this.tx, this.ty, direction[0], direction[1])) {
        this.tx = direction[0];
        this.ty = direction[1];
        // steps.push(direction);
        steps.push([direction[0], direction[1], min_heuristic]);
      }
    }

    console.log(steps);

    if (isSolve) {
      this.steps = steps;
      return true;
    }

    return false;
  }

  apply(delay = 0) {
    console.log('Auto Play On');
    console.log(this.steps);

    const length = this.steps.length;

    if (length == 0) {
      console.log('stack is empty');
      return;
    }

    for (let i = 0; i < this.steps.length; i ++) {
      console.log(this.steps[i]);
      setTimeout(() => {
        this.game.swapTile(this.game.tx, this.game.ty, this.steps[i][0], this.steps[i][1]);
      }, delay * i);
    }

    console.log(this.steps[length-1]);
    this.game.tx = this.steps[length-1][0];
    this.game.ty = this.steps[length-1][1];

    console.log('Auto Play Off');
  }

}
