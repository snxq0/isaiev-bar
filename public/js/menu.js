const buttons = document.querySelectorAll('.category-btn');
const cards = document.querySelectorAll('.menu-card');

function filterMenu(category) {
  cards.forEach(card => {
    card.classList.remove('show');
    if(category === 'all' || card.classList.contains(category)) {
      card.classList.add('show');
    }
  });
}

filterMenu('all');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterMenu(btn.dataset.category);
  });
});