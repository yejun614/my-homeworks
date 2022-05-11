
const gameCanvas = document.querySelector('#game-canvas');
const mineCounter = document.querySelector('#mine-counter');
const playTime = document.querySelector('#play-time');

const game = new MinesweeperGame(gameCanvas, 9, 9, 10, 20);
const gameDisplay = new GameDisplay(game, mineCounter, playTime);

const resetBtn = document.querySelector('#reset-btn');
resetBtn.addEventListener('click', () => {
  game.reset();
});

const dashboard = document.querySelector('#dashboard');
dashboard.style.width = `${gameCanvas.width}px`;
