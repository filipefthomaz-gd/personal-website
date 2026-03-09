/* =========================================
   WORK-SEARCH.JS
   Searches PROJECTS by title, description,
   roles, and category. Shows result cards
   above the discipline grid.
   ========================================= */

(function initWorkSearch() {

  var input   = document.getElementById('work-search');
  var results = document.getElementById('work-search-results');
  var grid    = document.querySelector('.discipline-grid');

  if (!input || !results || !grid) return;
  if (typeof PROJECTS === 'undefined') return;

  var DISCIPLINE_LABELS = {
    screen: 'Screen', stage: 'Stage', print: 'Print',
    music: 'Music', worldbuilding: 'Worldbuilding', tech: 'Tech', visual: 'Visual',
  };

  input.addEventListener('input', function() {
    var q = input.value.trim().toLowerCase();

    if (!q) {
      results.hidden = true;
      results.innerHTML = '';
      grid.style.display = '';
      return;
    }

    var matched = PROJECTS.filter(function(p) {
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.roles && p.roles.some(function(r) { return r.toLowerCase().includes(q); })) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.discipline && p.discipline.toLowerCase().includes(q))
      );
    });

    grid.style.display = 'none';

    if (!matched.length) {
      results.innerHTML = '<p class="work-search-empty">No projects found for &ldquo;' + escapeHtml(input.value) + '&rdquo;.</p>';
      results.hidden = false;
      return;
    }

    results.innerHTML = matched.map(function(p) {
      var href = './work/' + p.discipline + '.html#' + p.id;
      var disciplineLabel = DISCIPLINE_LABELS[p.discipline] || p.discipline;
      var roles = p.roles && p.roles.length ? p.roles.join(' · ') : '';
      var year = p.year ? String(p.year) : '';
      var status = p.status || '';

      return (
        '<a href="' + href + '" class="search-result-card" data-discipline="' + p.discipline + '">' +
          '<div class="search-result-tag-row">' +
            '<span class="tag" data-discipline="' + p.discipline + '">' + escapeHtml(disciplineLabel) + '</span>' +
            (status ? '<span class="search-result-status">' + escapeHtml(status) + '</span>' : '') +
            (year ? '<span class="search-result-year">' + escapeHtml(year) + '</span>' : '') +
          '</div>' +
          '<h3 class="search-result-title">' + escapeHtml(p.title) + '</h3>' +
          (roles ? '<p class="search-result-roles">' + escapeHtml(roles) + '</p>' : '') +
          (p.description ? '<p class="search-result-desc">' + escapeHtml(p.description) + '</p>' : '') +
        '</a>'
      );
    }).join('');

    results.hidden = false;
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
