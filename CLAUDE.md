# CLAUDE.md — Personal Website

## Stack
Static site. No build step, no framework, no bundler. GitHub Pages compatible.

## Files
```
index.html          # Home: Hero → About → Work toggle → Contact
projects.html       # All-projects filtered list (URL params: ?medium= ?role=)
work.html           # Discipline grid (legacy — redirects to projects.html)
blog.html           # Blog listing
blog/post.html      # Shared post template (?slug=)
cv.html             # CV page
work/screen.html    # Discipline detail pages (screen, stage, print, music,
work/stage.html     #   visual, tech, worldbuilding)
...
css/reset.css       # Minimal reset
css/style.css       # Design system: variables, nav, footer, .tag, .project-card
css/home.css        # Hero, About, Work toggle, Contact sections
css/work.css        # Discipline grid, medium-grid, discipline-panel
css/projects.css    # projects.html: filter bar, project-section layout
css/discipline.css  # Discipline detail pages (work/*.html)
css/blog.css        # Blog listing + post reader
css/cv.css          # CV page
css/theme-light.css # Light theme overrides
css/theme-dark.css  # Dark theme overrides
js/main.js          # Nav scroll, mobile menu, IntersectionObserver reveals,
                    #   hero role cycling, work-section view toggle, buildCard()
js/projects.js      # projects.html: filter bar render, applyFilters(), URL sync
js/discipline-page.js # work/*.html: discipline page logic
js/work-search.js   # Search functionality
js/blog-list.js     # Fetches blog/index.json, renders cards
js/blog-post.js     # Fetches .md, renders with marked.js
js/contact.js       # Formspree fetch, inline success/error
data/work.js        # const PROJECTS = [...] — single source of truth for all projects
```

## Design Tokens (css/style.css :root)
- `--bg #0A0A0A` · `--surface #141414` · `--surface-2 #1E1E1E` · `--border #2A2A2A`
- `--text #F0EDE8` · `--text-muted #666666` · `--accent #FF3E00`
- Discipline colors: `--screen #7C3AED` · `--stage #DC2626` · `--print #D97706`
  `--music #0EA5E9` · `--worldbuilding #059669` · `--tech #FF3E00` · `--visual #DB2777`
- Fonts: `--font-display 'Clash Display'` · `--font-body 'DM Sans'` · `--font-mono 'JetBrains Mono'`
- Spacing: `--s1 8px` through `--s8 128px` · `--max-width 1200px` · `--nav-height 64px`
- Easing: `--ease cubic-bezier(0.4,0,0.2,1)` · `--ease-out cubic-bezier(0,0,0.2,1)`

## Data Shape (data/work.js)
Each PROJECTS entry: `id` (kebab-case slug) · `title` · `discipline` · `category` ·
`year` · `status` · `roles[]` · `roleCategories[]` · `tags[]` · `relatedProjects[]` ·
`description` · `url` · `thumbnail` · `coverPosition` · `featured` · `content` (HTML string)

## Routing Rules — Which Agent Handles What

| Task | Agent |
|---|---|
| HTML structure, nav, forms, sections, accessibility attributes | `html-css` |
| CSS variables, layout, animation, responsive, new component styles | `html-css` |
| JS logic, event handlers, DOM manipulation, filter/state | `javascript` |
| data/work.js entries, blog/index.json, blog .md posts, bio/skills copy | `content` |
| Image loading, font loading, render performance, Core Web Vitals | `performance` |
| ARIA roles, keyboard nav, focus management, screen reader support | `accessibility` |

## Agent Spawning Rules
- Spawn agents with a **focused prompt**: specify exact files to read/edit, the precise
  change needed, and the expected output format (always full file, never partial snippets).
- Do not spawn multiple agents that touch the same file simultaneously.
- Reference actual class names, IDs, and CSS variable names in the prompt so the agent
  does not need to re-discover them.
- If a task spans two agents (e.g., new HTML section + new CSS), run html-css first,
  then pass its output to the next agent explicitly.
