const canvas = document.querySelector('#game');
const game = new SlidingPuzzle(canvas, 5, 5);
const displaySec = document.querySelector('#display .playtime');
const displayMouse = document.querySelector('#display .mouse-counter');
const modal = document.querySelector('#modal');

let modalToggle = false;

function newGame() {
  modalToggle = false;
  game.reset();
  game.start();
}

function changeSize() {
  const size = parseInt(prompt("Board Size", 10));
  if (isNaN(size)) return;

  if (size < 2) {
    alert("값이 너무 작습니다.");

  } else if (size > 50) {
    alert("값이 너무 큽니다.");

  } else {
    game.columns = size;
    game.rows = size;
  
    newGame();
  }
}

function toggleAutoMode() {
  const auto = new AutoSlidingPuzzle(game);
  if (!auto.solve()) {
    alert('해결방법을 찾지 못했습니다.');

  } else {
    // auto.apply(100);
  }
}

function updateDisplay() {
  if (game.isGameClear) {
    if (!modalToggle) {
      modal.classList.add('active');
      modalToggle = true;
    }

  } else {
    displaySec.innerHTML = game.playtime;
    displayMouse.innerHTML = game.mouseCounter;    
  }

  window.requestAnimationFrame(updateDisplay);
}

window.requestAnimationFrame(updateDisplay);

function closeModal() {
  modal.classList.remove('active');
}
