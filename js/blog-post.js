/* =========================================
   BLOG-POST.JS — Read ?slug= from URL,
                  fetch the .md file,
                  render with marked.js
   ========================================= */

(function initBlogPost() {

  var headerLoading = document.getElementById('post-header-loading');
  var body          = document.getElementById('post-body');
  var postHeader    = document.getElementById('post-header');

  if (!body) return;

  /* Get slug from query param */
  var params = new URLSearchParams(window.location.search);
  var slug   = params.get('slug');

  if (!slug) {
    showError('No post specified. <a href="../blog.html">← Back to blog</a>');
    return;
  }

  /* Validate slug (alphanumeric, hyphens only) */
  if (!/^[a-z0-9-]+$/.test(slug)) {
    showError('Invalid post identifier.');
    return;
  }

  /* Fetch the markdown file (same directory as post.html) */
  fetch('./' + encodeURIComponent(slug) + '.md')
    .then(function(res) {
      if (!res.ok) throw new Error('Post not found (HTTP ' + res.status + ')');
      return res.text();
    })
    .then(function(markdown) {
      renderPost(slug, markdown);
    })
    .catch(function(err) {
      showError(
        'Could not load this post. ' +
        '<a href="../blog.html">← Back to blog</a>' +
        '<br><small style="color:var(--border)">(' + escapeHtml(err.message) + ')</small>'
      );
      console.error('[blog-post]', err);
    });

  /* ---- Render ---- */
  function renderPost(slug, markdown) {
    /* Extract title from first # heading */
    var titleMatch = markdown.match(/^#\s+(.+)/m);
    var title = titleMatch ? titleMatch[1].trim() : slug;

    /* Update page title */
    document.title = title + ' — Filipe Thomaz';

    /* Update meta description */
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      /* Use first paragraph after the heading as description */
      var descMatch = markdown.match(/^#.+\n+([^#\n].+)/m);
      if (descMatch) metaDesc.setAttribute('content', descMatch[1].trim());
    }

    /* Render header */
    if (headerLoading) headerLoading.remove();

    /* Fetch metadata from blog/index.json for date + tags */
    fetch('../blog/index.json')
      .then(function(r) { return r.json(); })
      .then(function(posts) {
        var post = posts.find(function(p) { return p.slug === slug; });
        renderHeader(title, post);
      })
      .catch(function() {
        renderHeader(title, null);
      });

    /* Parse markdown (marked.js must be loaded first) */
    if (typeof marked === 'undefined') {
      body.innerHTML = '<p style="color:var(--stage)">Error: marked.js failed to load.</p>';
      return;
    }

    /* Configure marked */
    marked.setOptions({
      gfm: true,
      breaks: false,
    });

    /* Remove the first heading (we render it separately in the header) */
    var cleanMarkdown = markdown.replace(/^#\s+.+\n?/, '').trimStart();

    body.innerHTML = marked.parse(cleanMarkdown);
  }

  function renderHeader(title, post) {
    var dateHtml = '';
    var tagsHtml = '';

    if (post) {
      dateHtml = '<span class="post-date">' + formatDate(post.date) + '</span>';
      tagsHtml = (post.tags || []).map(function(tag) {
        return '<span class="tag">' + escapeHtml(tag) + '</span>';
      }).join('');
    }

    var metaRow = (dateHtml || tagsHtml)
      ? '<div class="post-meta">' + dateHtml + tagsHtml + '</div>'
      : '';

    /* Insert heading into header (after the back link) */
    var backLink = postHeader.querySelector('.post-back');
    var headerHTML = metaRow + '<h1 class="post-title">' + escapeHtml(title) + '</h1>';
    var headingEl  = document.createElement('div');
    headingEl.innerHTML = headerHTML;
    postHeader.querySelector('.container').appendChild(headingEl);
  }

  /* ---- Error state ---- */
  function showError(msg) {
    if (headerLoading) headerLoading.remove();
    body.innerHTML = '<p style="color:var(--stage); font-family:var(--font-mono); font-size:0.875rem;">' + msg + '</p>';
  }

  /* ---- Helpers ---- */
  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
