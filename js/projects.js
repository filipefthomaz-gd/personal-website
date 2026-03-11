/* =========================================
   PROJECTS.JS
   All-projects page: medium + role filter,
   URL param sync, accent colour shift.

   Performance: sections are rendered ONCE to DOM.
   Filtering only toggles `hidden` — no innerHTML writes.
   ========================================= */

(function initProjectsPage() {

  var main = document.getElementById('projects-main');
  if (!main || typeof PROJECTS === 'undefined') return;

  /* ---- Config ---- */
  var MEDIUMS = [
    { slug: '',              label: 'All',     color: 'var(--accent)' },
    { slug: 'screen',        label: 'Screen',  color: 'var(--screen)' },
    { slug: 'stage',         label: 'Stage',   color: 'var(--stage)' },
    { slug: 'print',         label: 'Writing', color: 'var(--print)' },
    { slug: 'music',         label: 'Music',   color: 'var(--music)' },
    { slug: 'visual',        label: 'Visual',  color: 'var(--visual)' },
    { slug: 'tech',          label: 'Tech',    color: 'var(--tech)' },
    { slug: 'worldbuilding', label: 'Worlds',  color: 'var(--worldbuilding)' },
  ];

  var MEDIUM_LABELS = {};
  MEDIUMS.forEach(function(m) { if (m.slug) MEDIUM_LABELS[m.slug] = m.label; });

  var MEDIUM_LINK_LABELS = {
    screen: 'View', stage: 'View', print: 'Read', music: 'Listen',
    visual: 'View', tech: 'View', worldbuilding: 'Explore',
  };

  /* ---- State from URL ---- */
  var params = new URLSearchParams(window.location.search);
  var currentMedium = params.get('medium') || '';
  var currentRole   = params.get('role')   || '';

  /* ---- Initial render ---- */
  main.innerHTML =
    renderFilterBar() +
    '<div class="projects-list" id="projects-list">' +
      PROJECTS.map(function(p, i) { return renderSection(p, i); }).join('') +
      '<p class="projects-empty" id="projects-empty" hidden>Nothing here — try a different filter.</p>' +
    '</div>';

  applyAccentColor();
  applyFilters();   /* show/hide based on initial URL params */
  renderRoleChips();
  setupFilters();

  /* =========================================
     FILTER BAR
     ========================================= */

  function renderFilterBar() {
    var mediumChips = MEDIUMS.map(function(m) {
      var active = m.slug === currentMedium ? ' active' : '';
      return (
        '<button class="filter-chip' + active + '" data-medium="' + m.slug + '" type="button">' +
          esc(m.label) +
        '</button>'
      );
    }).join('');

    return (
      '<div class="projects-filter-bar" id="projects-filter-bar">' +
        '<div class="filter-row filter-row--medium">' + mediumChips + '</div>' +
        '<div class="filter-row filter-row--roles" id="projects-role-row"></div>' +
      '</div>'
    );
  }

  function renderRoleChips() {
    var roleRow = document.getElementById('projects-role-row');
    if (!roleRow) return;

    /* Collect role categories from projects matching current MEDIUM (ignoring role filter) */
    var rolesSet = {};
    PROJECTS.forEach(function(p) {
      if (currentMedium && p.discipline !== currentMedium) return;
      if (p.roleCategories) p.roleCategories.forEach(function(r) { rolesSet[r] = true; });
    });
    var roles = Object.keys(rolesSet).sort();

    if (!roles.length) { roleRow.innerHTML = ''; return; }

    roleRow.innerHTML = roles.map(function(r) {
      var active = r === currentRole ? ' active' : '';
      return (
        '<button class="filter-chip filter-chip--role' + active + '" data-role="' + esc(r) + '" type="button">' +
          esc(r) +
        '</button>'
      );
    }).join('');
  }

  /* =========================================
     APPLY FILTERS — toggle hidden only, no DOM rewrite
     ========================================= */

  function applyFilters() {
    var visibleCount = 0;

    document.querySelectorAll('#projects-list .project-section').forEach(function(section) {
      var mediumOk = !currentMedium || section.dataset.medium === currentMedium;
      var roles    = section.dataset.roles ? section.dataset.roles.split('|') : [];
      var roleOk   = !currentRole || roles.indexOf(currentRole) !== -1;
      var show     = mediumOk && roleOk;

      section.hidden = !show;

      if (show) {
        visibleCount++;
        /* Keep numbering sequential for visible sections */
        var numEl = section.querySelector('.project-section-number');
        if (numEl) numEl.textContent = String(visibleCount).padStart(2, '0');
      }
    });

    var emptyEl = document.getElementById('projects-empty');
    if (emptyEl) emptyEl.hidden = visibleCount > 0;
  }

  /* =========================================
     SECTION RENDERER (called once on init)
     ========================================= */

  function renderSection(p, i) {
    var num        = String(i + 1).padStart(2, '0');
    var medLabel   = MEDIUM_LABELS[p.discipline] || p.discipline;
    var linkLabel  = MEDIUM_LINK_LABELS[p.discipline] || 'View';
    var hasUrl     = p.url && p.url !== '#';
    var thumb      = p.thumbnail && p.thumbnail.trim() ? p.thumbnail : '';
    var orgClass   = p.isOrganisation ? ' project-section--org' : '';
    var rolesAttr  = (p.roleCategories || []).join('|');

    var eyebrow = (
      '<div class="project-section-eyebrow">' +
        '<span class="project-section-number" aria-hidden="true">' + num + '</span>' +
        '<span class="tag" data-discipline="' + p.discipline + '">' + esc(medLabel) + '</span>' +
        (p.isOrganisation ? '<span class="tag" style="border-color:var(--text-muted);color:var(--text-muted)">Organisation</span>' : '') +
      '</div>'
    );

    var externalBtn = hasUrl
      ? '<a href="' + p.url + '" class="project-external-link" target="_blank" rel="noopener noreferrer">' +
          esc(linkLabel) + ' <span class="arrow" aria-hidden="true">↗</span>' +
        '</a>'
      : '';

    var titleRow = (
      '<div class="project-section-title-row">' +
        '<h2 class="project-section-title">' + esc(p.title) + '</h2>' +
        externalBtn +
      '</div>'
    );

    /* Full content HTML — fix ../ paths (content authored for /work/ subdirectory) */
    var body = '';
    if (p.content && p.content.trim()) {
      body = '<div class="project-section-body">' +
        p.content
          .replace(/src="\.\.\//g, 'src="')
          .replace(/href="\.\.\//g, 'href="') +
        '</div>';
    } else if (p.description) {
      body = '<p class="project-section-description">' + esc(p.description) + '</p>';
    }

    /* data-medium and data-roles are used by applyFilters() for fast show/hide */
    var dataAttrs = ' data-medium="' + p.discipline + '" data-roles="' + esc(rolesAttr) + '"';

    if (thumb) {
      var coverStyle = p.coverPosition ? ' style="--cover-position: ' + p.coverPosition + '"' : '';
      return (
        '<section class="project-section project-section--has-cover' + orgClass + '" id="' + p.id + '"' + dataAttrs + ' aria-label="' + esc(p.title) + '">' +
          '<div class="project-cover"' + coverStyle + '>' +
            '<img src="' + thumb + '" alt="' + esc(p.title) + '" loading="lazy">' +
            '<div class="project-cover-overlay">' + eyebrow + titleRow + '</div>' +
          '</div>' +
          '<div class="project-section-inner">' + body + '</div>' +
        '</section>'
      );
    }

    return (
      '<section class="project-section' + orgClass + '" id="' + p.id + '"' + dataAttrs + ' aria-label="' + esc(p.title) + '">' +
        '<div class="project-section-inner">' + eyebrow + titleRow + body + '</div>' +
      '</section>'
    );
  }

  /* =========================================
     FILTER INTERACTIVITY
     ========================================= */

  function setupFilters() {
    var bar = document.getElementById('projects-filter-bar');
    if (!bar) return;

    bar.addEventListener('click', function(e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;

      if (chip.dataset.medium !== undefined) {
        currentMedium = chip.dataset.medium;
        currentRole   = '';
        bar.querySelectorAll('.filter-chip[data-medium]').forEach(function(c) {
          c.classList.toggle('active', c.dataset.medium === currentMedium);
        });
        applyAccentColor();
        renderRoleChips();          /* new medium → refresh role chips */
      } else if (chip.dataset.role !== undefined) {
        var clicked = chip.dataset.role;
        currentRole = currentRole === clicked ? '' : clicked;
        bar.querySelectorAll('.filter-chip--role').forEach(function(c) {
          c.classList.toggle('active', c.dataset.role === currentRole);
        });
      }

      updateURL();
      applyFilters();               /* just toggles hidden — no DOM rewrite */
    });
  }

  /* =========================================
     ACCENT COLOUR + URL
     ========================================= */

  function applyAccentColor() {
    var m = MEDIUMS.find(function(x) { return x.slug === currentMedium; });
    main.style.setProperty('--discipline-color', m ? m.color : 'var(--accent)');
    document.title = (currentMedium ? MEDIUM_LABELS[currentMedium] + ' · ' : '') + 'Projects — Filipe Thomaz';
  }

  function updateURL() {
    var p = new URLSearchParams();
    if (currentMedium) p.set('medium', currentMedium);
    if (currentRole)   p.set('role',   currentRole);
    var qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  }

  /* ---- Helpers ---- */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
