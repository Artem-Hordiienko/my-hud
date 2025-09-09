// === HUD replacer (hybrid) ===
// ВАЖЛИВО: у repo файли лежать у hud-assets/assets/*
// Тому BASE має закінчуватись на ".../hud-assets/assets/"

const BASE = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/";

// Якщо треба перейменування окремих файлів — додай тут.
// Напр.: {"old_name.png":"new_name.png"}
const NAME_MAP = {
  // "health.png": "0.png",
  // "armor.png": "1.png",
};

function toRemote(rel) {
  // rel може бути "assets/0.png", "/uiresources/assets/0.png", "0.png" тощо
  let file = rel
    .replace(/\\/g, '/')
    .replace(/^.*?(assets\/)/, '') // обрізаємо все до "assets/"
    .replace(/^.*?\//, match => (match.endsWith('/') ? '' : match)); // якщо без "assets/", лишаємо як є

  // Застосуємо map, якщо потрібно інше ім’я
  if (NAME_MAP[file]) file = NAME_MAP[file];

  return BASE + file;
}

function replaceImgElement(img) {
  const src = img.getAttribute('src') || '';
  if (!src) return;
  if (!/assets\//.test(src)) return;

  const remote = toRemote(src);
  if (img.dataset.hudReplaced === remote) return; // вже міняли

  img.addEventListener('error', () => {
    console.warn('[HUD] image 404:', remote, ' <- from ', src);
  }, { once: true });

  img.setAttribute('src', remote);
  img.dataset.hudReplaced = remote;
}

function replaceSrcset(el) {
  const srcset = el.getAttribute('srcset');
  if (!srcset) return;

  const parts = srcset.split(',').map(s => s.trim()).map(entry => {
    // "assets/0.png 2x" -> ["assets/0.png","2x"]
    const m = entry.match(/^(\S+)(\s+\S+)?$/);
    if (!m) return entry;
    const orig = m[1];
    if (!/assets\//.test(orig)) return entry;
    const rem = toRemote(orig);
    return rem + (m[2] || '');
  });

  el.setAttribute('srcset', parts.join(', '));
}

function replaceInlineStyle(el) {
  const style = el.getAttribute('style') || '';
  if (!style) return;
  if (!/url\(/.test(style)) return;

  const newStyle = style.replace(/url\(["']?(.*?)["']?\)/g, (all, url) => {
    if (!/assets\//.test(url)) return all;
    return `url("${toRemote(url)}")`;
  });

  if (newStyle !== style) el.setAttribute('style', newStyle);
}

function patchStylesheets() {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; } // CORS — пропускаємо
    if (!rules) continue;

    for (const rule of Array.from(rules)) {
      if (!rule.style) continue;
      if (!rule.style.cssText) continue;

      const txt = rule.style.cssText;
      if (txt.includes('url(')) {
        const patched = txt.replace(/url\(["']?(.*?)["']?\)/g, (all, url) => {
          if (!/assets\//.test(url)) return all;
          return `url("${toRemote(url)}")`;
        });
        if (patched !== txt) {
          try { rule.style.cssText = patched; } catch {}
        }
      }
    }
  }
}

function sweepDOM(root = document) {
  // <img>
  root.querySelectorAll('img[src*="assets/"]').forEach(replaceImgElement);
  // srcset: <img>, <source>, <picture>
  root.querySelectorAll('[srcset*="assets/"]').forEach(replaceSrcset);
  // inline background-image тощо
  root.querySelectorAll('[style*="url("]').forEach(replaceInlineStyle);
}

(function main() {
  console.log('[HUD] hybrid replacer active');

  // 1) Одразу — для поточного DOM
  sweepDOM();
  patchStylesheets();

  // 2) При зміні DOM (SPA-сторінки/додавання елементів)
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) {
            sweepDOM(n);
          }
        });
      } else if (m.type === 'attributes') {
        if (m.attributeName === 'src' && m.target.tagName === 'IMG') {
          replaceImgElement(m.target);
        } else if (m.attributeName === 'style') {
          replaceInlineStyle(m.target);
        } else if (m.attributeName === 'srcset') {
          replaceSrcset(m.target);
        }
      }
    }
  });

  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src', 'style', 'srcset']
  });

  // 3) Періодичний страховочний прохід (на випадок, якщо щось проскочило)
  setInterval(() => {
    try {
      sweepDOM();
      patchStylesheets();
    } catch {}
  }, 1500);
})();
