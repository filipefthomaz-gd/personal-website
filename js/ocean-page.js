/* =========================================
   OCEAN-PAGE.JS
   Renders the Ocean module index + detail sections
   from data/ocean.js. Mirrors the discipline pages:
   sticky bar, pill nav, scroll-spy on the active module.
   ========================================= */

(function initOceanPage() {

  var main = document.getElementById('ocean-main');
  if (!main || typeof OCEAN_MODULES === 'undefined') return;

  /* ---- Render ---- */

  main.innerHTML =
    renderBar() +
    renderIntro() +
    renderGrid() +
    '<div class="module-sections">' + OCEAN_MODULES.map(renderSection).join('') + '</div>';

  setupScrollSpy();
  handleDeepLink();

  /* ---- Sticky bar + pill nav ---- */

  function renderBar() {
    var pills = OCEAN_MODULES.map(function(m) {
      return '<a href="#' + m.id + '" class="pill-nav-item" data-module="' + m.id + '">' + esc(m.name) + '</a>';
    }).join('');

    return (
      '<div class="ocean-sticky-bar" id="ocean-bar">' +
        '<div class="discipline-bar-top">' +
          '<a href="./projects.html#ocean" class="discipline-back-link">' +
            '<span aria-hidden="true">←</span> All projects' +
          '</a>' +
          '<span class="discipline-bar-divider" aria-hidden="true">/</span>' +
          '<span class="discipline-bar-name">Ocean</span>' +
        '</div>' +
        '<nav class="pill-nav" id="ocean-pills" aria-label="Jump to module">' + pills + '</nav>' +
      '</div>'
    );
  }

  /* ---- Intro ---- */

  function renderIntro() {
    return (
      '<header class="ocean-intro">' +
        '<div class="ocean-intro-inner">' +
          '<p class="ocean-intro-label">Unity Framework Suite</p>' +
          '<h1 class="ocean-intro-title">Ocean</h1>' +
          '<p class="ocean-intro-lead">' +
            'A suite of Unity libraries written in C#. Each module is independently usable, ' +
            'separately documented, and built to work alongside the others.' +
          '</p>' +
        '</div>' +
      '</header>'
    );
  }

  /* ---- Module grid (index) ---- */

  function renderGrid() {
    var cards = OCEAN_MODULES.map(function(m) {
      return (
        '<a href="#' + m.id + '" class="module-card" style="--module-accent: ' + m.accent + '">' +
          '<div class="module-card-top">' +
            '<span class="module-card-name">' + esc(m.name) + '</span>' +
            statusPill(m.status) +
          '</div>' +
          '<span class="module-card-text">' + esc(m.text) + '</span>' +
        '</a>'
      );
    }).join('');

    return '<div class="module-grid-wrap"><div class="module-grid">' + cards + '</div></div>';
  }

  /* ---- Module detail section ---- */

  function renderSection(m) {
    var features = m.features && m.features.length
      ? '<ul class="module-features">' + m.features.map(function(f) {
          return (
            '<li class="module-feature">' +
              '<span class="module-feature-title">' + esc(f.title) + '</span>' +
              '<span class="module-feature-detail">' + esc(f.detail) + '</span>' +
            '</li>'
          );
        }).join('') + '</ul>'
      : '';

    /* Documentation site, when the module has one */
    var docsLink = m.docs
      ? '<p class="module-project-link">' +
          '<a href="' + esc(m.docs) + '" target="_blank" rel="noopener">' + esc(m.name) + ' documentation ↗</a>' +
        '</p>'
      : '';

    /* Modules that have their own full entry link back to it */
    var projectLink = m.project
      ? '<p class="module-project-link">' +
          '<a href="./projects.html#' + m.project + '">Full project entry for ' + esc(m.name) + ' →</a>' +
        '</p>'
      : '';

    return (
      '<section class="module-section" id="' + m.id + '" style="--module-accent: ' + m.accent + '" aria-label="' + esc(m.name) + '">' +
        '<div class="module-section-inner">' +
          '<div class="module-section-head">' +
            '<h2 class="module-section-title">' + esc(m.name) + '</h2>' +
            statusPill(m.status) +
          '</div>' +
          '<p class="module-section-text">' + esc(m.text) + '</p>' +
          '<p class="module-section-tagline">' + esc(m.tagline) + '</p>' +
          features +
          docsLink +
          projectLink +
        '</div>' +
      '</section>'
    );
  }

  function statusPill(status) {
    var mod = status === 'Stable' ? ' module-status--stable' : ' module-status--wip';
    return '<span class="module-status' + mod + '">' + esc(status) + '</span>';
  }

  /* ---- Scroll spy: highlight the pill for the module in view ---- */

  function setupScrollSpy() {
    if (!('IntersectionObserver' in window)) return;

    var pills = {};
    main.querySelectorAll('.pill-nav-item').forEach(function(p) {
      pills[p.getAttribute('data-module')] = p;
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        Object.keys(pills).forEach(function(k) {
          pills[k].classList.toggle('is-active', k === entry.target.id);
        });
        pills[entry.target.id].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

    main.querySelectorAll('.module-section').forEach(function(s) { observer.observe(s); });
  }

  /* ---- Deep link: ocean.html#hydra should land on the section ---- */

  function handleDeepLink() {
    if (!window.location.hash) return;
    var target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    /* Defer so the sticky bar has its final height before we measure */
    requestAnimationFrame(function() {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
