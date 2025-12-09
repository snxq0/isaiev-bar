const buttons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".menu-card");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {

        // активная кнопка
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.dataset.category;

        cards.forEach(card => {
            // фильтрация
            if (category === "all" || card.classList.contains(category)) {
                card.classList.add("show");
            } else {
                card.classList.remove("show");
            }
        });
    });
});

// Показ всех карточек при загрузке
window.addEventListener("load", () => {
    cards.forEach(card => card.classList.add("show"));
});
