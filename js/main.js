/* =========================================
   MAIN.JS — Nav, mobile menu, scroll reveals,
             hero role cycling, theme, card builder

   Runs on every page. Each block bails early if its
   markup isn't present, so it's safe to load anywhere.
   ========================================= */

/* Does the visitor want motion kept to a minimum? Re-read on demand so a
   mid-session OS change is picked up rather than baked in at load. */
var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
function prefersReducedMotion() { return motionQuery.matches; }

/* ---- Scroll-activated nav ---- */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Interior pages start scrolled; home starts transparent over the hero
  const isHome = document.querySelector('.hero') !== null;
  if (!isHome) return;

  let ticking = false;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNav);
  }, { passive: true });

  updateNav();
})();

/* ---- Mobile menu ---- */
(function initMobileMenu() {
  const toggle  = document.getElementById('nav-toggle');
  const overlay = document.getElementById('nav-overlay');
  const close   = document.getElementById('nav-overlay-close');

  if (!toggle || !overlay || !close) return;

  let lastFocused = null;

  /* Closed overlay is inert: hidden from the a11y tree and out of tab order.
     CSS visibility handles the tab order; aria-hidden handles the rest. */
  function setClosedState() {
    overlay.setAttribute('aria-hidden', 'true');
  }
  setClosedState();

  function focusables() {
    return Array.prototype.slice.call(
      overlay.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function openMenu() {
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';

    const items = focusables();
    if (items.length) items[0].focus();
  }

  function closeMenu(restoreFocus) {
    overlay.classList.remove('open');
    setClosedState();
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';

    if (restoreFocus !== false) {
      (lastFocused && lastFocused.focus ? lastFocused : toggle).focus();
    }
  }

  function isOpen() { return overlay.classList.contains('open'); }

  toggle.addEventListener('click', function() {
    isOpen() ? closeMenu() : openMenu();
  });

  close.addEventListener('click', function() { closeMenu(); });

  /* Navigating away closes the menu, but don't yank focus back to the
     hamburger — the browser is already moving to the destination. */
  overlay.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() { closeMenu(false); });
  });

  document.addEventListener('keydown', function(e) {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    /* Trap Tab inside the overlay — without this, focus walks off into the
       page behind the menu, which is invisible but still there. */
    if (e.key === 'Tab') {
      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last  = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ---- IntersectionObserver scroll reveals ---- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  /* No observer support, or motion is unwelcome: show everything at once. */
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

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

  /* A word swapping every 2.8s is decoration. Under reduced motion, settle
     on the full list as static text instead of animating forever. */
  if (prefersReducedMotion()) {
    el.textContent = roles.join(' · ');
    el.classList.add('is-static');
    return;
  }

  let current = 0;
  let timer = null;

  function cycleRole() {
    el.classList.remove('enter');
    el.classList.add('exit');

    setTimeout(function() {
      current = (current + 1) % roles.length;
      el.textContent = roles[current];
      el.classList.remove('exit');
      el.classList.add('enter');

      setTimeout(function() { el.classList.remove('enter'); }, 400);
    }, 350);
  }

  function start() {
    if (timer === null) timer = setInterval(cycleRole, 2800);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  /* Don't animate into a hidden tab — it burns cycles for nobody. */
  document.addEventListener('visibilitychange', function() {
    document.hidden ? stop() : start();
  });

  start();
})();

/* ---- Work section toggle (homepage only) ---- */
(function initWorkToggle() {
  var viewMed  = document.getElementById('view-medium');
  var viewRole = document.getElementById('view-role');
  var hint     = document.getElementById('work-view-hint');
  var buttons  = document.querySelectorAll('.view-toggle-btn');
  if (!viewMed || !viewRole || !buttons.length) return;

  var HINTS = {
    medium: 'Browse by the form the work takes — what it is.',
    role:   'Browse by what I did — how I was involved.',
  };

  function show(view) {
    var showMedium = view === 'medium';

    buttons.forEach(function(b) {
      var active = b.getAttribute('data-view') === view;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    setHidden(viewMed,  !showMedium);
    setHidden(viewRole,  showMedium);

    if (hint) hint.textContent = HINTS[view];
  }

  /* The hidden view stays composited (opacity/visibility, not display:none)
     so switching doesn't re-layout — but it must leave the a11y tree and the
     tab order, or its seven links stay reachable while invisible. */
  function setHidden(view, hidden) {
    view.classList.toggle('work-view--hidden', hidden);
    if (hidden) {
      view.setAttribute('aria-hidden', 'true');
      view.querySelectorAll('a').forEach(function(a) { a.setAttribute('tabindex', '-1'); });
    } else {
      view.removeAttribute('aria-hidden');
      view.querySelectorAll('a').forEach(function(a) { a.removeAttribute('tabindex'); });
    }
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      show(btn.getAttribute('data-view'));
    });
  });

  show('medium');
})();

/* ---- Theme toggle (light / dark) ---- */
(function initThemeToggle() {
  var buttons = document.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  var STORAGE_KEY = 'site-theme';
  var meta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);

    buttons.forEach(function(btn) {
      var icon = btn.querySelector('.theme-toggle-icon');
      var label = btn.querySelector('.theme-toggle-label');
      /* Show the destination, not the current state */
      if (icon)  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });

    /* Keep the mobile browser chrome in step with the page */
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAF8F5');

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
  }

  /* The inline head script already set data-theme to avoid a flash —
     read it back rather than deciding again. */
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark', false);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* Follow the OS while the visitor hasn't expressed a preference */
  var osQuery = window.matchMedia('(prefers-color-scheme: light)');
  osQuery.addEventListener('change', function(e) {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) {}
    if (!stored) applyTheme(e.matches ? 'light' : 'dark', false);
  });
})();

