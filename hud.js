// === HUD replacer with programmatic loads interception ===

// ВАЖЛИВО: у репо файли в hud-assets/assets/*
const BASE = "https://raw.githubusercontent.com/Artem-Hordiienko/my-hud/main/hud-assets/assets/";
const DEBUG = false;

// За потреби — мапа перейменувань
const NAME_MAP = {
  // "health.png": "0.png",
};

// ---------- helpers ----------
function log(...a){ if(DEBUG) console.log("[HUD]", ...a); }
function isHttpLike(u){ return /^https?:\/\//i.test(u); }
function isData(u){ return /^data:/i.test(u); }
function looksLocal(u){
  if (!u) return false;
  if (isHttpLike(u) || isData(u)) return false;
  // все, що схоже на локальні ассети
  return /(^|\/)(assets|images|uiresources)\/.+\.(png|jpe?g|svg|webp|gif|ico)$/i.test(u);
}
function stripToAssetPath(u){
  return u.replace(/\\/g,'/')
          .replace(/^.*?(assets\/)/i, 'assets/')
          .replace(/^.*?(images\/)/i, 'images/')
          .replace(/^.*?(uiresources\/)/i, 'uiresources/');
}
function fileName(p){
  const m = p.match(/([^\/]+)$/); return m?m[1]:p;
}
function toRemote(u){
  let p = stripToAssetPath(u);
  // якщо було "images/...", теж кладемо в BASE + images/...
  // головне — щоб всередині репо структура співпала
  const name = fileName(p);
  if (NAME_MAP[name]) p = p.replace(/[^\/]+$/, NAME_MAP[name]);
  // у твоєму репо картинки лежать в hud-assets/assets/*
  // тому все що не починається з 'assets/' — зводимо до 'assets/<name>'
  if (!/^assets\//i.test(p)) p = "assets/" + name;
  const url = BASE + p.replace(/^assets\//i, ""); // BASE вже всередині 'assets/'
  return url;
}
function rewrite(u){
  if (!u) return u;
  if (looksLocal(u)) {
    const r = toRemote(u);
    log("rewrite:", u, "=>", r);
    return r;
  }
  return u;
}

// ---------- DOM replacements ----------
function replaceImgElement(img){
  const s = img.getAttribute('src');
  if (s && looksLocal(s)) {
    img.addEventListener('error', ()=>console.warn("[HUD] img 404:", img.src), {once:true});
    img.setAttribute('src', rewrite(s));
  }
}
function replaceSrcset(el){
  const set = el.getAttribute('srcset');
  if (!set) return;
  const out = set.split(',').map(x=>x.trim()).map(part=>{
    const m = part.match(/^(\S+)(\s+\S+)?$/);
    if (!m) return part;
    const url = m[1], d = m[2]||"";
    return looksLocal(url) ? (rewrite(url)+d) : part;
  }).join(', ');
  if (out !== set) el.setAttribute('srcset', out);
}
function replaceInlineStyle(el){
  const st = el.getAttribute('style')||"";
  if (!/url\(/i.test(st)) return;
  const out = st.replace(/url\(["']?(.*?)["']?\)/gi, (all,url)=>{
    return looksLocal(url) ? `url("${rewrite(url)}")` : all;
  });
  if (out !== st) el.setAttribute('style', out);
}
function patchStylesheets(){
  for (const sheet of Array.from(document.styleSheets)){
    let rules; try{ rules = sheet.cssRules; }catch{ continue; }
    if (!rules) continue;
    for (const rule of Array.from(rules)){
      if (!rule.style || !rule.style.cssText) continue;
      const txt = rule.style.cssText;
      if (txt.includes('url(')){
        const patched = txt.replace(/url\(["']?(.*?)["']?\)/gi, (all,url)=>{
          return looksLocal(url) ? `url("${rewrite(url)}")` : all;
        });
        if (patched !== txt) { try{ rule.style.cssText = patched; }catch{} }
      }
    }
  }
}
function sweep(root=document){
  root.querySelectorAll('img[src]').forEach(replaceImgElement);
  root.querySelectorAll('[srcset]').forEach(replaceSrcset);
  root.querySelectorAll('[style*="url("]').forEach(replaceInlineStyle);
}

// ---------- Programmatic loads interception ----------
(function interceptImages(){
  // 1) setter для src (працює і для <img>, і для new Image())
  const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (desc && desc.set){
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      get(){ return desc.get.call(this); },
      set(v){ try{ v = rewrite(v); }catch{} desc.set.call(this, v); }
    });
    log("hooked HTMLImageElement.src");
  }

  // 2) setAttribute('src'/'srcset')
  const _setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value){
    try{
      if (typeof value === 'string'){
        if (name === 'src' && this instanceof HTMLImageElement) value = rewrite(value);
        else if (name === 'srcset') {
          value = value.split(',').map(x=>x.trim()).map(part=>{
            const m = part.match(/^(\S+)(\s+\S+)?$/);
            if (!m) return part;
            const url = m[1], d = m[2]||"";
            return looksLocal(url) ? (rewrite(url)+d) : part;
          }).join(', ');
        } else if (name === 'style' && /url\(/i.test(value)){
          value = value.replace(/url\(["']?(.*?)["']?\)/gi, (all,url)=>{
            return looksLocal(url) ? `url("${rewrite(url)}")` : all;
          });
        }
      }
    }catch{}
    return _setAttr.call(this, name, value);
  };

  // 3) fetch
  const _fetch = window.fetch;
  window.fetch = function(input, init){
    try{
      if (typeof input === 'string' && looksLocal(input)) input = rewrite(input);
      else if (input && input.url && looksLocal(input.url)) input = new Request(rewrite(input.url), input);
    }catch{}
    return _fetch.call(this, input, init);
  };

  // 4) XHR
  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest){
    try{ if (typeof url === 'string' && looksLocal(url)) url = rewrite(url); }catch{}
    return _open.call(this, method, url, ...rest);
  };
})();

// ---------- boot ----------
(function main(){
  console.log("[HUD] hybrid/programmatic replacer active");

  // Перший прохід
  try { sweep(); patchStylesheets(); } catch(e){ log(e); }

  // Спостерігач за DOM
  const mo = new MutationObserver(muts=>{
    for (const m of muts){
      if (m.type === 'childList'){
        m.addedNodes.forEach(n=>{
          if (n.nodeType === 1){ sweep(n); }
        });
      } else if (m.type === 'attributes'){
        if (m.attributeName === 'style') replaceInlineStyle(m.target);
        else if (m.attributeName === 'srcset') replaceSrcset(m.target);
      }
    }
  });
  mo.observe(document.documentElement, {
    subtree:true, childList:true, attributes:true, attributeFilter:['style','srcset']
  });

  // Періодичний страховочний прохід
  setInterval(()=>{ try{ sweep(); patchStylesheets(); }catch{} }, 1500);
})();
