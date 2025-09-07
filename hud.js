window.addEventListener("load", () => {
  console.log("HUD replacer loaded ✅");

  // Заміна HP (сердечко)
  const hpIcon = document.querySelector("img[src*='heart.png']");
  if (hpIcon) {
    hpIcon.src = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/0.png";
  }

  // Заміна Їжі
  const foodIcon = document.querySelector("img[src*='food.png']");
  if (foodIcon) {
    foodIcon.src = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/1.png";
  }

  // Заміна Грошей
  const moneyIcon = document.querySelector("img[src*='money.png']");
  if (moneyIcon) {
    moneyIcon.src = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/24.png";
  }

  // Заміна Зброї (приклад)
  document.querySelectorAll(".weapon-slot img").forEach((img, i) => {
    img.src = `https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/${25+i}.png`;
  });
});
