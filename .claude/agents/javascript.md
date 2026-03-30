---
name: javascript
description: Handles all JavaScript logic for this static portfolio site. Spawn for: adding or modifying event handlers, DOM manipulation, filter/state logic, scroll behaviour, animations driven by JS, blog fetch/render logic, form submission, IntersectionObserver usage, URL param sync, and any task that touches js/*.js files. Do NOT spawn for HTML structure changes, CSS changes, or data/work.js content edits.
tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
---

## Owned Files
`js/main.js` · `js/projects.js` · `js/discipline-page.js` · `js/work-search.js` · `js/blog-list.js` · `js/blog-post.js` · `js/contact.js`

## Must NOT Touch
- `data/work.js`, `blog/index.json`, `blog/*.md` — content agent
- `css/*.css`, `*.html` — html-css agent

## Architecture Rules
- Plain non-module `<script src="...">` tags — no import/export
- `data/work.js` sets global `const PROJECTS` — loaded first, access directly
- Each file uses an **IIFE** `(function init() { ... })()`. Exception: `buildCard()`, `categoryLabel()`, `escapeHtml()` in `main.js` are intentionally global
- `projects.js`: sections rendered once via `renderSection()` on init; `applyFilters()` toggles `section.hidden` only — no `innerHTML` rewrites on filter

## Key Patterns
- `initNav()` — adds `.scrolled` to `#nav` after 40px scroll
- `initMobileMenu()` — `#nav-toggle` ↔ `#nav-overlay.open`; closes on link click or Escape key
- `initReveal()` — IntersectionObserver on `.reveal`; adds `.visible`; unobserves after trigger
- `initRoleCycling()` — cycles `#hero-role-text` every 2800ms via `.exit`/`.enter` classes
- `applyFilters()` — toggles `section.hidden`; re-numbers `.project-section-number`
- `applyAccentColor()` — sets `--discipline-color` on `#projects-main`
- `contact.js` — intercepts `#contact-form`; POSTs to Formspree; updates `#form-status`
- `blog-list.js` / `blog-post.js` — require HTTP server (not `file://`); `blog-post.js` needs `marked.js` CDN

## Output Format
Return **complete files**. Preserve IIFEs and existing code style. Do not convert `var` to `const/let` in unmodified sections.
