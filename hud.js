<script>
/**
 * ============================
 *  1) БАЗА АСЕТІВ (ШАБЛОН)
 * ============================
 * Вставляй СВОЇ base64 (з префіксом data:image/png;base64, …)
 * Залишив плейсхолдери типу DATA('weapon/0') – заміни їх на реальні рядки.
 * Формат і ключі — як у твоєму файлі (weapon/logo/icons/speedometer).
 */

window.NewProjectHud = {
  weapon: {
    "0":  "DATA('weapon/0')",
    "1":  "DATA('weapon/1')",
    "2":  "DATA('weapon/2')",
    "3":  "DATA('weapon/3')",
    "4":  "DATA('weapon/4')",
    "5":  "DATA('weapon/5')",
    "6":  "DATA('weapon/6')",
    "7":  "DATA('weapon/7')",
    "8":  "DATA('weapon/8')",
    "9":  "DATA('weapon/9')",
    "10": "DATA('weapon/10')",
    "11": "DATA('weapon/11')",
    "12": "DATA('weapon/12')",
    "13": "DATA('weapon/13')",
    "14": "DATA('weapon/14')",
    "15": "DATA('weapon/15')",
    "16": "DATA('weapon/16')",
    "17": "DATA('weapon/17')",
    "18": "DATA('weapon/18')",
    "19": "DATA('weapon/19')",
    "22": "DATA('weapon/22')",
    "23": "DATA('weapon/23')",
    "24": "DATA('weapon/24')",
    "25": "DATA('weapon/25')",
    "26": "DATA('weapon/26')",
    "27": "DATA('weapon/27')",
    "28": "DATA('weapon/28')",
    "29": "DATA('weapon/29')",
    "30": "DATA('weapon/30')",
    "31": "DATA('weapon/31')",
    "32": "DATA('weapon/32')",
    "33": "DATA('weapon/33')",
    "34": "DATA('weapon/34')",
    "35": "DATA('weapon/35')",
    "36": "DATA('weapon/36')",
    "37": "DATA('weapon/37')",
    "38": "DATA('weapon/38')",
    "39": "DATA('weapon/39')",
    "40": "DATA('weapon/40')",
    "41": "DATA('weapon/41')",
    "42": "DATA('weapon/42')",
    "43": "DATA('weapon/43')",
    "44": "DATA('weapon/44')",
    "46": "DATA('weapon/46')"
  },

  logo: {
    "1":  "DATA('logo/1')",
    "2":  "DATA('logo/2')",
    "3":  "DATA('logo/3')",
    "4":  "DATA('logo/4')",
    "5":  "DATA('logo/5')",
    "6":  "DATA('logo/6')",
    "7":  "DATA('logo/7')",
    "8":  "DATA('logo/8')",
    "9":  "DATA('logo/9')",
    "10": "DATA('logo/10')",
    "11": "DATA('logo/11')",
    "12": "DATA('logo/12')",
    "13": "DATA('logo/13')",
    "14": "DATA('logo/14')",
    "15": "DATA('logo/15')",
    "16": "DATA('logo/16')",
    "17": "DATA('logo/17')",
    "18": "DATA('logo/18')",
    "19": "DATA('logo/19')",
    "20": "DATA('logo/20')",
    "21": "DATA('logo/21')",
    "22": "DATA('logo/22')",
    "23": "DATA('logo/23')",
    "24": "DATA('logo/24')",
    "25": "DATA('logo/25')"
  },

  icons: {
    "active_wanted":   "DATA('icons/active_wanted')",
    "armour":          "DATA('icons/armour')",
    "breath":          "DATA('icons/breath')",
    "cash":            "DATA('icons/cash')",
    "circle":          "DATA('icons/circle')",
    "health":          "DATA('icons/health')",
    "hunger":          "DATA('icons/hunger')",
    "inactive_wanted": "DATA('icons/inactive_wanted')",
    "radar":           "DATA('icons/radar')",
    "wanted_back":     "DATA('icons/wanted_back')",
    "weapon_back":     "DATA('icons/weapon_back')",
    "zone":            "DATA('icons/zone')"
  },

  speedometer: {
    "main":      "DATA('speedometer/main')",
    "secondary": "DATA('speedometer/secondary')"
  }
};

