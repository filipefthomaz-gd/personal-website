/**
 * OCEAN MODULES
 * Sub-projects of the `ocean` entry in data/work.js. Rendered by js/ocean-page.js
 * on ocean.html.
 *
 *   id       — slug, used as the section anchor (ocean.html#hydra)
 *   name     — module name
 *   text     — the module's own one-line subtitle
 *   tagline  — 1–2 sentences
 *   accent   — CSS colour for the module's accent
 *   status   — Stable | In Development
 *   project  — optional id in data/work.js, when the module has its own entry
 *   docs     — optional URL of the module's documentation site
 *   features — [{ title, detail }]
 */

const OCEAN_MODULES = [

  {
    id: 'aqua',
    docs: 'https://filipefthomaz-gd.github.io/aqua-documentation/',
    name: 'Aqua',
    text: 'Adaptive Quality Unity Animator',
    accent: 'var(--music)',
    status: 'Stable',
    tagline: 'A Playables-based animation system for game-ready blending, transitions, markers and per-state callbacks — all through a single fluent handle.',
    features: [
      { title: 'Playables-native', detail: 'Built entirely on Unity’s Playables API. No Animator Controller required — Aqua drives the graph directly.' },
      { title: 'Smooth transitions', detail: 'Every Play() call takes a crossfade duration and an easing curve, so any two clips can fade into each other.' },
      { title: '1D blend trees', detail: 'Blend trees authored as ScriptableObjects, driving locomotion, aim offsets, or any continuous motion.' },
      { title: 'Timed markers', detail: 'Named callbacks at normalised-time positions inside a clip, for footsteps, VFX and hit frames.' },
      { title: 'Live handles', detail: 'Play() returns a handle you can query for weight, speed and normalised time, and hook completion callbacks onto.' },
    ],
  },

  {
    id: 'hydra',
    docs: 'https://filipefthomaz-gd.github.io/hydra-documentation/',
    name: 'Hydra',
    text: 'Adaptive audio for Unity',
    accent: 'var(--screen)',
    status: 'Stable',
    tagline: 'Hybrid Dynamically Responsive Audio — stem-based music, beat-synced transitions, spatial zones and emotional mixing, so audio reacts to what is happening.',
    features: [
      { title: 'Stem-based music', detail: 'Tracks composed from independent stems, each able to fade in or out at runtime so arrangement follows the game.' },
      { title: 'Beat-synced transitions', detail: 'Crossfade on the next beat, the next bar, or immediately — transitions fire on musically sensible boundaries.' },
      { title: 'Emotional state mixing', detail: 'Drive the stem mix from two independent axes — danger and pace, tension and energy, or whatever the game needs.' },
      { title: 'Spatial zones', detail: 'Blend zones crossfade between tracks as the player moves through a collider, with acoustic zones for space.' },
      { title: 'Stochastic variation', detail: 'Weighted clip pools with history suppression, so repeated sounds stop turning into earworms.' },
      { title: 'Cinematic sequences', detail: 'Sequences that play through once and advance automatically, or loop until released.' },
    ],
  },

  {
    id: 'tide',
    docs: 'https://filipefthomaz-gd.github.io/tide-documentation/',
    name: 'Tide',
    text: 'Unity tweening system',
    accent: 'var(--visual)',
    status: 'Stable',
    tagline: 'Fluent, awaitable tweens for transforms, UI, post-processing and audio. No setup — just call and chain.',
    features: [
      { title: 'Fluent API', detail: 'Extension methods on Unity types: move, rotate, scale and fade in a single expressive call.' },
      { title: 'Awaitable', detail: 'Every tween returns a handle supporting async/await and Task.WhenAll, so animations chain naturally.' },
      { title: 'Override and kill', detail: 'Register tweens against a target and call Override() to stop competing animations automatically.' },
      { title: '25 easing types', detail: 'Linear through Quadratic, Cubic, Expo, Sine, Back, Elastic and Bounce — In, Out and InOut.' },
      { title: 'Covers the full stack', detail: 'Transform, RectTransform, Renderer, SkinnedMesh, Image, TextMeshPro, CanvasGroup and VolumeProfile.' },
      { title: 'Zero-allocation design', detail: 'Coroutine-driven with no per-frame allocations in the hot path.' },
    ],
  },

  {
    id: 'hull',
    docs: 'https://filipefthomaz-gd.github.io/hull-documentation/',
    name: 'Hull',
    text: 'HUD and UI Layout Library',
    accent: 'var(--print)',
    status: 'Stable',
    tagline: 'A code-driven window and layout system. Open, split, overlay and animate UI panels without wrangling RectTransforms by hand.',
    features: [
      { title: 'Window lifecycle', detail: 'Every panel is a Window with open, close, toggle, animated and immediate states.' },
      { title: 'Layout tree', detail: 'Windows organised into a tree of panel and split nodes, traversed on change to resolve the layout.' },
      { title: 'Split and resize', detail: 'Split any panel horizontally or vertically into N sub-panels, by ratio or fixed pixel size.' },
      { title: 'Overlays', detail: 'Overlay a window on top of another without disturbing sibling layout.' },
      { title: 'Popups', detail: 'Float a window above the whole tree with full anchor and pivot control, and optional input blocking.' },
      { title: 'Declarative blueprints', detail: 'Describe an entire multi-panel layout in one fluent chain before any window opens.' },
    ],
  },

  {
    id: 'pearl',
    name: 'Pearl',
    text: 'Property Editor Attribute Rendering Library',
    accent: 'var(--worldbuilding)',
    status: 'Stable',
    tagline: 'The inspector attribute system. Decorate fields with attributes and Pearl handles the rendering.',
    features: [
      { title: 'Layout groups', detail: 'Box, Foldout, Tab, Horizontal, Vertical, TitleGroup and ToggleGroup, all composable and freely nestable.' },
      { title: 'Conditionals', detail: 'HideIf, ShowIf, DisableIf, EnableIf and ReadOnly, applied to single fields or whole groups.' },
      { title: 'Buttons', detail: 'Put [Button] on a method to get an inspector button for it.' },
      { title: 'Rich drawers', detail: 'ProgressBar, MinMaxSlider, LabelText, InfoBox, Required, ValidateInput and PreviewField.' },
      { title: 'Reference helpers', detail: 'A type selector for SerializeReference polymorphism, plus ValueDropdown and InlineEditor.' },
      { title: 'Inheritance handled', detail: 'Walks the full type hierarchy when resolving attributes, so private fields on base types still draw.' },
    ],
  },

  {
    id: 'reefs',
    docs: 'https://filipefthomaz-gd.github.io/reefs-documentation/',
    name: 'Reefs',
    text: 'Reactive query language',
    accent: 'var(--stage)',
    status: 'Stable',
    tagline: 'Plain-text boolean expressions evaluated against a blackboard, with reactive subscriptions, temporal history and windowed time constraints. Written Unity-free against .NET Standard.',
    features: [
      { title: 'Readable syntax', detail: 'Plain-text boolean expressions: comparisons, logic, arithmetic, set membership and intervals.' },
      { title: 'Reactive evaluation', detail: 'Observers subscribe to exactly the blackboard keys they read and re-evaluate only when those change.' },
      { title: 'Windowed queries', detail: 'Constrain any condition to a time boundary — how long it has held, or whether it held within a window.' },
      { title: 'Temporal history', detail: 'WAS latches once a condition has ever been true; CHANGED, CHANGED TO, CHANGED FROM and INCREASED track transitions.' },
      { title: 'Extensible functions', detail: 'Custom function operands that declare their own blackboard dependencies.' },
    ],
  },

  {
    id: 'flow',
    docs: 'https://filipefthomaz-gd.github.io/flow-documentation/',
    name: 'Flow',
    text: 'Dialogue scripting language',
    accent: 'var(--tech)',
    status: 'Stable',
    project: 'flow',
    tagline: 'A YAML-inspired dialogue scripting language and runtime for interactive narrative, with first-class support for interruptions and simultaneous tracks.',
    features: [
      { title: 'Writer-friendly syntax', detail: 'Indentation-based script that writers can author without thinking about implementation.' },
      { title: 'Interruption system', detail: 'Simultaneous tracks and mid-dialogue interjections, so characters can talk over each other.' },
      { title: 'Rich branching', detail: 'Player choices, conditional branches, multi-condition nodes and random selection.' },
      { title: 'Editor tooling', detail: 'A language server, VS Code extension, desktop app and web editor — see Flow Writer.' },
    ],
  },

  {
    id: 'knot',
    name: 'Knot',
    text: 'In early development',
    accent: 'var(--text-muted)',
    status: 'In Development',
    tagline: 'Early development. Not yet documented.',
    features: [],
  },

  {
    id: 'octopus',
    name: 'Octopus',
    text: 'In early development',
    accent: 'var(--text-muted)',
    status: 'In Development',
    tagline: 'Early development. Not yet documented.',
    features: [],
  },

];
