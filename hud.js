const hudIcons = {
  heart: "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/0.png",
  food:  "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/1.png",
  fish:  "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/24.png",
  gun:   "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/25.png",
  car:   "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/31.png"
};

// приклад вставки іконки в DOM:
window.addEventListener("DOMContentLoaded", () => {
  const hud = document.createElement("div");
  hud.id = "custom-hud";
  hud.innerHTML = `
    <img src="${hudIcons.heart}" alt="HP">
    <img src="${hudIcons.food}" alt="Food">
    <img src="${hudIcons.fish}" alt="Fish">
    <img src="${hudIcons.gun}" alt="Gun">
    <img src="${hudIcons.car}" alt="Car">
  `;
  document.body.appendChild(hud);
});
