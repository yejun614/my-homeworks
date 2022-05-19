
const gameCanvas = document.querySelector('#game-canvas');

const game = new MinesweeperGame(gameCanvas, 20, 20, 99, 25);
const gameDisplay = new GameDisplay(game);

