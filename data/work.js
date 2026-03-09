/**
 * PROJECTS DATA
 * Add your projects here. Each entry appears on its discipline page.
 *
 * Fields:
 *   id          — unique slug (kebab-case, used as anchor: work/screen.html#id)
 *   title       — project display name
 *   discipline  — screen | stage | print | music | worldbuilding | tech
 *   category    — sub-category (see list below)
 *   description — 1–2 sentences shown when there is no inline content
 *   url         — external link (itch.io, Spotify, published piece, etc.)
 *                 Leave '#' or omit if there's no external link
 *   thumbnail   — relative path from site root, e.g. "assets/images/my-game.jpg"
 *                 Leave '' for placeholder
 *   featured    — true to show on homepage Selected Works (pick 3–4 max)
 *   content     — optional HTML string rendered as the inline project section body
 *                 Leave '' if description + external link is enough
 *                 Use full HTML: <p>, <img>, <iframe> embeds, etc.
 *
 * Sub-categories per discipline:
 *   screen:        games | animation
 *   stage:         theatre | musicals
 *   print:         writing
 *   music:         compositions
 *   worldbuilding: lore | maps | languages
 *   tech:          design | development | engineering
 */

const PROJECTS = [

  /* ── SCREEN ───────────────────────────────────────── */
  {
    id: 'into-a-dream',
    title: 'Into A Dream',
    discipline: 'screen',
    category: 'games',
    description: 'A solo-developed 2D story-driven video game about depression, empathy and compassion. Released on Steam, Switch and PlayStation.',
    url: 'https://store.steampowered.com/app/1238360/Into_A_Dream/',          // ← set to Steam URL if you want a single primary button in the header
    thumbnail: 'assets/images/into-a-dream/main_autumn_logo.webp',
    coverPosition: 'center  100%',
    featured: true,
    content: `
      <p>Into A Dream is a 2D story-driven video game developed solo and released in 2020 on Steam
      for Windows, Mac and Linux, and in 2021 for Switch and PlayStation in partnership with the
      publisher <strong>Top Hat Entertainment</strong>.</p>

      <p>I was responsible for all elements of the game: programming (<strong>Unity</strong>),
      narrative, art, soundtrack, marketing and voice over recording.</p>

      <p>Relying heavily on its narrative, its characters and their personalities and relationships,
      Into A Dream tells an emotional story about a man, Luke, suffering from severe depression.
      The player plays as a character who enters Luke's dreams in order to talk to him, unfold his
      story and prevent him from fading away. It's a story about inevitability, love, family, mental
      health, empathy and compassion.</p>

      <p>An article about Into A Dream was written by the <strong>Royal College of Psychiatrists</strong>
      about how, in their opinion, the story reflects reality and tackles the subject in a grounded,
      real, and humane way:
      <a href="RCPSYCH_URL" target="_blank" rel="noopener noreferrer">RCPsych about Into A Dream ↗</a>.</p>

      <h3>Trailer</h3>

      <div class="embed-wrapper ratio-16-9">
        <iframe
          src="https://www.youtube.com/embed/vXLmKQTvmWM"
          title="Into A Dream — Official Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>

      <div class="store-links">
        <a href="https://store.steampowered.com/app/1238360/Into_A_Dream/" class="store-link" target="_blank" rel="noopener noreferrer">Steam ↗</a>
        <a href="https://www.nintendo.com/us/store/products/into-a-dream-switch/" class="store-link" target="_blank" rel="noopener noreferrer">Nintendo Switch ↗</a>
        <a href="https://store.playstation.com/en-us/product/UP5155-CUSA27290_00-1646979601136582" class="store-link" target="_blank" rel="noopener noreferrer">PlayStation ↗</a>
      </div>

      <h3>Reviews</h3>

      <div class="review-grid">
        <blockquote>
          <p>"Into A Dream is a welcome reminder of the beauty of compassion and empathy."</p>
          <cite>— ScreenRant (8/10)</cite>
        </blockquote>

        <blockquote>
          <p>"It is said that some writers write a book from the heart, and it is my belief that Filipe created a game from the heart!"</p>
          <cite>— DumeeGamer</cite>
        </blockquote>

        <blockquote>
          <p>"... one of the best and most emotional games of the year and it's a game that will stay in your memory long after playing it."</p>
          <cite>— AdventureGamePodcast</cite>
        </blockquote>

        <blockquote>
          <p>"Into A Dream takes you on an emotional journey (...) that will inevitably touch you."</p>
          <cite>— Unaltered Magazine (8.3/10)</cite>
        </blockquote>
      </div>

      <h3>Screenshots</h3>

      <div class="image-grid image-grid--masonry" style="--masonry-cols:3">
        <!-- Add screenshots: -->
        <img src="../assets/images/into-a-dream/main_autumn_logo.webp" alt="Into A Dream — Main Capsule">
        <img src="../assets/images/into-a-dream/iad_snow.gif" alt="Into A Dream — Snow Level">
        <img src="../assets/images/into-a-dream/iad_yellowbridge.gif" alt="Into A Dream — Yellowbridge Level">
        <img src="../assets/images/into-a-dream/iad_river.gif" alt="Into A Dream — River Level">
        <img src="../assets/images/into-a-dream/iad_blue.png" alt="Into A Dream — Blue Banner">
        <img src="../assets/images/into-a-dream/iad_beach.png" alt="Into A Dream — Beach Level">
        <img src="../assets/images/into-a-dream/iad_green.gif" alt="Into A Dream — Green Level">
        <img src="../assets/images/into-a-dream/iad_funeral.gif" alt="Into A Dream — Funeral Level">
        <img src="../assets/images/into-a-dream/iad_river_2.png" alt="Into A Dream — River Level">
      </div>
    `,
  },
  {
    id: 'play4equality',
    title: 'Play4Equality',
    discipline: 'screen',
    category: 'games',
    description: 'A narrative-driven mobile game commissioned by the Portuguese Red Cross, addressing gender inequality, dating violence, and human trafficking for a teen audience. Released free on iOS and Android in 2022.',
    url: 'https://funpunchgames.com/play4equality.html',
    thumbnail: 'assets/images/play4equality/cover.jpg', // ← add a screenshot: assets/images/play4equality/cover.jpg
    coverPosition: 'center  45%',
    featured: false,
    content: `
      <p>In 2021, <strong>Fun Punch Games</strong> — an independent studio based in Lisbon — came to me
      with a challenge: help create a game for the <strong>Portuguese Red Cross</strong> that would connect
      with a teenage audience and address urgent topics — gender inequality, dating violence, and human
      trafficking — in a way that felt engaging rather than didactic.</p>

      <p>The result was <strong>Play4Equality</strong>, a narrative-driven game where the player joins a group
      of high school friends over a weekend. The story unfolds entirely through a simulated smartphone
      interface — video calls, text messages, social media posts — with the player's choices shaping the
      outcome. Developed in Portuguese and co-funded through POISE (Programa Operacional Inclusão Social e
      Emprego), the game was adopted in schools across Portugal as a classroom tool for discussion.</p>

      <p>I took on the roles of <strong>main developer</strong>, <strong>narrative director</strong>, and
      <strong>voiceover director</strong>. Play4Equality was released free on iOS and Android in
      April 2022.</p>

      <div class="store-links">
        <a href="https://apps.apple.com/pt/app/play4equality/id1612476802" class="store-link" target="_blank" rel="noopener noreferrer">App Store ↗</a>
        <a href="https://funpunchgames.com/play4equality.html" class="store-link" target="_blank" rel="noopener noreferrer">Google Play ↗</a>
      </div>

      <h3>Screenshots</h3>
      <div class="image-grid image-grid--masonry" style="--masonry-cols:3">
        <img src="../assets/images/play4equality/cover.jpg" alt="Play4Equality">
        <img src="../assets/images/play4equality/main_screen.jpg" alt="Play4Equality">
        <img src="../assets/images/play4equality/social_media_pictures.jpg" alt="Play4Equality">
        <img src="../assets/images/play4equality/ana_videochat.jpg" alt="Play4Equality">
        <img src="../assets/images/play4equality/camera_photo.jpg" alt="Play4Equality">
      </div>
      <p style="font-size:0.8125rem; color:var(--text-muted); margin-top:var(--s1);">
        Art by <a href="https://biankatdraws.artstation.com/projects/B3Rdg4" target="_blank" rel="noopener noreferrer">Bianca Milanez</a>.
      </p>
    `,
  },
  {
    id: 'animation-placeholder-01',
    title: 'Your Animation Project',
    discipline: 'screen',
    category: 'animation',
    description: 'A short description of this animated piece.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: '',
  },

  /* ── STAGE ────────────────────────────────────────── */
  {
    id: 'lisbon-players',
    title: 'The Lisbon Players',
    discipline: 'stage',
    category: 'theatre',
    description: 'Twelve productions with The Lisbon Players over two and a half years, in roles spanning lighting design, acting, direction, composition, and writing.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: `
      <p>From 2016 to 2019 I was actively involved in twelve productions with <strong>The Lisbon Players</strong> —
      Lisbon's English-speaking theatre company, based at <strong>Estrela Hall</strong>. My roles varied from
      production to production, spanning lighting design, acting, singing, directing, composing, writing,
      and accompanying rehearsals on piano.</p>

      <table class="production-table">
        <tr>
          <td class="col-title">The Mikado</td>
          <td class="col-role">Actor · Singer · Rehearsal Pianist</td>
          <td class="col-date">Dec 2016</td>
        </tr>
        <tr>
          <td class="col-title">The Bear</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Mar 2017</td>
        </tr>
        <tr>
          <td class="col-title">The Stone Flower</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Mar 2017</td>
        </tr>
        <tr>
          <td class="col-title">John Gabriel Borkman</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Apr 2017</td>
        </tr>
        <tr>
          <td class="col-title">Much Ado About Nothing</td>
          <td class="col-role">Lighting Operator</td>
          <td class="col-date">Jun 2017</td>
        </tr>
        <tr>
          <td class="col-title">Play On</td>
          <td class="col-role">Actor · Singer</td>
          <td class="col-date">Jul 2017</td>
        </tr>
        <tr>
          <td class="col-title">The Maids</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Oct 2017</td>
        </tr>
        <tr>
          <td class="col-title"><a href="#freedom-again">Freedom Again ↗</a></td>
          <td class="col-role">Director · Composer · Writer</td>
          <td class="col-date">Feb 2018</td>
        </tr>
        <tr>
          <td class="col-title">Diary of Anne Frank</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Jun 2018</td>
        </tr>
        <tr>
          <td class="col-title">Sitting Duck</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Oct 2018</td>
        </tr>
        <tr>
          <td class="col-title">Henry IV</td>
          <td class="col-role">Composer</td>
          <td class="col-date">Feb 2019</td>
        </tr>
        <tr>
          <td class="col-title">R.U.R.</td>
          <td class="col-role">Lighting Designer</td>
          <td class="col-date">Jun 2019</td>
        </tr>
      </table>

      <h3>Photos</h3>

      <div class="image-grid image-grid--masonry" style="--masonry-cols:3">
        <img src="../assets/images/lisbon-players/mikado_rehearsal_1.jpg" alt="The Mikado — rehearsal">
        <img src="../assets/images/lisbon-players/mikado_rehearsal_2.jpg" alt="The Mikado — rehearsal">
        <img src="../assets/images/lisbon-players/mikado_performence_1.jpg" alt="The Mikado — performance">
        <img src="../assets/images/lisbon-players/mikado_performance_2.jpg" alt="The Mikado — performance">
        <img src="../assets/images/lisbon-players/mikado_performance_3.jpg" alt="The Mikado — performance">
        <img src="../assets/images/lisbon-players/mikado_backstage_1.jpg" alt="The Mikado — backstage">
        <img src="../assets/images/lisbon-players/mikado_performance_4.jpg" alt="The Mikado — performance">
        <img src="../assets/images/lisbon-players/mikado_performance_5.jpg" alt="The Mikado — performance">
        <img src="../assets/images/lisbon-players/mikado_backstage_2.jpg" alt="The Mikado — backstage">
        <img src="../assets/images/lisbon-players/bear_performance_1.jpg" alt="The Bear — performance">
        <img src="../assets/images/lisbon-players/borkman_crew_1.jpg" alt="John Gabriel Borkman — crew">
        <img src="../assets/images/lisbon-players/playon_performance_1.jpg" alt="Play On — performance">
        <img src="../assets/images/lisbon-players/programmes_lisbonplayers.jpg" alt="The Lisbon Players — programmes">
        <img src="../assets/images/lisbon-players/freedomagain_rehearsal_1.jpg" alt="Freedom Again — rehearsal">
        <img src="../assets/images/lisbon-players/freedomagain_rehearsal_2.jpg" alt="Freedom Again — rehearsal">
        <img src="../assets/images/lisbon-players/freedomagain_crew.jpg" alt="Freedom Again — crew">
      </div>
    `,
  },
  {
    id: 'freedom-again',
    title: 'Freedom Again',
    discipline: 'stage',
    category: 'musicals',
    description: 'An original musical/opera set against the independence of Portugal\'s African colonies. Performed at Estrela Hall, Lisbon, February 2018.',
    url: '#',
    thumbnail: 'assets/images/freedom-again/rehearsal_cast_2018.webp',
    coverPosition: 'center  45%',
    featured: true,
    content: `
      <p>Freedom Again is a musical/opera composed and written by me between late 2010 and early 2012,
      influenced by Les Misérables and Phantom of the Opera.</p>

      <p>After five years on stall, I got the attention of <strong>Jon Luxton</strong>, a former 1st Hornist
      in the Gulbenkian Orchestra and musical director, and <strong>Suresh Nampuri</strong>, a theatre
      director and writer who were interested in helping me bring Freedom Again to stage.</p>

      <p>In 2017 I rewrote over a quarter of the project and transcribed the piano score to full orchestra
      before submitting a proposal to <strong>The Lisbon Players</strong>, an English-speaking theatre
      company, for the following season — with me as the director and with the cooperation of Jon Luxton
      as musical director and Suresh Nampuri as artistic director.</p>

      <p>Freedom Again was finally presented on stage at <strong>Estrela Hall</strong>,
      home of The Lisbon Players, in <strong>February 2018</strong>.</p>

      <p><strong>Book, Music &amp; Lyrics</strong> Filipe Thomaz<br>
      <strong>Musical Director</strong> Jon Luxton<br>
      <strong>Artistic Director</strong> Suresh Nampuri<br>
      <strong>First performed at</strong> Estrela Hall, Lisbon · February 2018</p>

      <h3>The Story</h3>

      <p>The narrative revolves around multiple characters whose lives intertwine amidst an historic event:
      the independence of Portugal's African colonies. A story about people at its core, it combines
      dramatic and emotional elements with comedic ones — talking about innocence, light-heartedness,
      and how happiness can be found in the smallest thing, as well as poverty, racism, war, and distrust.</p>

      <h3>The Scale</h3>

      <p>The final project consisted of a script with over <strong>100 pages</strong> and
      <strong>300 pages of orchestral score</strong>, which amounted to over <strong>600 pages</strong>
      of individual instrument sheet music.</p>

      <div class="image-grid image-grid--masonry" style="--masonry-cols:3">
        <img src="../assets/images/freedom-again/programme_cover_2018.webp" alt="Freedom Again — Programme Cover, 2018">
        <img src="../assets/images/freedom-again/rehearsal_cast_2018.webp" alt="Freedom Again — full cast rehearsal, 2018">
        <img src="../assets/images/freedom-again/rehearsal_alberto_2018.webp" alt="Freedom Again — rehearsal, 2018">
        <img src="../assets/images/freedom-again/rehearsal_freddiecatarina_2018.webp" alt="Freedom Again — rehearsal, 2018">
        <img src="../assets/images/freedom-again/rehearsal_martafreddie_2018.webp" alt="Freedom Again — rehearsal, 2018">
        <img src="../assets/images/freedom-again/rehearsal_martaeva_2018.webp" alt="Freedom Again — rehearsal, 2018">
      </div>

      <!-- Add more photos here as you collect them: -->
      <!-- <img src="../assets/images/freedom-again/your-photo.webp" alt="Description"> -->

      <!-- Add an audio sample when ready: -->
      <!--
      <h3>Listen</h3>
      <audio controls style="width:100%; margin: var(--s3) 0;">
        <source src="../assets/audio/freedom-again-sample.mp3" type="audio/mpeg">
      </audio>
      -->
    `,
  },

  /* ── PRINT ────────────────────────────────────────── */
  {
    id: 'the-lighthouse',
    title: 'The Lighthouse',
    discipline: 'print',
    category: 'writing',
    description: 'A short story born from the universe of Into A Dream — about two lighthouse keepers whose communication slowly fades, told through diary entries.',
    url: 'https://fthomaz.substack.com/p/the-lighthouse?', // ← replace with the link to the first entry
    thumbnail: 'assets/images/lighthouse/thumbnail.jpg',
    coverPosition: 'center 45%',
    featured: false,
    content: `
      <p><b>The Lighthouse</b> is a short story first mentioned in <a href="../work/screen.html#into-a-dream">Into A Dream</a>,
      my solo-developed video game. It is a story within a story — written by the wife of the protagonist, Rita.
      She describes it in-game as a story about two lighthouse keepers who started communicating with one another
      using light signs. Eventually that communication starts fading over time; <em>"the despair of the one who
      was trying to communicate and the pain of the one who just… couldn't do it"</em>.</p>

      <p>The concept left many players of Into A Dream's demo intrigued and excited, so I decided to actually
      write it as a short story and offer it as a <strong>crowdfunding perk</strong>.</p>

      <p>The short story is told through diary entries written by a woman — a representation of Rita herself.
      The first entry can be read here:
      <a href="https://fthomaz.substack.com/p/the-lighthouse?" target="_blank" rel="noopener noreferrer">The Lighthouse ↗</a>.</p>
    `,
  },

  {
    id: 'jovem-indefinicao',
    title: 'Jovem (In)Definição',
    discipline: 'print',
    category: 'writing',
    description: 'A collection of over a hundred poems in Portuguese and English, written between 2011 and 2020 — a decade of youth, roughly from 19 to 29.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: `
      <p><em>Jovem (In)Definição</em> — roughly, <em>(Un)Certainty of Youth</em> — is a collection of
      over a hundred poems written between 2011 and 2020, in Portuguese and English, across the stretch
      of a decade that began at nineteen and ended at twenty-nine.</p>

      <p>The title holds the tension the poems live in: <em>jovem</em> means young, and
      <em>(in)definição</em> collapses definition and indefinition into the same word — the clarity and
      the blur of it, the urgency to become something and the creeping suspicion that you don't quite
      know what. These are poems written by someone still finding out.</p>

      <p>They range widely in form and register — sparse and imagistic, sprawling and confessional,
      tender, sardonic, occasionally absurd. Some were written in an afternoon; others carried for years
      before they found their last line. What ties them together is less a theme than a period: the
      particular restlessness of being young and paying close attention.</p>
    `,
  },

  /* ── MUSIC ────────────────────────────────────────── */
    {
    id: 'walking-in-the-woods',
    title: 'Walking in the Woods',
    discipline: 'music',
    category: 'compositions',
    description: 'A concept album written in 2010–2011 about an ill man who, approaching death, relives his life in a series of flashbacks.',
    url: '#',
    thumbnail: 'assets/images/walking-in-the-woods/thumbnail.png',
    coverPosition: 'center  40%',
    featured: true,
    content: `
      <p><em>Walking in the Woods</em> is a concept album I wrote in 2010 and 2011 for a band I was in at
      the time. It tells the story of a man who, gravely ill and approaching the end of his life,
      begins to relive his memories in a series of emotional flashbacks — tracing the arc of a life
      from its brightest moments to its most painful.</p>

      <p>Only <strong>Part 1</strong> was completed, covering the years from early childhood through
      college. The songs explore the lightness and innocence of youth, the quiet fears and unanswerable
      questions that begin to surface in adolescence — about the future, about existence itself — and
      the withdrawal, isolation, and sadness that can accompany growing up. The album was heavily drawn
      from personal experience.</p>

      <p>It was never formally recorded. A few songs exist as <strong>acoustic renditions</strong>, but
      the album lives, for now, as a written score and a collection of lyrics waiting for the right
      moment.</p>

      <h3>Sample Songs</h3>
      <div class="embed-wrapper">
        <iframe width="100%" height="166" scrolling="no" frameborder="no"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%3Atracks%3A2279890088%3Fsecret_token%3Ds-nC8UL2LCEs1&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"">
        </iframe>
      </div>

      <!-- Add audio when ready:
      <h3>Listen</h3>
      <audio controls style="width:100%; margin: var(--s3) 0;">
        <source src="../assets/audio/walking-in-the-woods-sample.mp3" type="audio/mpeg">
      </audio>
      -->
    `,
  },
  
  
  {
    id: 'freedom-again-score',
    title: 'Freedom Again',
    discipline: 'music',
    category: 'compositions',
    description: 'Full orchestral score for an original musical/opera. 300 pages of score, 600+ pages of individual parts across a full orchestra.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: `
      <p>Freedom Again is a full original composition for orchestra and voices — 300 pages of orchestral
      score and over 600 pages of individual instrument parts, originally written for piano and
      later transcribed for full orchestra in 2017.</p>

      <p>The complete production — including the story, staging, and production history —
      lives in <a href="../work/stage.html#freedom-again">Stage → Freedom Again</a>.</p>

      <!-- Add an audio sample when ready: -->
      <!--
      <audio controls style="width:100%; margin: var(--s3) 0;">
        <source src="../assets/audio/freedom-again-sample.mp3" type="audio/mpeg">
      </audio>
      -->
    `,
  },

  /* ── WORLDBUILDING ────────────────────────────────── */
  {
    id: 'world-placeholder-01',
    title: 'Your World',
    discipline: 'worldbuilding',
    category: 'lore',
    description: 'A short description of this world — genre, scope, or central idea.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: `
      <p>Describe the world: its genre, the central tensions, history, factions.
      This is where worldbuilding really shines — write as much as you want.</p>
      <p>Add maps, character illustrations, excerpts from your lore documents.</p>
    `,
  },
  {
    id: 'world-placeholder-02',
    title: 'World Map / Atlas',
    discipline: 'worldbuilding',
    category: 'maps',
    description: 'A cartographic or diagrammatic exploration of a fictional geography.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: '',
  },

  /* ── TECH ─────────────────────────────────────────── */
  {
    id: 'tech-design-01',
    title: 'Your Design Project',
    discipline: 'tech',
    category: 'design',
    description: 'A short description — product, brand, or UI/UX work.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: `
      <p>Describe the design challenge, your process, and the outcome.
      Include screenshots, mockups, or a Figma embed.</p>
    `,
  },
  {
    id: 'tech-dev-01',
    title: 'Your Dev Project',
    discipline: 'tech',
    category: 'development',
    description: 'A short description — app, library, or tool you built.',
    url: '#',
    thumbnail: '',
    featured: false,
    content: '',
  },
  {
    id: 'biosurfit',
    title: 'Biosurfit',
    discipline: 'tech',
    category: 'engineering',
    description: 'Lead developer of the optical detection system and HbA1c cartridge within the spinit® — a centrifugal microfluidic point-of-care diagnostics platform. Co-author of 4 international patents.',
    url: 'https://www.biosurfit.com',
    thumbnail: 'assets/images/biosurfit/thumbnail.png',
    coverPosition: 'center 55%',
    featured: false,
    content: `
      <p><a href="https://www.biosurfit.com" target="_blank" rel="noopener noreferrer">Biosurfit</a> is a
      Portuguese point-of-care diagnostics company behind the <strong>spinit®</strong> — a centrifugal
      microfluidic lab-on-disc platform capable of performing haematology, immunoassay, and clinical chemistry
      tests from a single drop of blood, with results in 6 to 15 minutes.</p>

      <p>The spinit cartridge is a plastic, DVD-like disposable disc. When loaded into the reader, it spins at
      a controlled velocity: centrifugal force drives the blood sample through integrated microfluidic channels
      that handle preparation, reagent mixing, aliquoting, and delivery to the detection zones — all
      automatically, in a single disposable unit.</p>

      <h3>Optical Detection System</h3>

      <p>I was the <strong>lead developer of the spectrophotometric detection system prototype</strong> within the spinit
      reader. This subsystem uses a light source, diffuser, and photodetector array to measure light absorption
      and scattering as sample chambers pass through the beam during rotation — enabling real-time, continuous
      optical measurement without stopping the disc. I was responsible for the full development cycle: optical
      design, embedded software, signal processing, and integration with the broader instrument platform.</p>

      <h3>HbA1c Cartridge</h3>

      <p>I was a <strong>team leader, engineer and product manager during the development of the HbA1c cartridge</strong> — a key
      commercial product for Biosurfit. HbA1c (glycated haemoglobin) reflects average blood glucose levels
      over the previous three months, making it the gold standard for diagnosing and monitoring diabetes.
      The spinit HbA1c cartridge delivers a IFCC- and NGSP-certified result from 0.008 ml of blood in
      6 minutes, with CE Mark approval for in-vitro diagnostic use.</p>

      <h3>Patents</h3>

      <p>I am a co-author of four international patents filed during my time at <b>Biosurfit</b>:</p>

      <p>
        <strong><a href="https://patents.google.com/patent/WO2019002321A1" target="_blank" rel="noopener noreferrer">WO2019002321A1</a> — Integrated Quality Control Device</strong><br>
        Embeds a dried analyte of known concentration directly inside the assay disc. When liquid is added,
        the internal control reconstitutes automatically — eliminating the need for separate external control
        reagents and providing built-in quality assurance at point of care.
      </p>

      <p>
        <strong><a href="https://patents.google.com/patent/WO2019043250A1" target="_blank" rel="noopener noreferrer">WO2019043250A1</a> — Detection System</strong><br>
        An optical detection system using a diffuser positioned between the light source and the assay
        device. The diffuser spreads illumination over a wider solid angle, improving signal-to-noise
        consistency across reader units and reducing manufacturing tolerance requirements.
      </p>

      <p>
        <strong><a href="https://patents.google.com/patent/WO2019048429A1" target="_blank" rel="noopener noreferrer">WO2019048429A1</a> — Detection Method</strong><br>
        A method for taking optical measurements continuously during disc rotation rather than at discrete
        stop points — measuring light absorption, scattering, or reflectance as chambers pass through the
        beam in real time, reducing assay time and complexity.
      </p>

      <p>
        <strong><a href="https://patents.google.com/patent/WO2019076881A2" target="_blank" rel="noopener noreferrer">WO2019076881A2</a> — Adaptive PID Control</strong><br>
        An adaptive proportional-integral-derivative control method where gains adjust dynamically based on
        actual system state rather than fixed preset values — enabling more consistent motor and spin
        control across individual reader units without manual calibration.
      </p>
    `,
  },

];