/**
 * ====================================
 *  2) АПЛІЄР ПІДМІНИ (з DOM-спостерігачем)
 * ====================================
 * Логіка:
 *  - на старті й при будь-яких мутаціях шукаємо:
 *      <img src=".../assets/.../NAME.png">  → підміняємо на data:
 *      background-image: url(assets/.../NAME.png) → підміняємо на data:
 *  - визначення категорії:
 *      з path (weapon|logo|icons|speedometer) або підбором по імені.
 */

(function () {
  const HUD = window.NewProjectHud || {};
  const FLAT = new Map(); // "weapon:1" → "data:..."
  const KEYONLY = new Map(); // "1" → data (останній виграшний), "health" → data

  // Розплющуємо об’єкт у зручні для пошуку мапи
  for (const cat of Object.keys(HUD)) {
    const bucket = HUD[cat] || {};
    for (const [k, v] of Object.entries(bucket)) {
      if (!v || typeof v !== 'string' || !v.startsWith('data:image')) continue;
      FLAT.set(`${cat}:${k}`, v);
      // На випадок коли у шляху немає назви категорії
      if (!KEYONLY.has(k)) KEYONLY.set(k, v);
    }
  }

  const RE_FILENAME = /([^\/\\?#]+)\.(png|jpg|jpeg|webp|svg)(?:[?#].*)?$/i;

  function baseNameFromPath(p) {
    const m = String(p||'').match(RE_FILENAME);
    return m ? m[1].toLowerCase() : '';
  }

  function resolveAsset(pathOrName) {
    const name = baseNameFromPath(pathOrName) || String(pathOrName||'').toLowerCase();

    // 1) спроба по категорії з шляху
    const lower = String(pathOrName||'').toLowerCase();
    let cat = '';
    if (lower.includes('/weapon/') || lower.includes('\\weapon\\')) cat = 'weapon';
    else if (lower.includes('/logo/') || lower.includes('\\logo\\')) cat = 'logo';
    else if (lower.includes('/icons/') || lower.includes('\\icons\\')) cat = 'icons';
    else if (lower.includes('/speedometer/') || lower.includes('\\speedometer\\')) cat = 'speedometer';

    if (cat) {
      const key = name; // у твоєму наборі weapon/logo — це числа як рядки; icons — імена
      const direct = FLAT.get(`${cat}:${key}`);
      if (direct) return direct;
    }
    // 2) без категорії — просто по імені
    if (KEYONLY.has(name)) return KEYONLY.get(name);

    // 3) спец-кейс: weapon_12 → 12, logo-05 → 5, icon-health → health
    const numMatch = name.match(/(\d{1,3})$/);
    if (numMatch) {
      const n = numMatch[1];
      for (const c of ['weapon','logo']) {
        const d = FLAT.get(`${c}:${n}`);
        if (d) return d;
      }
    }
    return null;
  }

  function replaceImg(img) {
    if (!img || img.dataset.hudApplied === '1') return;
    const src = img.getAttribute('src') || '';
    const data = resolveAsset(src);
    if (data) {
      img.setAttribute('src', data);
      img.removeAttribute('srcset');
      img.dataset.hudApplied = '1';
    }
  }

  function replaceBg(el) {
    if (!el || el.dataset.hudBgApplied === '1') return;
    const style = getComputedStyle(el);
    const bg = style && style.backgroundImage || '';
    const m = bg.match(/url\((['"]?)([^'")]+)\1\)/i);
    if (!m) return;
    const url = m[2];
    const data = resolveAsset(url);
    if (data) {
      el.style.backgroundImage = `url("${data}")`;
      el.dataset.hudBgApplied = '1';
    }
  }

  function scanOnce(root) {
    root = root || document;
    // img
    root.querySelectorAll('img[src]').forEach(replaceImg);
    // елементи з background-image
    root.querySelectorAll('*').forEach(replaceBg);
  }

  function observe() {
    const mo = new MutationObserver(list => {
      for (const m of list) {
        if (m.type === 'attributes') {
          if (m.target.tagName === 'IMG' && m.attributeName === 'src') {
            replaceImg(m.target);
          } else if (m.attributeName === 'style' || m.attributeName === 'class') {
            replaceBg(m.target);
          }
        } else if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) scanOnce(n);
          });
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src','style','class']
    });
  }

  // Невеличкий shim проти суворих CSP/полифілів (деякі UI міняють navigator.platform)
  try {
    Object.defineProperty(navigator, 'platform', { configurable: true, get() { return navigator?.platform || 'Win32'; }});
  } catch {}

  document.addEventListener('DOMContentLoaded', () => {
    console.log('[HUD] compat shim active');
    scanOnce(document);
    observe();
  });
})();
</script>
