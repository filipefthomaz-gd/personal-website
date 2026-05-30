/* =========================================
   PROJECTS.JS
   All-projects page: medium + role filter,
   accordion per-project, discipline separators,
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

  var DISCIPLINE_COLORS = {
    screen: 'var(--screen)', stage: 'var(--stage)', print: 'var(--print)',
    music: 'var(--music)', visual: 'var(--visual)', tech: 'var(--tech)',
    worldbuilding: 'var(--worldbuilding)',
  };

  /* ---- State from URL ---- */
  var params = new URLSearchParams(window.location.search);
  var currentMedium = params.get('medium') || '';
  var currentRole   = params.get('role')   || '';

  /* ---- Role categories (fixed — must be before renderFilterBar()) ---- */
  var ROLE_CATEGORIES = ['Director', 'Performer', 'Writer', 'Composer', 'Artist', 'Designer', 'Engineer'];

  /* ---- Initial render with discipline grouping ---- */
  var projectHtml = '';
  var prevDiscipline = '';
  var globalIndex = 0;

  PROJECTS.forEach(function(p) {
    if (p.discipline !== prevDiscipline) {
      projectHtml += renderDisciplineSeparator(p.discipline);
    }
    prevDiscipline = p.discipline;
    projectHtml += renderSection(p, globalIndex);
    globalIndex++;
  });

  main.innerHTML =
    renderFilterBar() +
    '<div class="projects-list" id="projects-list">' +
      projectHtml +
      '<p class="projects-empty" id="projects-empty" hidden>Nothing here — try a different filter.</p>' +
    '</div>';

  applyAccentColor();
  applyFilters();
  updateFilterUI();  /* sync bar to initial URL state */
  setupFilters();
  setupAccordion();
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

    resetAccordion();

    /* Toggle discipline separators based on visible projects */
    document.querySelectorAll('#projects-list .discipline-separator').forEach(function(sep) {
      /* Find the next separator or end of list — if any projects between them are visible, show separator */
      var next = sep.nextElementSibling;
      var hasVisible = false;
      while (next && !next.classList.contains('discipline-separator')) {
        if (next.matches('.project-section') && !next.hidden) { hasVisible = true; break; }
        next = next.nextElementSibling;
      }
      sep.hidden = !hasVisible;
    });

    var emptyEl = document.getElementById('projects-empty');
    if (emptyEl) emptyEl.hidden = visibleCount > 0;

    updateFilterUI();
    buildProjectPickerItems();
    setCurrentProject(null);
    //updatePillNav();
  }

  function resetAccordion() {
    document.querySelectorAll('#projects-list .project-section--expanded').forEach(function(section) {
      var header = section.querySelector('.project-accordion-header');
      var collapse = section.querySelector('.project-collapse');
      if (header) header.setAttribute('aria-expanded', 'false');
      if (collapse) collapse.classList.remove('open');
      section.classList.remove('project-section--expanded');
    });
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
     DISCIPLINE SEPARATOR
     ========================================= */

  function renderDisciplineSeparator(discipline) {
    var label = MEDIUM_LABELS[discipline] || discipline;
    var color = DISCIPLINE_COLORS[discipline] || 'var(--accent)';
    return (
      '<div class="discipline-separator" style="--discipline-color: ' + color + '">' +
        '<span class="discipline-separator-line"></span>' +
        '<span class="discipline-separator-label" style="color: ' + color + '">' + esc(label) + '</span>' +
        '<span class="discipline-separator-line"></span>' +
      '</div>'
    );
  }

  /* =========================================
     SECTION RENDERER (accordion per-project)
     ========================================= */

  function renderSection(p, i) {
    var num        = String(i + 1).padStart(2, '0');
    var medLabel   = MEDIUM_LABELS[p.discipline] || p.discipline;
    var linkLabel  = MEDIUM_LINK_LABELS[p.discipline] || 'View';
    var hasUrl     = p.url && p.url !== '#';
    var thumb      = p.thumbnail && p.thumbnail.trim() ? p.thumbnail : '';
    var orgClass   = p.isOrganisation ? ' project-section--org' : '';
    var rolesAttr  = (p.roleCategories || []).join('|');

    var chevron = '';

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
        chevron +
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
      body = '<div class="project-section-body"><p class="project-section-description">' + esc(p.description) + '</p></div>';
    }

    /* data-medium and data-roles are used by applyFilters() for fast show/hide */
    var dataAttrs = ' data-medium="' + p.discipline + '" data-roles="' + esc(rolesAttr) + '"';

    var headerAttrs = 'class="project-accordion-header" role="button" tabindex="0" aria-expanded="false"';

    if (thumb) {
      var coverStyle = p.coverPosition ? ' style="--cover-position: ' + p.coverPosition + '"' : '';
      return (
        '<section class="project-section project-section--has-cover' + orgClass + '" data-discipline="' + p.discipline + '" id="' + p.id + '"' + dataAttrs + ' aria-label="' + esc(p.title) + '">' +
          '<div ' + headerAttrs + '>' +
            '<div class="project-cover"' + coverStyle + '>' +
              '<img src="' + thumb + '" alt="' + esc(p.title) + '" loading="lazy">' +
              '<div class="project-cover-overlay">' + eyebrow + titleRow + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="project-collapse">' +
            '<div class="project-collapse-inner">' +
              '<div class="project-section-inner">' + rolesLine + body + '</div>' +
            '</div>' +
          '</div>' +
        '</section>'
      );
    }

    return (
      '<section class="project-section' + orgClass + '" data-discipline="' + p.discipline + '" id="' + p.id + '"' + dataAttrs + ' aria-label="' + esc(p.title) + '">' +
        '<div ' + headerAttrs + '>' +
          '<div class="project-section-inner">' + eyebrow + titleRow + '</div>' +
        '</div>' +
        '<div class="project-collapse">' +
          '<div class="project-collapse-inner">' +
            '<div class="project-section-inner" style="padding-top:0;">' + rolesLine + body + '</div>' +
          '</div>' +
        '</div>' +
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

        /* Expand the accordion for the selected project */
        if (typeof setupAccordion !== 'undefined' && setupAccordion.expandSection) {
          setupAccordion.expandSection(target);
        }
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
     ACCORDION — click header to expand/collapse
     ========================================= */

function setupAccordion() {
    var currentOpen = null; /* section element or null */
    var filterBar = document.getElementById('projects-filter-bar');

    document.querySelectorAll('.project-accordion-header').forEach(function(header) {
      header.addEventListener('click', function(e) {
        if (e.target.closest('.project-external-link')) return;
        toggleSection(this);
      });

      header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!e.target.closest('.project-external-link')) toggleSection(this);
        }
      });
    });

    function toggleSection(header) {
      var section = header.closest('.project-section');
      var collapse = section.querySelector('.project-collapse');
      var isOpen = collapse.classList.contains('open');

      /* Close previously open section if different */
      if (currentOpen && currentOpen !== section) {
        var prevHeader = currentOpen.querySelector('.project-accordion-header');
        var prevCollapse = currentOpen.querySelector('.project-collapse');
        if (prevHeader) prevHeader.setAttribute('aria-expanded', 'false');
        if (prevCollapse) prevCollapse.classList.remove('open');
        currentOpen.classList.remove('project-section--expanded');
      }

      if (isOpen) {
        collapse.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
        section.classList.remove('project-section--expanded');
        currentOpen = null;
      } else {
        collapse.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        section.classList.add('project-section--expanded');
        currentOpen = section;
      }
    }

    /* Expose for external use */
    return {
      expandSection: function(section) {
        if (!section) return;
        var header = section.querySelector('.project-accordion-header');
        if (header) {
          /* Close current if different */
          if (currentOpen && currentOpen !== section) {
            var pH = currentOpen.querySelector('.project-accordion-header');
            var pC = currentOpen.querySelector('.project-collapse');
            if (pH) pH.setAttribute('aria-expanded', 'false');
            if (pC) pC.classList.remove('open');
            currentOpen.classList.remove('project-section--expanded');
          }
var collapse = section.querySelector('.project-collapse');
          if (collapse && !collapse.classList.contains('open')) {
            collapse.classList.add('open');
            header.setAttribute('aria-expanded', 'true');
            section.classList.add('project-section--expanded');
            currentOpen = section;
          }
        }
      }
    };
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
