const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'hud-assets', 'assets');
const out = {};
for (const file of fs.readdirSync(dir)) {
  if (!file.toLowerCase().endsWith('.png')) continue;
  const data = fs.readFileSync(path.join(dir, file)).toString('base64');
  const key = path.parse(file).name;
  out[key] = `data:image/png;base64,${data}`;
}
const content = 'window.NewProjectHud = ' + JSON.stringify({weapon: out}, null, 2) + '\n';
fs.writeFileSync(path.join(__dirname, 'hud-data.js'), content);
