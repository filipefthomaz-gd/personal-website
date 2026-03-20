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

  /* ---- Role categories (fixed — must be before renderFilterBar()) ---- */
  var ROLE_CATEGORIES = ['Director', 'Performer', 'Writer', 'Composer', 'Artist', 'Designer', 'Engineer'];

  /* ---- Initial render ---- */
  main.innerHTML =
    renderFilterBar() +
    '<div class="projects-list" id="projects-list">' +
      PROJECTS.map(function(p, i) { return renderSection(p, i); }).join('') +
      '<p class="projects-empty" id="projects-empty" hidden>Nothing here — try a different filter.</p>' +
    '</div>';

  applyAccentColor();
  applyFilters();
  updateFilterUI();  /* sync bar to initial URL state */
  setupFilters();
  setupProjectPicker();

  /* =========================================
     FILTER BAR
     ========================================= */

  function renderFilterBar() {
    var medChips = MEDIUMS.slice(1).map(function(m) {
      var active = m.slug === currentMedium ? ' active' : '';
      return '<button class="filter-chip' + active + '" data-medium="' + m.slug + '" type="button">' + esc(m.label) + '</button>';
    }).join('');

    var roleOptions = '<option value="">All Roles</option>' +
      ROLE_CATEGORIES.map(function(r) {
        return '<option value="' + esc(r) + '"' + (r === currentRole ? ' selected' : '') + '>' + esc(r) + '</option>';
      }).join('');

    return (
      '<div class="projects-filter-bar" id="projects-filter-bar">' +
        '<div class="filter-selects">' +
          '<div class="filter-medium-chips" id="filter-medium-chips">' + medChips + '</div>' +
          '<div class="filter-role-wrap">' +
            '<label class="filter-select-label" for="filter-role-select">Role</label>' +
            '<select class="filter-select" id="filter-role-select">' + roleOptions + '</select>' +
          '</div>' +
          '<div class="project-picker" id="project-picker">' +
            '<button class="project-picker-btn" id="project-picker-btn" type="button" aria-haspopup="listbox" aria-expanded="false">' +
              '<span class="project-picker-label" id="project-picker-label">—</span>' +
              '<span class="project-picker-arrow" aria-hidden="true">▾</span>' +
            '</button>' +
            '<div class="project-picker-dropdown" id="project-picker-dropdown" hidden role="listbox"></div>' +
          '</div>' +
        '</div>' +
        //'<nav class="pill-nav projects-pill-nav" id="projects-pill-nav" aria-label="Jump to project"></nav>' +
      '</div>'
    );
  }

  function updateFilterUI() {
    document.querySelectorAll('#filter-medium-chips .filter-chip').forEach(function(c) {
      c.classList.toggle('active', c.dataset.medium === currentMedium);
    });

    var roleSel = document.getElementById('filter-role-select');
    if (roleSel) roleSel.value = currentRole;
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
        var numEl = section.querySelector('.project-section-number');
        if (numEl) numEl.textContent = String(visibleCount).padStart(2, '0');
      }
    });

    var emptyEl = document.getElementById('projects-empty');
    if (emptyEl) emptyEl.hidden = visibleCount > 0;

    updateFilterUI();
    buildProjectPickerItems();
    setCurrentProject(null);
    //updatePillNav();
  }

  function updatePillNav() {
    var nav = document.getElementById('projects-pill-nav');
    if (!nav) return;

    var sections = document.querySelectorAll('#projects-list .project-section:not([hidden])');
    if (!sections.length) { nav.innerHTML = ''; return; }

    nav.innerHTML = Array.from(sections).map(function(section) {
      var titleEl = section.querySelector('.project-section-title');
      var label   = titleEl ? titleEl.textContent.trim() : section.id;
      if (label.length > 28) label = label.slice(0, 27) + '…';
      return '<a href="#' + section.id + '" class="pill-nav-item" data-pill="' + section.id + '">' + label + '</a>';
    }).join('');
  }

  function setupScrollActivePill() {
    var filterBar = document.getElementById('projects-filter-bar');

    function setActivePill(id) {
      var nav = document.getElementById('projects-pill-nav');
      if (!nav) return;
      nav.querySelectorAll('.pill-nav-item').forEach(function(pill) {
        var active = pill.dataset.pill === id;
        pill.classList.toggle('active', active);
        if (active) pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }

    function update() {
      var barH      = filterBar ? filterBar.offsetHeight : 80;
      var navH      = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
      var threshold = navH + barH + 16;

      var visible = Array.from(document.querySelectorAll('#projects-list .project-section:not([hidden])'));
      if (!visible.length) return;

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
        setActivePill(visible[visible.length - 1].id);
        return;
      }

      var activeId = visible[0].id;
      visible.forEach(function(s) {
        if (s.getBoundingClientRect().top <= threshold) activeId = s.id;
      });
      setActivePill(activeId);
    }

    window.addEventListener('scroll', update, { passive: true });
    requestAnimationFrame(update);
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

    /* Specific roles line (actual roles, not categories) */
    var rolesLine = (p.roles && p.roles.length)
      ? '<p class="project-roles-line">' + p.roles.map(esc).join(' · ') + '</p>'
      : '';

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
          '<div class="project-section-inner">' + rolesLine + body + '</div>' +
        '</section>'
      );
    }

    return (
      '<section class="project-section' + orgClass + '" id="' + p.id + '"' + dataAttrs + ' aria-label="' + esc(p.title) + '">' +
        '<div class="project-section-inner">' + eyebrow + titleRow + rolesLine + body + '</div>' +
      '</section>'
    );
  }

  /* =========================================
     PROJECT PICKER — chip + dropdown navigator
     ========================================= */

  function buildProjectPickerItems() {
    var dropdown = document.getElementById('project-picker-dropdown');
    if (!dropdown) return;

    var sections = Array.from(document.querySelectorAll('#projects-list .project-section:not([hidden])'));
    if (!sections.length) { dropdown.innerHTML = ''; return; }

    dropdown.innerHTML = sections.map(function(section, idx) {
      var numEl   = section.querySelector('.project-section-number');
      var titleEl = section.querySelector('.project-section-title');
      var num   = numEl   ? numEl.textContent.trim()   : String(idx + 1).padStart(2, '0');
      var label = titleEl ? titleEl.textContent.trim() : section.id;
      if (label.length > 36) label = label.slice(0, 35) + '…';
      return (
        '<button class="project-picker-item" role="option" data-target="' + section.id + '" type="button">' +
          '<span class="project-picker-item-num">' + esc(num) + '</span>' +
          '<span class="project-picker-item-title">' + esc(label) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function setCurrentProject(sectionId) {
    var label    = document.getElementById('project-picker-label');
    var dropdown = document.getElementById('project-picker-dropdown');
    if (!label) return;

    var section = sectionId ? document.getElementById(sectionId) : null;
    if (section) {
      var numEl   = section.querySelector('.project-section-number');
      var titleEl = section.querySelector('.project-section-title');
      var num   = numEl   ? numEl.textContent.trim() : '';
      var title = titleEl ? titleEl.textContent.trim() : sectionId;
      if (title.length > 28) title = title.slice(0, 27) + '…';
      label.textContent = num + ' · ' + title;
    } else {
      var visible = document.querySelectorAll('#projects-list .project-section:not([hidden])');
      label.textContent = visible.length + (visible.length === 1 ? ' project' : ' projects');
    }

    if (dropdown) {
      dropdown.querySelectorAll('.project-picker-item').forEach(function(item) {
        item.classList.toggle('current', item.dataset.target === sectionId);
      });
    }
  }

  function setupProjectPicker() {
    var picker    = document.getElementById('project-picker');
    var btn       = document.getElementById('project-picker-btn');
    var dropdown  = document.getElementById('project-picker-dropdown');
    var filterBar = document.getElementById('projects-filter-bar');
    if (!picker || !btn || !dropdown) return;

    btn.addEventListener('click', function() {
      var isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        var current = dropdown.querySelector('.project-picker-item.current');
        if (current) current.scrollIntoView({ block: 'nearest' });
      }
    });

    dropdown.addEventListener('click', function(e) {
      var item = e.target.closest('.project-picker-item[data-target]');
      if (!item) return;
      var target = document.getElementById(item.dataset.target);
      if (target) {
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        var barH = filterBar ? filterBar.offsetHeight : 56;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - barH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      setCurrentProject(item.dataset.target);
      dropdown.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function(e) {
      if (!picker.contains(e.target)) {
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    var _rafPending = false;
    function onScroll() {
      if (_rafPending) return;
      _rafPending = true;
      requestAnimationFrame(function() {
        _rafPending = false;
        var barH = filterBar ? filterBar.offsetHeight : 80;
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        var threshold = navH + barH + 32;

        var visible = Array.from(document.querySelectorAll('#projects-list .project-section:not([hidden])'));
        if (!visible.length) { setCurrentProject(null); return; }

        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
          setCurrentProject(visible[visible.length - 1].id);
          return;
        }

        var activeId = visible[0].id;
        visible.forEach(function(s) {
          if (s.getBoundingClientRect().top <= threshold) activeId = s.id;
        });
        setCurrentProject(activeId);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(onScroll);
  }

  /* =========================================
     FILTER INTERACTIVITY
     ========================================= */

  function setupFilters() {
    var chips  = document.getElementById('filter-medium-chips');
    var roleSel = document.getElementById('filter-role-select');

    if (chips) {
      chips.addEventListener('click', function(e) {
        var chip = e.target.closest('.filter-chip[data-medium]');
        if (!chip) return;
        /* Toggle: clicking active chip clears filter */
        currentMedium = chip.dataset.medium === currentMedium ? '' : chip.dataset.medium;
        currentRole   = '';
        if (roleSel) roleSel.value = '';
        applyAccentColor();
        updateURL(); applyFilters();
      });
    }

    if (roleSel) {
      roleSel.addEventListener('change', function() {
        currentRole = this.value;
        updateURL(); applyFilters();
      });
    }
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
