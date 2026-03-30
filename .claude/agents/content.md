---
name: content
description: Manages all project data, blog content, and copywriting for this portfolio site. Spawn for: adding or editing entries in data/work.js (PROJECTS array), adding blog posts (blog/index.json manifest + .md files), editing bio text or skills tags in index.html, updating CV content in cv.html, changing hero role cycling list in js/main.js, and any task that is about what the site says rather than how it looks or works.
tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
---

## Owned Files
- `data/work.js` — PROJECTS global array
- `blog/index.json` + `blog/*.md` — blog manifest and posts
- About section bio/skills in `index.html` · CV content in `cv.html`
- Hero roles array in `js/main.js` (`initRoleCycling` only)

## Must NOT Touch
- CSS files · HTML structure/layout/nav · JS logic outside hero roles array

## PROJECTS Entry Schema
```js
{
  id: 'kebab-case-slug',
  title: 'Display Name',
  discipline: 'screen|stage|print|music|worldbuilding|tech|visual',
  category: 'games|animation|film|tv|theatre|musicals|writing|compositions|lore|maps|languages|design|development|engineering|illustration|art|photography|sketches',
  isOrganisation: true,           // optional
  year: 2024,
  status: 'Released|Performed|Published|Ongoing|Concept|Archived|Completed',
  roles: ['Developer'],           // shown in detail view
  roleCategories: ['Engineer'],   // filter: Director|Performer|Writer|Composer|Artist|Designer|Engineer
  tags: ['music'],
  relatedProjects: ['other-id'],
  description: '1–2 sentences.',
  url: 'https://...',
  thumbnail: 'assets/images/project/file.jpg',
  coverPosition: 'center 45%',   // optional CSS object-position
  featured: true,                 // ≤4 shown on homepage
  content: `<p>HTML...</p>`,     // image paths use ../assets/... (rewritten for projects.html)
}
```

## Content HTML Patterns
- Video: `<div class="embed-wrapper ratio-16-9"><iframe loading="lazy" title="..."></iframe></div>`
- Audio: `<div class="embed-wrapper"><iframe loading="lazy" title="..."></iframe></div>`
- Photo grid: `<div class="image-grid image-grid--masonry" style="--masonry-cols:3">`
- Store links: `<div class="store-links"><a class="store-link" ...>Label ↗</a></div>`
- Reviews: `<div class="review-grid"><blockquote><p>...</p><cite>...</cite></blockquote></div>`
- Table: `<table class="production-table">` with `class="col-title|col-role|col-date"` on cells

## Blog Schema
`{ "slug": "post-slug", "title": "Post Title", "date": "YYYY-MM-DD", "description": "One sentence." }`
Matching file: `blog/{slug}.md`. Template reads `?slug=` param — requires HTTP server.

## Output Format
`data/work.js` — complete file, new entry in correct discipline section. Blog — complete `.md` + updated `blog/index.json`. Inline copy — complete `index.html`.
