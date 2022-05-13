// 2022-05-11

const XPOS = [-1, -1, -1,  0,  0,  0, +1, +1, +1];
const YPOS = [-1,  0, +1, -1,  0,  +1, -1,  0, +1];

class MinesweeperGame {
  
  colors = {
    'cell': 'rgb(189, 189, 189)',
    'cellBorderLeft': 'rgb(255, 255, 255)',
    'cellBorderRight': 'rgb(123, 123, 123)',
    'visible': 'rgb(189, 189, 189)',
    'visibleBorder': 'rgb(124, 124, 124)',
    'highlight': 'rgb(255, 0, 0)'
  };

  textColors = [
    'black', 'blue', 'green', 'red',
  ]

  isPlay = false;
  images = {};
  leftMouseButton = false;
  rightMouseButton = false;
  isGameOver = false;
  isGameClear = false;
  playTime = 0;
  playTimeStamp = null;
  mineCounter = 0;
  mouseEventCounter = 0;

  constructor(canvas, columns = 10, rows = 10, mineLength = 5, cellSize = 20) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.columns = columns;
    this.rows = rows;
    this.mineLength = mineLength;
    this.cellSize = cellSize;

    this.loadImages();
    this.addEvents();
    this.reset(); 
    this.update();
  }

  loadImages() {
    this.images['flower'] = new Image();
    this.images['flower'].src = 'flower.png';

    this.images['flag'] = new Image();
    this.images['flag'].src = 'flag.png';

    this.images['help'] = new Image();
    this.images['help'].src = 'help.png';
  }

  setFlag(x, y, flag) {
    console.assert((x >= 0 && x <= this.columns), `setFlag: x position is over (${x})`);
    console.assert((y >= 0 && y <= this.rows), `setFlag: y position is over (${y})`);

    this.board[y][x] = flag;

    if (flag == 0 && this.mines[y][x] == 1) {
      this.gameOver(x, y);
    }
  }

  openCell(x, y) {
    const stack = [[x, y]];

    while (stack.length > 0) {
      const pos = stack.pop();
      this.setFlag(pos[0], pos[1], 0);

      let checkMine = 0;
      const current = []

      for (let i = 0; i < 9; i ++) {
        const xpos = pos[0] + XPOS[i];
        const ypos = pos[1] + YPOS[i];

        if (xpos < 0 || xpos >= this.columns || ypos < 0 || ypos >= this.rows) continue;
        if (this.board[ypos][xpos] != -1) continue;
        if (this.mines[ypos][xpos] == 1) checkMine ++;

        current.push([xpos, ypos]);
      }

      if (checkMine > 0) {
        this.setFlag(pos[0], pos[1], checkMine);
      } else {
        current.forEach(el => stack.push(el));
      }
    }
  }

  addEvents() {
    this.canvas.addEventListener('mousedown', event => this.mousedown(event));
    this.canvas.addEventListener('mouseup', event => this.mouseup(event));
    this.canvas.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }

  mousedown(event) {
    event.preventDefault();
    this.mouseEventCounter ++;

    const mouseX = Math.floor((event.pageX - this.canvas.offsetLeft) / (this.cellSize + 3));
    const mouseY = Math.floor((event.pageY - this.canvas.offsetTop) / (this.cellSize + 3));
    
    if (!this.isPlay) {
      if (this.isGameOver) return;

      // Game START!!
      this.putMines(mouseX, mouseY);
      this.play();
    }

    if (event.which == 1) {
      this.leftMouseButton = true;
    } else if (event.which == 3) {
      this.rightMouseButton = true;
    }

    if (event.which == 2 || (this.leftMouseButton && this.rightMouseButton)) {
      console.log('Both click');

    } else if (this.leftMouseButton) {
      // this.setFlag(mouseX, mouseY, 0);
      this.openCell(mouseX, mouseY);

    } else if (this.rightMouseButton) {
      const cell = this.board[mouseY][mouseX];
      let flag = 0;
  
      if (cell == -1) {
        flag = -2;
        this.mineCounter --;

    } else if (cell == -2) {
        flag = -3;
        this.mineCounter ++;

    } else if (cell == -3) {
        flag = -1;

      } else {
        return;
      }
  
      this.setFlag(mouseX, mouseY, flag);
    }
  }

  mouseup(event) {
    if (event.which == 1) {
      this.leftMouseButton = false;
    } else if (event.which == 3) {
      this.rightMouseButton = false;
    }
  }

  putMines(cx, cy) {
    // Set mines
    let mineCount = 0;
    while (mineCount < this.mineLength) {
      const x = Math.floor(Math.random() * this.columns);
      const y = Math.floor(Math.random() * this.rows);

      let checkPos = true;
      for (let i = 0; i < 9; i ++) {
        if (x == cx + XPOS[i] && y == cy + YPOS[i]) {
          checkPos = false;
          break;
        }
      }

      if (checkPos && this.mines[y][x] == 0) {
        this.mines[y][x] = 1;
        mineCount ++;
      }
    }
  }

  reset() {
    // Stop Game
    this.stop();

    // Game Clear
    this.playTime = 0;
    this.isGameOver = false;
    this.mineCounter = this.mineLength;
    this.mouseEventCounter = 0;

    // Resize Canvas
    this.canvas.width = (this.cellSize + 3) * this.columns;
    this.canvas.height = (this.cellSize + 3) * this.rows;

    // 0 -- Nothing, 1 -- Mine
    this.mines = [...Array(this.rows)].map(x => new Array(this.columns).fill(0));

    // (-1) -- Hidden, (0) -- Visible, (-2) -- Flag(Mine), (-3) -- Flag(Question)
    this.board = [...Array(this.rows)].map(x => new Array(this.columns).fill(-1));

    // Draw Game
    this.update();
  }

  gameOver(x, y) {
    console.log('Game Over!');

    this.stop();
    this.isGameOver = true;
    
    // Show all mines
    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        if (this.mines[y][x] == 0) continue;
        this.board[y][x] = 0;
      }
    }

    this.board[y][x] = 2;
    this.update();
    this.drawMarkCell(x * (this.cellSize + 3), y * (this.cellSize + 3));
  }

  nextFrame() {
    this.animation = window.requestAnimationFrame(timestamp => this.update(timestamp));
  }

  play() {
    this.isPlay = true;
    this.nextFrame();
  }

  stop() {
    this.isPlay = false;

    if (this.animation) {
      window.cancelAnimationFrame(this.animation);
    }
  }

  drawHighlightCell(cellX, cellY) {
    this.context.fillStyle = this.colors['highlight'];
    this.context.fillRect(cellX, cellY, this.cellSize, this.cellSize);
  }

  drawMarkCell(cellX, cellY) {
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.colors['highlight'];

    this.context.beginPath();
    this.context.moveTo(cellX, cellY);
    this.context.lineTo(cellX + this.cellSize, cellY + this.cellSize);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(cellX + this.cellSize, cellY);
    this.context.lineTo(cellX, cellY + this.cellSize);
    this.context.stroke();
  }

  drawHiddenCell(cellX, cellY) {
    this.context.fillStyle = this.colors['cell'];
    this.context.fillRect(cellX, cellY, this.cellSize, this.cellSize);

    // Border
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.strokeStyle = this.colors['cellBorderLeft'];
    this.context.moveTo(cellX, cellY);                    // Top
    this.context.lineTo(cellX + this.cellSize, cellY);
    this.context.moveTo(cellX, cellY);                    // Left
    this.context.lineTo(cellX, cellY + this.cellSize);
    this.context.stroke();

    this.context.beginPath()
    this.context.strokeStyle = this.colors['cellBorderRight'];
    this.context.moveTo(cellX + this.cellSize, cellY);    // Right
    this.context.lineTo(cellX + this.cellSize, cellY + this.cellSize);
    this.context.moveTo(cellX, cellY + this.cellSize);    // Bottom
    this.context.lineTo(cellX + this.cellSize, cellY + this.cellSize);
    this.context.stroke();
  }

  drawVisibleCell(cellX, cellY)  {
    this.context.fillStyle = this.colors['visible'];
    this.context.fillRect(cellX, cellY, this.cellSize, this.cellSize);
  }

  drawFlag(cellX, cellY, flagStr) {
    const img = this.images[flagStr]
    this.context.drawImage(img, cellX + 3, cellY + 3, this.cellSize - 6, this.cellSize - 6);
  }

  drawNumber(cellX, cellY, num) {
    cellX += (this.cellSize / 2) - 3;
    cellY += this.cellSize - 3;

    const fontSize = this.cellSize - 3;

    if (this.textColors.length >= num) {
      this.context.fillStyle = this.textColors[num];

    } else {
      this.context.fillStyle = this.textColors[0];
    }

    this.context.font = `${fontSize}px bold sans-serif`;
    this.context.fillText(num, cellX, cellY);
  }

  drawBoard() {
    // Background Color
    this.context.fillStyle = this.colors['visible'];
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Background Lines
    this.context.lineWidth = 3;
    this.context.strokeStyle = this.colors['visibleBorder'];

    this.context.beginPath();
    for (let y = 0; y < this.rows; y ++) {
      const cellY = y * (this.cellSize + 3);

      this.context.moveTo(0, cellY);
      this.context.lineTo(this.canvas.width, cellY);
    }

    for (let x = 0;  x < this.columns; x ++) {
      const cellX = x * (this.cellSize + 3);

      this.context.moveTo(cellX, 0);
      this.context.lineTo(cellX, this.canvas.height)
    }
    this.context.stroke();

    // Cells
    for (let y = 0; y < this.rows; y ++) {
      for (let x = 0; x < this.columns; x ++) {
        const cellX = x * (this.cellSize + 3);
        const cellY = y * (this.cellSize + 3);

        if (this.board[y][x] >= 0) {
          if (this.mines[y][x] != 0) {
            this.drawFlag(cellX, cellY, 'flower');

            if (this.mines[y][x] == 2) {
              this.drawHighlightCell(cellX, cellY);
            }
          } else if (this.board[y][x] > 0) {
            this.drawNumber(cellX, cellY, this.board[y][x]);
          }

        } else {
          this.drawHiddenCell(cellX, cellY);
        }
        
        if (this.board[y][x] == -2) {
          this.drawFlag(cellX, cellY, 'flag');
        } else if (this.board[y][x] == -3) {
          this.drawFlag(cellX, cellY, 'help');
        }
      }
    }
  }

  update(timestamp) {
    // Clear Canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw Board
    this.drawBoard();

    if (this.isPlay) {
      // Play Time
      if (this.playTimeStamp == null) this.playTimeStamp = timestamp;

      if (timestamp - this.playTimeStamp >= 1000) {
        this.playTime ++;
        this.playTimeStamp = timestamp;
      }

      // Next Frame
      this.nextFrame();
    }
  }

}
