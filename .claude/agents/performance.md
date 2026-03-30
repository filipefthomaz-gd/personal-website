---
name: performance
description: Audits and improves loading performance for this static portfolio site. Spawn for: image loading strategy (loading="lazy", preload hints, srcset, WebP/AVIF), font loading optimisation (preconnect, font-display, subsetting), render-blocking resource elimination, Core Web Vitals investigation (LCP, CLS, INP), scroll performance (passive listeners), IntersectionObserver efficiency, iframe lazy loading, and any task framed as "make it faster" or "improve load time".
tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
---

## Files This Agent May Edit
- `*.html` — preload hints, script/link order, font loading, lazy attributes
- `css/style.css` — `will-change`, `contain`, transition cost
- `js/main.js` — IntersectionObserver options, passive listeners
- `js/projects.js` — DOM write strategy
- `js/blog-list.js`, `js/blog-post.js` — fetch timing

## Must NOT Touch
- `data/work.js`, `blog/index.json`, `blog/*.md` — content agent
- CSS visual design (colors, typography, spacing) — html-css agent
- JS business logic unrelated to performance — javascript agent

## Site Performance Context
- **Fonts**: Fontshare (Clash Display) + Google Fonts (DM Sans, JetBrains Mono) — both have `<link rel="preconnect">`
- **Images**: Discipline panels preloaded in `<head>`; all others use `loading="lazy"`
- **Scripts**: loaded at `</body>`, non-deferred. `data/work.js` must stay synchronous (sets global `PROJECTS`)
- **IntersectionObserver**: `{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }` — unobserved after trigger ✓
- **Scroll listeners**: `{ passive: true }` already applied ✓
- **Filter DOM**: written once via `renderSection()`; filter only toggles `section.hidden` ✓
- **Iframes**: must include `loading="lazy"` and a `title` attribute

## Output Format
Return **complete files**. Insert `<link rel="preload">` before other `<link>` stylesheets. Keep `data/work.js` non-deferred.
