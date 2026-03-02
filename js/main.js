/* =========================================
   MAIN.JS — Nav, mobile menu, scroll reveals,
             hero role cycling, featured grid
   ========================================= */

/* ---- Scroll-activated nav ---- */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // work.html + blog.html start scrolled; home starts transparent
  const isHome = document.querySelector('.hero') !== null;

  function updateNav() {
    if (!isHome || window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (isHome) {
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }
})();

/* ---- Mobile menu ---- */
(function initMobileMenu() {
  const toggle  = document.getElementById('nav-toggle');
  const overlay = document.getElementById('nav-overlay');
  const close   = document.getElementById('nav-overlay-close');

  if (!toggle || !overlay || !close) return;

  function openMenu() {
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);

  // Close when clicking a nav link inside overlay
  overlay.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
})();

/* ---- IntersectionObserver scroll reveals ---- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(function(el) { observer.observe(el); });
})();

/* ---- Hero role cycling ---- */
(function initRoleCycling() {
  const el = document.getElementById('hero-role-text');
  if (!el) return;

  const roles = [
    'Designer',
    'Creative',
    'Developer',
    'Engineer',
    'Writer',
    'Musician',
  ];

  let current = 0;

  function cycleRole() {
    // Exit animation
    el.classList.remove('enter');
    el.classList.add('exit');

    setTimeout(function() {
      current = (current + 1) % roles.length;
      el.textContent = roles[current];
      el.classList.remove('exit');
      el.classList.add('enter');

      // Clean up enter class after animation
      setTimeout(function() {
        el.classList.remove('enter');
      }, 400);
    }, 350);
  }

  setInterval(cycleRole, 2800);
})();

/* ---- Featured Work grid (homepage only) ---- */
(function initFeaturedGrid() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  // PROJECTS is defined in data/work.js (loaded before this script)
  if (typeof PROJECTS === 'undefined') return;

  const featured = PROJECTS.filter(function(p) { return p.featured; }).slice(0, 4);

  if (!featured.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.875rem;">No featured projects yet.</p>';
    return;
  }

  grid.innerHTML = featured.map(function(p, i) {
    return buildCard(p, i);
  }).join('');
})();

/* ---- Card builder (shared by home + work pages) ---- */
function buildCard(project, index) {
  var thumbContent = project.thumbnail
    ? '<img src="' + project.thumbnail + '" alt="' + escapeHtml(project.title) + '" loading="lazy">'
    : '<div class="project-card-thumb-placeholder">No image</div>';

  /* Featured cards always link to the discipline page + anchor,
     so clicking from the homepage deep-links to the right section. */
  var disciplineHref = './work/' + project.discipline + '.html#' + project.id;
  var linkAttr = 'href="' + disciplineHref + '"';

  return (
    '<a ' + linkAttr + ' class="project-card" ' +
      'data-discipline="' + project.discipline + '" ' +
      'aria-label="' + escapeHtml(project.title) + ', ' + project.discipline + '">' +
      '<div class="project-card-thumb">' + thumbContent + '</div>' +
      '<div class="project-card-body">' +
        '<span class="tag" data-discipline="' + project.discipline + '">' + escapeHtml(categoryLabel(project.discipline, project.category)) + '</span>' +
        '<h3 class="project-card-title">' + escapeHtml(project.title) + '</h3>' +
        '<p class="project-card-desc">' + escapeHtml(project.description) + '</p>' +
        '<span class="project-card-link">View project <span class="arrow">→</span></span>' +
      '</div>' +
    '</a>'
  );
}

/* Discipline → human-readable label */
function categoryLabel(discipline, category) {
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

/* Simple HTML escape */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
