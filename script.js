// Элементы
const multiplierElement = document.getElementById('multiplier');
const getSignalButton = document.getElementById('getSignalButton');
const progressFill = document.querySelector('.progress-fill');
const winChanceElement = document.getElementById('win-chance');
const winChanceLabel = document.querySelector('.win-chance-label');
const clickSound = document.getElementById('clickSound');
const completeSound = document.getElementById('completeSound');
const menuButton = document.getElementById('menu-button');
const statusText = document.getElementById('status-text');
const progressBar = document.querySelector('.progress-bar');

// Данные для перевода
const translations = {
    ru: {
        title: "AVIATOR",
        chance_label: "Шанс",
        get_signal_button: "ПОЛУЧИТЬ СИГНАЛ",
        menu_button: "Меню",
        status_waiting: "Сигнал будет доступен, когда заполнится шкала",
        status_ready: "Вы снова можете получить сигнал"
    },
    en: {
        title: "AVIATOR",
        chance_label: "Chance",
        get_signal_button: "GET SIGNAL",
        menu_button: "Menu",
        status_waiting: "Signal will be available when the bar fills",
        status_ready: "You can get the signal again"
    },
    in: {
        title: "AVIATOR",
        chance_label: "संभावना",
        get_signal_button: "संकेत प्राप्त करें",
        menu_button: "मेनू",
        status_waiting: "सिग्नल उपलब्ध होगा जब बार भर जाएगा",
        status_ready: "आप फिर से सिग्नल प्राप्त कर सकते हैं"
    }
};

// Текущий язык
let currentLang = localStorage.getItem('language') || 'ru';

// Состояние прогресса
let isProgressRunning = localStorage.getItem('isProgressRunning') === 'true';
let progressStartTime = parseInt(localStorage.getItem('progressStartTime')) || 0;
const progressDuration = 20000; // 20 секунд

// Функция для обновления текстов
function updateTexts(lang) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        element.textContent = translations[lang][key];
    });
    menuButton.textContent = translations[lang].menu_button;
}

// Функция для генерации случайного множителя
function generateMultiplier() {
    const steps = 20;
    const targetMultiplier = Math.random() < 0.8 ?
        (Math.random() * (4.00 - 1.00) + 1.00).toFixed(2) :
        (Math.random() * (15.00 - 4.00) + 4.00).toFixed(2);

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(interval);
            multiplierElement.textContent = targetMultiplier;
        } else {
            const progress = currentStep / steps;
            const currentMultiplier = (1 + (targetMultiplier - 1) * progress).toFixed(2);
            multiplierElement.textContent = currentMultiplier;
            currentStep++;
        }
    }, 100);

    return targetMultiplier;
}

// Функция для генерации шанса выигрыша
function generateWinChance() {
    return (Math.random() * (97.00 - 77.00) + 77.00).toFixed(2);
}

