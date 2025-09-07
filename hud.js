// hud.js — додаємо картинки HUD прямо у DOM

window.addEventListener("load", () => {
  console.log("HUD script loaded ✅");

  // Контейнер у грі (можна підчепитися до body або іншого блоку)
  const container = document.createElement("div");
  container.id = "my-hud-container";
  container.style.position = "absolute";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";

  // Приклади іконок
  const icons = ["0.png", "1.png", "24.png", "25.png", "31.png"];
  icons.forEach(file => {
    const img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/${file}`;
    img.style.width = "48px";
    img.style.height = "48px";
    img.style.margin = "4px";
    container.appendChild(img);
  });

  document.body.appendChild(container);
});
