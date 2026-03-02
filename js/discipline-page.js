/* =========================================
   DISCIPLINE-PAGE.JS
   Reads window.DISCIPLINE, filters PROJECTS,
   renders sticky bar + scrollable sections.
   Highlights active pill via IntersectionObserver.
   Handles deep-link via location.hash.
   ========================================= */

(function initDisciplinePage() {

  var main = document.getElementById('discipline-main');
  if (!main) return;

  var discipline = window.DISCIPLINE;
  if (!discipline || typeof PROJECTS === 'undefined') return;

  /* ---- Config ---- */
  var DISCIPLINES = {
    screen: {
      label: 'Screen',
      color: 'var(--screen)',
      colorHex: '#7C3AED',
      subLabel: 'Games · Animation',
      linkLabel: 'View',
    },
    stage: {
      label: 'Stage',
      color: 'var(--stage)',
      colorHex: '#DC2626',
      subLabel: 'Theatre · Musicals',
      linkLabel: 'View',
      intro: `
        <p>My relationship with theatre began while in college, when my family and I started attending
        <strong>Estrela Hall</strong>, home of <strong>The Lisbon Players</strong> — a local
        English-speaking theatre company in Lisbon.</p>

        <p>I wrote my first play, <em>Leonor</em>, in 2012 — in Portuguese, mostly in verse. It was
        halted for four years and completed in 2016. I later wrote a short play and a collection of
        scenes in English, <em>Tiny Theatrical Scenes</em>.</p>

        <p>In 2016, The Lisbon Players ran a Lighting Design workshop which I attended. I went on to
        become their <strong>resident lighting designer</strong>, actively involved in
        <strong>12 productions over two and a half years</strong> — not only as a lighting designer,
        but also as an actor, singer, director, rehearsal pianist, writer, and composer.</p>

        <p>Over a hundred rehearsals with directors working everything from Shakespeare and Ibsen to
        original premieres. That period culminated with me directing my own original musical opera —
        <a href="#freedom-again">Freedom Again</a>.</p>
      `,
      introImage: '../assets/images/disciplines/intro_stage.jpg',
    },
    print: {
      label: 'Print',
      color: 'var(--print)',
      colorHex: '#D97706',
      subLabel: 'Writing',
      linkLabel: 'Read',
    },
    music: {
      label: 'Music',
      color: 'var(--music)',
      colorHex: '#0EA5E9',
      subLabel: 'Compositions',
      linkLabel: 'Listen',
    },
    worldbuilding: {
      label: 'Worldbuilding',
      color: 'var(--worldbuilding)',
      colorHex: '#059669',
      subLabel: 'Lore · Maps · Languages',
      linkLabel: 'Explore',
    },
    tech: {
      label: 'Tech',
      color: 'var(--tech)',
      colorHex: '#FF3E00',
      subLabel: 'Design · Development · Engineering',
      linkLabel: 'View',
    },
  };

  var config = DISCIPLINES[discipline];
  if (!config) return;

  var projects = PROJECTS.filter(function(p) { return p.discipline === discipline; });

  /* ---- Update page title ---- */
  document.title = config.label + ' — Work — Filipe Thomaz';

  /* Set discipline color as CSS custom property on <main> */
  main.style.setProperty('--discipline-color', config.color);

  /* ---- Render ---- */
  if (!projects.length) {
    main.innerHTML = renderEmptyState(config);
    return;
  }

  main.innerHTML = renderStickyBar(config, projects) +
    (config.intro ? renderIntro(config) : '') +
    renderSections(config, projects);

  /* ---- Set up IntersectionObserver for pill active state ---- */
  setupObserver(projects);

  /* ---- Handle deep-link hash on load ---- */
  handleHash();

})();

/* =========================================
   RENDER FUNCTIONS
   ========================================= */

function renderStickyBar(config, projects) {
  var pills = projects.map(function(p) {
    return (
      '<a href="#' + p.id + '" class="pill-nav-item" data-pill="' + p.id + '">' +
        truncate(p.title, 28) +
      '</a>'
    );
  }).join('');

  return (
    '<div class="discipline-sticky-bar" id="discipline-sticky-bar">' +
      '<div class="discipline-bar-top">' +
        '<a href="../work.html" class="discipline-back-link">← Work</a>' +
        '<div class="discipline-bar-divider" aria-hidden="true"></div>' +
        '<span class="discipline-bar-name">' + config.label + '</span>' +
      '</div>' +
      '<div class="pill-nav" id="pill-nav" role="navigation" aria-label="Jump to project">' +
        pills +
      '</div>' +
    '</div>'
  );
}

