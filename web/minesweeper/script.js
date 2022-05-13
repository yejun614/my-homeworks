
const gameCanvas = document.querySelector('#game-canvas');
const mineCounter = document.querySelector('#mine-counter');
const playTime = document.querySelector('#play-time');
const resetBtn = document.querySelector('#reset-btn');

const game = new MinesweeperGame(gameCanvas, 20, 20, 99, 20);
const gameDisplay = new GameDisplay(game, resetBtn, mineCounter, playTime);

const dashboard = document.querySelector('#dashboard');
dashboard.style.width = `${gameCanvas.width}px`;
