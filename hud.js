// hud.js – Hybrid mode (підміна ресурсів)
(function() {
    console.log("[HUD] Hybrid mode loaded");

    // Базовий шлях до твоїх картинок на GitHub
    const baseUrl = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/";

    // Словник: який елемент -> яка нова картинка
    const replacements = {
        ".hud-health-icon": "0.png",    // клас із гри -> твій файл
        ".hud-armor-icon": "1.png",
        ".hud-hunger-icon": "24.png",
        ".hud-money-icon": "25.png",
        ".hud-level-icon": "31.png"
    };

    function applyReplacements() {
        for (const selector in replacements) {
            const el = document.querySelector(selector);
            if (el) {
                const newImg = baseUrl + replacements[selector];
                if (el.tagName === "IMG") {
                    el.src = newImg;
                } else {
                    el.style.backgroundImage = `url(${newImg})`;
                }
            }
        }
    }

    // Чекаємо завантаження DOM
    document.addEventListener("DOMContentLoaded", () => {
        console.log("[HUD] DOM loaded, applying replacements...");
        applyReplacements();

        // Якщо HUD перемальовується під час гри — пробуємо ще
        setInterval(applyReplacements, 2000);
    });
})();
