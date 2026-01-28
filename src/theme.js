(function () {
  const darkColors = [
    '#2C3E50',
    '#34495E',
    '#2C3A47',
    '#3D3D3D',
    '#2D3436',
    '#2F3640',
    '#353B48',
    '#2F3542',
    '#2C3A47',
    '#2D3436',
  ];

  // Lively light-mode palette
  const lightColors = [
    '#E3F2FD',
    '#E8F5E9',
    '#FFF3E0',
    '#F3E5F5',
    '#E0F7FA',
    '#FCE4EC',
    '#E8EAF6',
    '#F1F8E9',
    '#E0F2F1',
    '#FFF8E1',
  ];

  function getRandomColor() {
    const isLightMode = document.body.getAttribute('data-theme') === 'light';
    const colors = isLightMode ? lightColors : darkColors;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function setToggleIcon(isLight) {
    const icon = document.querySelector('.theme-toggle i');
    if (!icon) return;
    if (isLight) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.setAttribute('data-theme', 'light');
      setToggleIcon(true);
      return;
    }

    if (savedTheme === 'dark') {
      document.body.removeAttribute('data-theme');
      setToggleIcon(false);
      return;
    }

    // Use device preference if no saved theme
    const prefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) {
      document.body.setAttribute('data-theme', 'light');
      setToggleIcon(true);
    } else {
      document.body.removeAttribute('data-theme');
      setToggleIcon(false);
    }
  }

  function initTheme() {
    applyInitialTheme();
    document.body.style.background = getRandomColor();
  }

  function toggleTheme() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setToggleIcon(false);
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setToggleIcon(true);
    }
    document.body.style.background = getRandomColor();
  }

  // Expose for inline onclick handlers
  window.toggleTheme = toggleTheme;

  document.addEventListener('DOMContentLoaded', initTheme);
})();

