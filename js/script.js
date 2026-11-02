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

  // 3. Dynamic project portfolio, search, category filter and sorting.
  const projectGrid = document.querySelector('#dynamic-projects');
  if (projectGrid) {
    const search = document.querySelector('#project-search');
    const filter = document.querySelector('#project-filter');
    const sort = document.querySelector('#project-sort');
    let projects = [];
    const render = () => {
      const term = (search?.value || '').trim().toLowerCase();
      const category = filter?.value || 'all';
      let shown = projects.filter(p => (category === 'all' || p.category === category) &&
        `${p.title} ${p.category} ${p.description}`.toLowerCase().includes(term));
      if (sort?.value === 'az') shown.sort((a,b) => a.title.localeCompare(b.title));
      if (sort?.value === 'za') shown.sort((a,b) => b.title.localeCompare(a.title));
      projectGrid.replaceChildren();
      if (!shown.length) { projectGrid.innerHTML = '<p class="form-note">No matching projects were found. Try another search or category.</p>'; return; }
      shown.forEach(p => {
        const card = document.createElement('article'); card.className = 'card project-card';
        const img = document.createElement('img'); img.className = 'card-image lightbox-trigger';
        img.src = p.image; img.alt = p.alt; img.loading = 'lazy'; img.tabIndex = 0;
        img.dataset.full = p.image; img.dataset.caption = p.title;
        const body = document.createElement('div'); body.className = 'card-body';
        const tag = document.createElement('p'); tag.className = 'eyebrow dark'; tag.textContent = p.category;
        const title = document.createElement('h3'); title.textContent = p.title;
        const desc = document.createElement('p'); desc.textContent = p.description;
        const link = document.createElement('a'); link.className = 'btn btn-primary'; link.href = `enquiry.html?service=${encodeURIComponent(p.category)}`; link.textContent = 'Discuss a Similar Project';
        body.append(tag,title,desc,link); card.append(img,body); projectGrid.append(card);
      });
    };
    fetch('data/projects.json').then(r => { if (!r.ok) throw new Error('Project data could not be loaded'); return r.json(); })
      .then(data => { projects = data; render(); })
      .catch(() => { projectGrid.innerHTML = '<p class="form-note">Project examples could not load. Please run this website using a local web server such as VS Code Live Server.</p>'; });
    [search,filter,sort].filter(Boolean).forEach(el => el.addEventListener('input', render));
  }

