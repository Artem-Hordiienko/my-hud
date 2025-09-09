// HYBRID HUD v2 — заміна будь-яких assets/… у IMG, inline style та CSS-правилах
(function () {
  const BASE = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/";

  // Якщо твої файли мають інші імена — вкажи тут відповідність:
  // "оригінал з гри" : "твоє_ім'я_файлу.png"
  const NAME_MAP = {
    // "0.png": "0.png",
    // "1.png": "1.png",
    // "24.png": "24.png",
    // "25.png": "25.png",
    // "31.png": "31.png",
  };

  function toRemote(rel) {
    const file = NAME_MAP[rel] || rel;
    return BASE + file;
  }

  function log(...args) {
    try { console.log("[HUD]", ...args); } catch (e) {}
  }

  log("Hybrid mode loaded");

  // ---- IMG <img src=".../assets/foo.png"> → GitHub ----
  function swapImg(img) {
    try {
      const src = img.getAttribute("src") || "";
      // ловимо .../assets/<name>
      const m = src.match(/(?:^|[\\/])assets[\\/](.+?)(?:$|\?|#)/i);
      if (!m) return;
      const rel = m[1];
      const newUrl = toRemote(rel);
      if (src !== newUrl) {
        img.setAttribute("src", newUrl);
        img.setAttribute("data-hud-remote", "1");
        log("IMG replaced:", rel, "→", newUrl);
      }
    } catch (e) {}
  }

  // ---- Inline background-image: url(assets/foo.png) → GitHub ----
  function swapStyle(el) {
    try {
      const style = el.style && el.style.backgroundImage ? el.style.backgroundImage : "";
      if (!style) return;
      const m = style.match(/assets[\\/](.+?)(?:["')]|$)/i);
      if (!m) return;
      const rel = m[1];
      const newUrl = toRemote(rel);
      el.style.backgroundImage = `url("${newUrl}")`;
      el.setAttribute("data-hud-remote", "1");
      log("STYLE replaced:", rel, "→", newUrl);
    } catch (e) {}
  }

  // ---- Патчимо CSS-таблиці стилів: url(assets/foo.png) → GitHub ----
  function patchStylesheets() {
    for (const ss of Array.from(document.styleSheets)) {
      let rules;
      try {
        rules = ss.cssRules; // може кинути SecurityError — пропускаємо
      } catch (e) { continue; }
      if (!rules) continue;

      for (const rule of Array.from(rules)) {
        if (!rule.style) continue;

        // background / background-image
        if (rule.style.backgroundImage && /assets[\\/]/i.test(rule.style.backgroundImage)) {
          const m = rule.style.backgroundImage.match(/assets[\\/](.+?)(?:["')]|$)/i);
          if (m) {
            const rel = m[1];
            const newUrl = toRemote(rel);
            rule.style.backgroundImage = `url("${newUrl}")`;
            log("CSS bg-image:", rel, "→", newUrl);
          }
        }
        if (rule.style.background && /assets[\\/]/i.test(rule.style.background)) {
          const m = rule.style.background.match(/assets[\\/](.+?)(?:["')]|$)/i);
          if (m) {
            const rel = m[1];
            const newUrl = toRemote(rel);
            rule.style.background = rule.style.background.replace(/url\([^)]+\)/, `url("${newUrl}")`);
            log("CSS background:", rel, "→", newUrl);
          }
        }
        // інші властивості з url(...) за потреби можна додати тут.
      }
    }
  }

  function processRoot(root) {
    root.querySelectorAll("img[src]").forEach(swapImg);
    root.querySelectorAll('[style*="assets/"],[style*="assets\\\\"]').forEach(swapStyle);
  }

  function runFullPass() {
    try {
      processRoot(document);
      patchStylesheets();
    } catch (e) {}
  }

  // Стартувати після побудови DOM + повтори (інтерфейс у грі динамічний)
  document.addEventListener("DOMContentLoaded", () => {
    log("DOM loaded, applying replacements...");
    runFullPass();

    // Слухаємо динамічні зміни
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) processRoot(n);
        });
        if (m.type === "attributes" && m.target instanceof Element) {
          if (m.attributeName === "src") swapImg(m.target);
          if (m.attributeName === "style") swapStyle(m.target);
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "style"],
    });

    // І підсилення: періодична повна перевірка (на випадок важких UI)
    setInterval(runFullPass, 2000);
  });
})();