/* ---- Scrollspy: mark the section currently in view (homepage) ---- */
(function initScrollSpy() {
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  var sections = [];

  links.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (!section) return;
    byId[id] = link;
    sections.push(section);
  });

  if (!sections.length) return;

  function setCurrent(id) {
    links.forEach(function(link) { link.removeAttribute('aria-current'); });
    if (byId[id]) byId[id].setAttribute('aria-current', 'true');
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) setCurrent(entry.target.id);
    });
  }, {
    /* Trip when a section crosses the upper third of the viewport */
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  });

  sections.forEach(function(s) { observer.observe(s); });
})();

/* ---- Back to top ---- */
(function initBackToTop() {
  var btn = document.getElementById('to-top');
  if (!btn) return;

  var ticking = false;

  function update() {
    btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    /* Send focus somewhere sensible instead of leaving it on a button that
       just scrolled out of relevance */
    var main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
  });

  update();
})();

/* ---- Card builder (shared by home + work pages) ---- */
function buildCard(project, index) {
  var thumbContent = project.thumbnail
    ? '<img src="' + project.thumbnail + '" alt="" loading="lazy" decoding="async">'
    : '<div class="project-card-thumb-placeholder">No image</div>';

  var href = './projects.html?medium=' + encodeURIComponent(project.discipline) + '#' + project.id;

  return (
    '<a href="' + href + '" class="project-card" ' +
      'data-discipline="' + project.discipline + '">' +
      '<div class="project-card-thumb">' + thumbContent + '</div>' +
      '<div class="project-card-body">' +
        '<span class="tag" data-discipline="' + project.discipline + '">' + escapeHtml(categoryLabel(project.discipline, project.category)) + '</span>' +
        '<h3 class="project-card-title">' + escapeHtml(project.title) + '</h3>' +
        '<p class="project-card-desc">' + escapeHtml(project.description) + '</p>' +
        /* Link text alone reads as "View project" out of context — name the
           project for screen readers without repeating it visually */
        '<span class="project-card-link">View project<span class="sr-only"> — ' + escapeHtml(project.title) + '</span></span>' +
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
