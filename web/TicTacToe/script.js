
const game = new Game();
document.querySelector('#game').appendChild(game.html);
document.querySelector('.btn.refresh').onclick = () => game.gameScene();
