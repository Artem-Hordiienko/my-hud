// Підключення hud.css з GitHub
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud.css";
document.head.appendChild(link);

// Створюємо контейнер HUD
const hud = document.createElement("div");
hud.className = "old-hud";

// Додаємо приклади елементів з картинками
hud.innerHTML = `
  <div class="old-top">
    <div class="hud-icon" 
         style="background-image: url('https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/0.png');">
    </div>
    <div class="hud-icon" 
         style="background-image: url('https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/1.png');">
    </div>
  </div>
`;

document.body.appendChild(hud);