// Функция для запуска анимации прогресса
function startProgressAnimation() {
    isProgressRunning = true;
    progressStartTime = Date.now();
    localStorage.setItem('isProgressRunning', 'true');
    localStorage.setItem('progressStartTime', progressStartTime);

    statusText.textContent = translations[currentLang].status_waiting;
    statusText.style.display = 'block';

    function animate() {
        const elapsed = Date.now() - progressStartTime;
        const progress = Math.min(elapsed / progressDuration, 1);
        progressFill.style.width = `${progress * 100}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isProgressRunning = false;
            localStorage.setItem('isProgressRunning', 'false');
            getSignalButton.disabled = false;

            // Скрываем шкалу после завершения
            progressFill.style.transition = 'none';
            progressFill.style.width = '0';
            progressBar.style.display = 'none';

            // Меняем текст на "Вы снова можете получить сигнал"
            statusText.textContent = translations[currentLang].status_ready;
        }
    }
    requestAnimationFrame(animate);
}

// Функция для сброса прогресса
function resetProgress() {
    progressFill.style.width = '0';
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }

    if (isProgressRunning) {
        const elapsed = Date.now() - progressStartTime;
        if (elapsed < progressDuration) {
            const remainingTime = progressDuration - elapsed;

            // Устанавливаем текущий прогресс шкалы
            progressFill.style.width = `${(elapsed / progressDuration) * 100}%`;

            // Убираем переход, чтобы шкала не сбрасывалась
            progressFill.style.transition = 'none';

            // Запускаем анимацию для оставшегося времени
            setTimeout(() => {
                progressFill.style.transition = `width ${remainingTime}ms linear`;
                progressFill.style.width = '100%';
            }, 10); // Небольшая задержка для корректного применения transition

            getSignalButton.disabled = true;

            // Показываем текст "Сигнал будет доступен, когда заполнится шкала"
            statusText.textContent = translations[currentLang].status_waiting;
            statusText.style.display = 'block';

            setTimeout(() => {
                isProgressRunning = false;
                localStorage.setItem('isProgressRunning', 'false');
                getSignalButton.disabled = false;

                // Скрываем шкалу после завершения
                progressFill.style.transition = 'none';
                progressFill.style.width = '0';
                progressBar.style.display = 'none';

                // Меняем текст на "Вы снова можете получить сигнал"
                statusText.textContent = translations[currentLang].status_ready;
            }, remainingTime);
        } else {
            isProgressRunning = false;
            localStorage.setItem('isProgressRunning', 'false');
            getSignalButton.disabled = false;

            // Скрываем шкалу, если время истекло
            progressFill.style.transition = 'none';
            progressFill.style.width = '0';
            progressBar.style.display = 'none';

            // Меняем текст на "Вы снова можете получить сигнал"
            statusText.textContent = translations[currentLang].status_ready;
            statusText.style.display = 'block';
        }
    } else {
        // Если прогресс не запущен, показываем текст "Вы снова можете получить сигнал"
        statusText.textContent = translations[currentLang].status_ready;
        statusText.style.display = 'block';

        // Скрываем шкалу, если прогресс не запущен
        progressBar.style.display = 'none';
    }

    // Создание звезд
    createStars();
});

// Обработчик нажатия на кнопку
getSignalButton.addEventListener('click', () => {
    if (isProgressRunning) return;

    clickSound.play();

    // Генерация множителя и шанса выигрыша
    const multiplier = generateMultiplier();
    const winChance = generateWinChance();

    // Отображение множителя в кругу
    multiplierElement.textContent = multiplier;

    // Отображение шанса выигрыша
    winChanceElement.textContent = `${winChance}%`;

    winChanceLabel.style.display = 'block';
    winChanceElement.style.display = 'block';

    getSignalButton.disabled = true;

    // Показываем шкалу и сбрасываем прогресс
    progressBar.style.display = 'block';
    resetProgress();

    // Запускаем анимацию прогресса
    startProgressAnimation();
});

// Создание звездочек
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;

    const starCount = 50;
    const circle = document.querySelector('.circle');
    const circleRect = circle.getBoundingClientRect();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        let x, y;
        do {
            x = Math.random() * window.innerWidth;
            y = Math.random() * window.innerHeight;
        } while (
            x > circleRect.left &&
            x < circleRect.right &&
            y > circleRect.top &&
            y < circleRect.bottom
        );

        star.style.top = `${y}px`;
        star.style.left = `${x}px`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// Переключение языка
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    const languageButton = document.getElementById('language-button');
    languageButton.textContent = lang.toUpperCase() + ' ▼';

    const flagIcon = document.getElementById('flag-icon');
    flagIcon.src = `https://flagcdn.com/${lang === 'ru' ? 'ru' : lang === 'en' ? 'us' : 'in'}.svg`;

    updateTexts(lang);
    document.querySelector('.language-switcher').classList.remove('active');
}

function toggleLanguageDropdown() {
    const switcher = document.querySelector('.language-switcher');
    switcher.classList.toggle('active');
}

// Установка языка по умолчанию
setLanguage(currentLang);

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '';
    createStars();
});
