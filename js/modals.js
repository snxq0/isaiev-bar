
const cards = document.querySelectorAll('.card');
const modals = [
  document.querySelector('.modal-win-card-who'),
  document.querySelector('.modal-win-card-phi'),
  document.querySelector('.modal-win-card-why')
];

function hideAllModals() {
  modals.forEach(modal => modal.classList.remove('show'));
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    hideAllModals(); 
    if (modals[index]) {
      modals[index].classList.add('show'); 
    }
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.tagName === 'P') {
      modal.classList.remove('show');
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideAllModals();
});
