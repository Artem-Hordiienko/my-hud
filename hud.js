(() => {
  const badge = document.createElement('div');
  badge.id = 'myhud-badge';
  badge.textContent = 'My HUD from GitHub ✓';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(badge));
})();
