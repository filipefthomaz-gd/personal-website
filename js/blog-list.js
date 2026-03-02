/* =========================================
   BLOG-LIST.JS — Fetch index.json and render
                  blog post cards
   ========================================= */

(function initBlogList() {

  var list    = document.getElementById('blog-list');
  var loading = document.getElementById('blog-loading');

  if (!list) return;

  /* Determine base path: blog.html is at root, so manifest is at ./blog/index.json */
  fetch('./blog/index.json')
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load blog index');
      return res.json();
    })
    .then(function(posts) {
      if (loading) loading.remove();

      if (!posts || !posts.length) {
        list.innerHTML = '<p class="blog-empty">No posts yet — check back soon.</p>';
        return;
      }

      /* Sort by date descending */
      posts.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      list.innerHTML = posts.map(function(post) {
        var date = formatDate(post.date);
        var tags = (post.tags || []).map(function(tag) {
          return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join('');

        return (
          '<a href="./blog/post.html?slug=' + encodeURIComponent(post.slug) + '" class="blog-card" aria-label="' + escapeHtml(post.title) + '">' +
            '<span class="blog-card-date">' + escapeHtml(date) + '</span>' +
            '<div class="blog-card-body">' +
              '<span class="blog-card-title">' + escapeHtml(post.title) + '</span>' +
              (post.excerpt ? '<p class="blog-card-excerpt">' + escapeHtml(post.excerpt) + '</p>' : '') +
              (tags ? '<div class="blog-card-tags">' + tags + '</div>' : '') +
            '</div>' +
            '<span class="blog-card-arrow" aria-hidden="true">→</span>' +
          '</a>'
        );
      }).join('');
    })
    .catch(function(err) {
      if (loading) loading.remove();
      list.innerHTML = (
        '<p class="blog-empty">' +
          'Could not load posts. ' +
          '<small style="color:var(--border)">(' + escapeHtml(err.message) + ' — make sure you\'re running a local server, not file://)</small>' +
        '</p>'
      );
      console.error('[blog-list]', err);
    });

  /* ---- Helpers ---- */

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
