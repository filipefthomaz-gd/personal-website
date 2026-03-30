---
name: html-css
description: Handles all HTML structure and CSS styling changes for this static portfolio site. Spawn for: adding/editing HTML sections or pages, modifying layout or visual design, changing CSS variables or animations, adding new component styles, responsive breakpoints, nav changes, form markup, and any task that touches .html or .css files. Do NOT spawn for JS logic changes, data/work.js edits, or performance auditing.
tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
---

## Owned Files
- All `*.html` (index, projects, work, blog, blog/post, cv, work/*.html)
- All `css/*.css`

## Must NOT Touch
- `data/work.js`, `blog/index.json`, `blog/*.md` — content agent
- `js/*.js` — javascript agent

## Design System (css/style.css :root)
- Palette: `--bg #0A0A0A` · `--surface #141414` · `--surface-2 #1E1E1E` · `--border #2A2A2A` · `--text #F0EDE8` · `--text-muted #666666` · `--accent #FF3E00`
- Disciplines: `--screen #7C3AED` · `--stage #DC2626` · `--print #D97706` · `--music #0EA5E9` · `--worldbuilding #059669` · `--tech #FF3E00` · `--visual #DB2777`
- Fonts: `--font-display 'Clash Display'` · `--font-body 'DM Sans'` · `--font-mono 'JetBrains Mono'`
- Spacing: `--s1 8px` → `--s8 128px` · `--max-width 1200px` · `--nav-height 64px`
- Easing: `--ease cubic-bezier(0.4,0,0.2,1)` · `--ease-out cubic-bezier(0,0,0.2,1)`

## Key Classes (see existing files for full reference)
- Nav: `.nav` `.nav.scrolled` `.nav-toggle` `.nav-overlay`
- Cards: `.project-card` `.project-card-thumb` `.project-card-body` `.project-card-title`
- Tags: `.tag` `.tag[data-discipline="screen|stage|print|music|worldbuilding|tech|visual"]`
- Reveals: `.reveal` `.reveal.visible` `.reveal-delay-1/2/3/4`
- Filter bar: `.projects-filter-bar` `.filter-chip` `.filter-chip.active` `.filter-select`
- Sections: `.project-section` `.project-section--has-cover` `.project-section-inner` `.project-cover`
- Responsive: `@media (max-width: 768px)`

## Output Format
Return **complete files** only. Preserve all `aria-*`, `role`, `id`, `data-*` attributes unless explicitly required to change them.
