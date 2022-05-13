
const gameCanvas = document.querySelector('#game-canvas');

const game = new MinesweeperGame(gameCanvas, 20, 20, 99, 20);
const gameDisplay = new GameDisplay(game);

const dashboard = document.querySelector('#dashboard');
dashboard.style.width = `${gameCanvas.width}px`;
