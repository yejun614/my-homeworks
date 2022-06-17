/*
 * [Tic Tac Toe]
 * JavaScript Tic Tac Toe Game
 *
 * YeJun, Jung (yejun614@naver.com)
 */

class Game {
  current = '';
  transitions = {};

  constructor(element) {
    this.html = document.createElement('div');
    this.startScene();
  }

  startScene() {
    this.changeScene(new GameStartScene(this))
  }

  gameScene() {
    this.changeScene(new TicTacToe(this));
  }

  addScene(name, scene) {
    this.scenes[name] = scene;
  }

  changeScene(scene, transition = 'None') {
    this.html.innerHTML = '';
    this.html.appendChild(scene.html);
  }
}

class GameStartScene {
  constructor(game) {
    this.game = game;
    this.html = document.createElement('div');
    this.html.id = 'game-title';
    this.html.innerHTML = `<h1>Tic Tac Toe</h1>`;

    const btnGroup = document.createElement('div');
    this.html.appendChild(btnGroup);

    const gameStartBtn = document.createElement('button');
    gameStartBtn.innerText = 'Game Start';
    gameStartBtn.onclick = () => this.game.gameScene();
    btnGroup.appendChild(gameStartBtn);
  }
}

class TicTacToe {
  constructor(game, columns = 3, rows = 3) {
    this.game = game;
    this.columns = columns;
    this.rows = rows;

    this.reset();
  }

  reset() {
    this.html = document.createElement('div');
    this.html.className = 'tic tac toe';

    this.board = [...Array(this.rows)].map(x => new Array(this.columns).fill(null));

    for (let y = 0; y < this.rows; y ++) {
      const row = document.createElement('div');
      row.className = 'row';

      for (let x = 0; x < this.columns; x ++) {
        this.board[y][x] = this.createTile(x, y);
        row.appendChild(this.board[y][x]);
      }

      this.html.appendChild(row);
    }

    this.turnCount = 0;
    this.isGameOver = false;
  }

  createTile(x, y) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.onclick = () => this.tileClick(x, y);

    return tile;
  }

  tileClick(x, y) {
    if (this.isGameOver) return;
    if (this.board[y][x].innerText != '') return;

    this.turnCount ++;

    if (this.turnCount % 2 == 0) {
      this.board[y][x].innerText = 'O';
    } else {
      this.board[y][x].innerText = 'X';
    }

    const result = this.gameCheck();

    if (result || this.turnCount >= this.columns * this.rows) {
      this.gameOver(!result);
    }
  }

  gameOver(isDraw = false) {
    console.log(new Date(), 'game over!');

    this.isGameOver = true;
    this.html.classList.add('game-over');
  }

  gameCheck() {
    // Horizontal
    for (let y = 0; y < this.rows; y ++) {
      if (this.horizontalCheck(y) == this.columns) {
        this.horizontalCheck(y, true);

        return true;
      }
    }

    // Vertical
    for (let x = 0; x < this.columns; x ++) {
      if (this.verticalCheck(x) == this.rows) {
        this.verticalCheck(x, true);

        return true;
      }
    }

    // Diagonal Size
    const diagonalSize = this.columns > this.rows ? this.columns : this.rows;

    // Diagonal Right
    if (this.diagonalCheck(true) == diagonalSize) {
      this.diagonalCheck(true, true);

      return true;
    }

    // Diagonal Left
    if (this.diagonalCheck(false) == diagonalSize) {
      this.diagonalCheck(false, true);

      return true;
    }

    return false;
  }

  horizontalCheck(index, highlight = false) {
    const pivot = this.board[index][0].innerText;
    if (pivot == '') return 0;

    let count = 0;

    for (let x = 0; x < this.columns; x ++) {
      const el = this.board[index][x];

      if (el.innerText == pivot) count ++;
      if (highlight) el.classList.add('active');
    }

    return count;
  }

  verticalCheck(index, highlight = false) {
    const pivot = this.board[0][index].innerText;
    if (pivot == '') return 0;

    let count = 0;

    for (let y = 0; y < this.rows; y ++) {
      const el = this.board[y][index];

      if (el.innerText == pivot) count ++;
      if (highlight) el.classList.add('active');
    }

    return count;
  }

  diagonalCheck(right = true, highlight = false) {
    let cx = 0;
    let dx = 0;

    if (right) {
      cx = 0;
      dx = 1;

    } else {
      cx = this.columns-1;
      dx = -1;
    }

    const pivot = this.board[0][cx].innerText;
    if (pivot == '') return 0;

    let count = 0;

    for (let y = 0; y < this.rows; y ++) {
      if (this.board[y][cx].innerText == pivot) count ++;
      if (highlight) this.board[y][cx].classList.add('active');
      cx += dx;
    }

    return count;
  }
}