function renderSections(config, projects) {
  var sections = projects.map(function(p, i) {
    var number = String(i + 1).padStart(2, '0');
    var hasContent = p.content && p.content.trim();
    var hasUrl = p.url && p.url !== '#';

    var externalBtn = hasUrl
      ? '<a href="' + p.url + '" class="project-external-link" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(config.linkLabel) + ': ' + escapeHtml(p.title) + '">' +
          escapeHtml(config.linkLabel) + ' <span class="arrow" aria-hidden="true">↗</span>' +
        '</a>'
      : '';

    var body = hasContent
      ? '<div class="project-section-body">' + p.content + '</div>'
      : (p.description
          ? '<p class="project-section-description">' + escapeHtml(p.description) + '</p>'
          : '');

    var catLabel = getCategoryLabel(p.discipline, p.category);

    return (
      '<section class="project-section" id="' + p.id + '" aria-label="' + escapeHtml(p.title) + '">' +
        '<div class="project-section-inner">' +
          '<div class="project-section-eyebrow">' +
            '<span class="project-section-number" aria-hidden="true">' + number + '</span>' +
            '<span class="tag" data-discipline="' + p.discipline + '">' + escapeHtml(catLabel) + '</span>' +
          '</div>' +
          '<div class="project-section-title-row">' +
            '<h2 class="project-section-title">' + escapeHtml(p.title) + '</h2>' +
            externalBtn +
          '</div>' +
          body +
        '</div>' +
      '</section>'
    );
  }).join('');

  return '<div class="project-sections">' + sections + '</div>';
}

function renderIntro(config) {
  var image = config.introImage
    ? '<div class="discipline-intro-image"><img src="' + config.introImage + '" alt="" loading="lazy"></div>'
    : '';
  return (
    '<div class="discipline-intro">' +
      image +
      '<div class="discipline-intro-inner">' +
        '<span class="discipline-intro-label">' + escapeHtml(config.label) + '</span>' +
        '<div class="discipline-intro-body">' + config.intro + '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderEmptyState(config) {
  return (
    '<div class="discipline-sticky-bar" id="discipline-sticky-bar">' +
      '<div class="discipline-bar-top">' +
        '<a href="../work.html" class="discipline-back-link">← Work</a>' +
        '<div class="discipline-bar-divider" aria-hidden="true"></div>' +
        '<span class="discipline-bar-name">' + config.label + '</span>' +
      '</div>' +
    '</div>' +
    '<p class="discipline-empty">Nothing here yet — check back soon.</p>'
  );
}

/* =========================================
   INTERSECTION OBSERVER — active pill
   ========================================= */

function setupObserver(projects) {
  var stickyBar = document.getElementById('discipline-sticky-bar');
  var stickyHeight = stickyBar ? stickyBar.offsetHeight : 72;
  var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;

  var rootMarginTop = '-' + (navHeight + stickyHeight) + 'px';

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setActivePill(entry.target.id);
      }
    });
  }, {
    rootMargin: rootMarginTop + ' 0px -60% 0px',
    threshold: 0,
  });

  projects.forEach(function(p) {
    var section = document.getElementById(p.id);
    if (section) observer.observe(section);
  });
}

function setActivePill(id) {
  var pillNav = document.getElementById('pill-nav');
  if (!pillNav) return;

  pillNav.querySelectorAll('.pill-nav-item').forEach(function(pill) {
    var isActive = pill.getAttribute('data-pill') === id;
    pill.classList.toggle('active', isActive);

    /* Scroll the active pill into view within the pill nav */
    if (isActive) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

/* =========================================
   DEEP-LINK HASH HANDLING
   ========================================= */

function handleHash() {
  if (!location.hash) return;

  var id = location.hash.slice(1);
  /* Wait for DOM + sticky bar to render, then scroll */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* =========================================
   HELPERS
   ========================================= */

function getCategoryLabel(discipline, category) {
  var map = {
    screen: { games: 'Games', animation: 'Animation' },
    stage:  { theatre: 'Theatre', musicals: 'Musicals' },
    print:  { writing: 'Writing' },
    music:  { compositions: 'Compositions' },
    worldbuilding: { lore: 'Lore', maps: 'Maps', languages: 'Languages' },
    tech:   { design: 'Design', development: 'Development', engineering: 'Engineering' },
  };
  return (map[discipline] && map[discipline][category]) ? map[discipline][category] : category;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
