document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile navigation toggle
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.header-inner');
  if (nav && header && !header.querySelector('.nav-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle'; toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.textContent = 'Menu'; header.insertBefore(toggle, nav);
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('nav-open', open);
    });
  }

    // 2. Accessible FAQ accordion.
  document.querySelectorAll('[data-accordion] button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
