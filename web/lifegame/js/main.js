// GAME
const canvas = document.getElementById('game');
const game = new LifeGame(canvas, 20, 20);

const setBtn = document.getElementById('btn-set');
const clearBtn = document.getElementById('btn-clear');
const nextBtn = document.getElementById('btn-next');
const playBtn = document.getElementById('btn-play');
const stopBtn = document.getElementById('btn-stop');

setBtn.addEventListener('click', () => openModal());
clearBtn.addEventListener('click', () => game.clear());
nextBtn.addEventListener('click', () => game.forward());
playBtn.addEventListener('click', () => game.play());
stopBtn.addEventListener('click', () => game.stop());

// MODAL
const modal = document.getElementById('modal-setting');
const fields = modal.querySelectorAll('input[type="text"');

function openModal() {
  modal.classList.add('active');

  fields[0].value = game.columns;
  fields[1].value = game.rows;
  fields[2].value = game.cellWidth;
  fields[3].value = game.cellHeight;
  fields[4].value = game.lineWidth;
  fields[5].value = game.speed;
}

function closeModal() {
  modal.classList.remove('active');
}

function applyModal() {
  game.columns = parseInt(fields[0].value);
  game.rows = parseInt(fields[1].value);
  game.lineWidth = parseInt(fields[4].value);
  game.speed = parseInt(fields[5].value);

  const cellWidth = parseInt(fields[2].value);
  const cellHeight = parseInt(fields[3].value);
  game.changeCanvasSize(cellWidth, cellHeight);

  game.clear();
  closeModal();
}

const modalCancelBtn = document.getElementById('btn-setting-cancel');
const modalApplyBtn = document.getElementById('btn-setting-apply');

modalCancelBtn.addEventListener('click', () => closeModal());
modalApplyBtn.addEventListener('click', () => applyModal());

// Keyboard Event
document.addEventListener('keydown', (event) => {
  if (!modal.classList.contains('active')) return;

  if (event.key === 'Enter') {
    applyModal();

  } else if (event.key === 'Escape') {
    closeModal();
  }
})
