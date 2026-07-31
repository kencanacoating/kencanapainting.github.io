/* ===================================================================
   Kencana Painting — Shared Script
   Handles: mobile nav, scroll-reveal, footer year, project rendering
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNav();
  initReveal();
  initProjectPreview();   // runs only if #projectPreviewGrid exists (index.html)
  initProjectsPage();     // runs only if #projectGrid exists (projects.html)
});

function setYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function initNav(){
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }));
}

function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

/* Build a single project card's HTML */
function projectCardHTML(p){
  const photo = p.image
    ? `<img src="${p.image}" alt="${p.title} — ${p.category} in ${p.location}">`
    : `<span>Add project photo here</span>`;
  return `
    <div class="project-card" data-category="${p.category}">
      <div class="project-photo">${photo}</div>
      <div class="project-info">
        <span class="tag mono">${p.category} · ${p.year}</span>
        <h3>${p.title}</h3>
        <p>${p.location} — ${p.description}</p>
      </div>
    </div>`;
}

/* index.html: show a short preview of the most recent projects */
function initProjectPreview(){
  const grid = document.getElementById('projectPreviewGrid');
  if (!grid || typeof PROJECTS === 'undefined') return;
  const preview = PROJECTS.slice(0, 3);
  grid.innerHTML = preview.map(projectCardHTML).join('');
}

/* projects.html: full grid with category filtering */
function initProjectsPage(){
  const grid = document.getElementById('projectGrid');
  const filterBar = document.getElementById('filterBar');
  const countEl = document.getElementById('projectCount');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map(projectCardHTML).join('');

  const categories = ['All', ...new Set(PROJECTS.map(p => p.category))];
  if (filterBar){
    filterBar.innerHTML = categories.map((c, i) =>
      `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${c}">${c}</button>`
    ).join('');

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let visible = 0;
      grid.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'All' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) visible++;
      });
      if (countEl) countEl.textContent = `Showing ${visible} of ${PROJECTS.length} projects`;
    });
  }
  if (countEl) countEl.textContent = `Showing ${PROJECTS.length} of ${PROJECTS.length} projects`;
}
