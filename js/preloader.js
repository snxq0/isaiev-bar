window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const spinner = document.getElementById('spinner');
    const images = document.images;
    let loadedImages = 0;

    // Определяем скорость интернета
    let speedMultiplier = 1; // по умолчанию
    if (navigator.connection) {
        switch(navigator.connection.effectiveType) {
            case 'slow-2g': speedMultiplier = 2; break; // медленный интернет → дольше прелоадер
            case '2g': speedMultiplier = 1.5; break;
            case '3g': speedMultiplier = 1.2; break;
            case '4g': speedMultiplier = 1; break; // быстрый интернет → быстро исчезает
        }
    }

    // Функция обновления загрузки
    function updateLoader() {
        loadedImages++;
        const percent = (loadedImages / images.length) * 100;

        // Можно вращать spinner в зависимости от прогресса
        spinner.style.transform = `rotate(${percent * 3.6}deg)`;

        if (percent >= 100) {
            // Плавное исчезновение прелоадера
            preloader.style.transition = 'opacity 0.5s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500 * speedMultiplier);
        }
    }

    // Если картинок нет, делаем "симуляцию" загрузки с учётом скорости интернета
    if (images.length === 0) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1 * speedMultiplier;
            spinner.style.transform = `rotate(${progress * 3.6}deg)`;
            if (progress >= 100) {
                clearInterval(interval);
                preloader.style.transition = 'opacity 0.5s ease';
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }
        }, 20);
    } else {
        // Подписываемся на загрузку каждой картинки
        for (let img of images) {
            if (img.complete) {
                updateLoader();
            } else {
                img.onload = updateLoader;
                img.onerror = updateLoader; // чтобы ошибки тоже считались
            }
        }
    }
});
