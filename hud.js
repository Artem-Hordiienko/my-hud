(function(){
  const img = new Image();
  img.src = "https://cdn.jsdelivr.net/gh/Artem-Hordiienko/my-hud/hud-assets/assets/0.png";
  img.style.position = "fixed";
  img.style.top = "10px";
  img.style.left = "10px";
  img.style.width = "64px";
  img.style.zIndex = "9999";
  document.body.appendChild(img);
  console.log("HUD image inserted:", img.src);
})();
