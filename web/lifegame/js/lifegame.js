
class LifeGame {
  colors = ['lightgrey', 'grey', 'black'];

  constructor (element, columns, rows, elementPadding = 0) {
    this.canvas = element;
    this.columns = columns;
    this.rows = rows;
    this.elementPadding = elementPadding;
    this.lineWidth = 2;
    this.isPlay = false;
    this.current = 0;

    this.isPen = false;
    this.pen = 0;

    this.speed = 500;
    this.timestamp = null;

    this.context = this.canvas.getContext('2d');
    this.frame = undefined;

    this.changeCanvasSize(30, 30);
    this.clear();
    this.addEvents();
  }

  addEvents() {
    // this.canvas.addEventListener('click', event => this.boardClickEvent(event));

    this.canvas.addEventListener('mousedown', event => this.mousedown(event));
    this.canvas.addEventListener('mouseup', event => this.mouseup(event));
    this.canvas.addEventListener('mousemove', event => this.mousemove(event));
  }

  getClearBoard() {
    return [...Array(this.rows)].map(() => Array(this.columns).fill(0));
  }

  clear() {
    this.board = this.getClearBoard();
    this.draw();
  }

  changeCanvasSize(cellWidth, cellHeight) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;

    this.canvas.width = this.columns * this.cellWidth;
    this.canvas.height = this.rows * this.cellHeight;
  }

  getCellPos(event, callback) {
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    const canvasRect = this.canvas.getBoundingClientRect();

    const cellX = Math.floor((mouseX - canvasRect.left - this.elementPadding) / this.cellWidth) % this.columns;
    const cellY = Math.floor((mouseY - canvasRect.top - this.elementPadding) / this.cellHeight) % this.rows;

    callback(cellX, cellY, event);
  }

  mousedown(event) {
    this.stop();
    this.isPen = true;

    this.getCellPos(event, (x, y) => {
      this.pen = this.board[y][x] == 0 ? 2 : 0;
    });

    this.getCellPos(event, (x, y) => this.setCell(x, y, this.pen));
    this.draw();
  }

  mouseup(event) {
    this.isPen = false;
  }

  mousemove(event) {
    if (!this.isPen) return;

    this.getCellPos(event, (x, y) => this.setCell(x, y, this.pen));
    this.draw();
  }

  setCell(x, y, color) {
    console.assert(x >= 0 || x < this.column, `toggelCell: x pos range is over (${x})`);
    console.assert(y >= 0 || y < this.column, `toggelCell: y pos range is over (${y})`);

    this.board[y][x] = color;
  }

  play() {
    this.isPlay = true;
    this.frame = window.requestAnimationFrame(timestamp => this.update(timestamp));
  }

  stop() {
    if (!this.isPlay || !this.frame) return;

    this.isPlay = false;
    this.timestamp = null;
    window.cancelAnimationFrame(this.frame)
  }

  update(timestamp) {
    if (!this.isPlay) {
      return;

    } else if (this.timestamp == null) {
        // Check timestamp
        this.timestamp = timestamp;

    } else if (timestamp - this.timestamp < this.speed) {
      this.frame = window.requestAnimationFrame(timestamp => this.update(timestamp));
      return;
    }

    // Change Cells
    this.forward();

    // Update timestamp
    this.timestamp = timestamp;
    // Next frame
    this.frame = window.requestAnimationFrame(timestamp => this.update(timestamp));
  }

  boardForEach(callback) {
    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        callback(this.board[y][x], x, y);
      }
    }
  }

  countNeighbor(x, y) {
    const LENGTH = 8;
    const XPOS = [-1,  0,  1, -1,  1, -1,  0,  1];
    const YPOS = [-1, -1, -1,  0,  0,  1,  1,  1];

    let counter = 0;

    for (let i = 0; i < LENGTH; i ++) {
      const nx = x + XPOS[i];
      const ny = y + YPOS[i];

      if (nx < 0 || nx >= this.columns) continue;
      if (ny < 0 || ny >= this.rows) continue;

      if (this.board[ny][nx] > 0) counter++;
    }

    return counter;
  }

  forward() {
    this.boardForEach((color, x, y) => {
      if (color != 2) return;

      const counter = this.countNeighbor(x, y);
      if (counter < 2 || counter > 3) this.board[y][x] = 1;
    });

    const board = this.getClearBoard();

    this.boardForEach((color, x, y) => {
      if (this.board[y][x] == 1) return;
      if (this.board[y][x] == 2) {
        board[y][x] = 2;
        return;
      }

      const counter = this.countNeighbor(x, y);
      if (counter == 3) board[y][x] = 2;
    });

    this.board = board;

    this.draw();
    this.current++;
  }

  draw() {
    const ctx = this.context;

    // Clear
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Board
    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        const cell = this.board[y][x];

        let cellX = x * this.cellWidth;
        let cellY = y * this.cellHeight;

        ctx.fillStyle = this.colors[cell];
        ctx.fillRect(cellX, cellY, this.cellWidth, this.cellHeight);

        if (this.lineWidth > 0) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = this.lineWidth;
          ctx.strokeRect(cellX, cellY, this.cellWidth, this.cellHeight); 
        }
      }
    }
  }
}

