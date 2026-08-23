/* =====================================================================
   BSDS ARCHIVE — SHARED APPLICATION SCRIPT
   =====================================================================
   Loaded on every page, AFTER that page's js/data/*.js file(s) (e.g.
   js/data/sem1.js on semester1.html, js/data/semester-list.js on
   semesters.html — see each HTML file's <script> tags).

   This file is organised as small, independent functions. Each page
   calls only the functions it needs at the bottom, inside the
   `DOMContentLoaded` listener. Read top-to-bottom:

     1.  initScatter()          — ambient floating dots background
     2.  initScrollReveal()     — fades elements in as you scroll to them
     3.  initMobileNav()        — hamburger menu open/close
     4.  initDrawer()           — the "materials" popup modal
     5.  renderSemesterTimeline() — builds the semesters.html picker
     6.  loadAnnouncements()    — fetches + parses a data/*.txt file
     7.  initSemesterPage()     — builds Materials/Syllabus/Timetable/
                                   Announcements/Calendar tabs on a
                                   semesterN.html page
     8.  initViewer()           — the PDF reader on viewer.html
     9.  small helpers at the bottom (date formatting, icons, etc.)
   ===================================================================== */


/* ---------------------------------------------------------------------
   SCROLL LOCK HELPER (shared by the mobile nav and the materials drawer)
   Plain `overflow:hidden` on <body> does NOT reliably stop background
   scrolling on iOS Safari — the page can still rubber-band underneath
   an open modal, which is what makes a drawer/menu feel like it's not
   "scaling" properly. This pins the body in place with `position:fixed`
   instead, which is the standard reliable fix, then restores the exact
   scroll position on unlock. A counter means the nav and the drawer can
   never fight over unlocking each other.
--------------------------------------------------------------------- */
let _scrollLockCount = 0;
let _scrollLockY = 0;

function lockBodyScroll() {
  if (_scrollLockCount === 0) {
    _scrollLockY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  }
  _scrollLockCount++;
}

function unlockBodyScroll() {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount === 0) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, _scrollLockY);
  }
}


/* ---------------------------------------------------------------------
   1. AMBIENT SCATTER BACKGROUND
   Sprinkles a handful of soft dots across the page that drift up and
   down forever. Purely decorative — safe to delete if you want a
   flatter background.
--------------------------------------------------------------------- */
function initScatter(count = 46) {
  const el = document.getElementById('scatter');
  if (!el) return;
  // Fewer dots on small screens keeps things light on low-power phones.
  const n = window.innerWidth < 600 ? Math.round(count * 0.5) : count;
  for (let i = 0; i < n; i++) {
    const dot = document.createElement('span');
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.animation = `float ${8 + Math.random() * 10}s ease-in-out ${Math.random() * 6}s infinite`;
    el.appendChild(dot);
  }
}


/* ---------------------------------------------------------------------
   2. SCROLL REVEAL
   Adds the `.in` class to any element matching `selector` once it
   scrolls into view. The CSS for `.in` (see styles.css) plays a fade
   + rise animation. Call again whenever you inject new elements
   (e.g. after building cards dynamically).

   Includes a defensive fallback: if, for any reason, an element never
   intersects (e.g. it's inside a container with unusual overflow, or
   the browser's IntersectionObserver behaves oddly), it's forced
   visible after 1.2s anyway — so content can never get permanently
   stuck invisible on a device we didn't test on.
--------------------------------------------------------------------- */
function initScrollReveal(selector) {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach((item) => io.observe(item));

  // safety net — see comment above
  setTimeout(() => items.forEach((item) => item.classList.add('in')), 1200);
}


/* ---------------------------------------------------------------------
   3. MOBILE NAV (hamburger menu)
   Expects:
     #navToggle  — the hamburger button (three <span class="bar">s)
     #navLinks   — the <nav> that slides in from the right
     #navBackdrop — a dimmed backdrop behind the nav

   Handles: opening/closing, tapping the backdrop to close, pressing
   Escape to close, closing automatically when a link is tapped, and
   closing automatically if the window is resized back up to desktop
   width (so it can't get stuck open after rotating a tablet, etc).
--------------------------------------------------------------------- */
function initMobileNav() {
  const btn = document.getElementById('navToggle');
  const nav = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.classList.toggle('open', open);
    if (open) lockBodyScroll(); else unlockBodyScroll();
  }

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

  if (backdrop) backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });

  // closing on link tap covers in-page anchors (#announcements, #timeline)
  // as well as links to other pages
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // if the viewport grows past the mobile breakpoint while the menu is
  // open (rotating a tablet, resizing a browser window), close it so it
  // doesn't stay stuck open in the desktop layout
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) setOpen(false);
  });
}


/* ---------------------------------------------------------------------
   3b. FILTER / SEARCH BOX
   Generic client-side filter, reused for the Materials grid and every
   Announcements grid. Reads each item's data-search attribute if it has
   one (set explicitly where the visible text alone isn't enough to
   search against — see _renderMaterials()), otherwise falls back to
   the item's own visible textContent.
--------------------------------------------------------------------- */
function initFilterBox(inputId, itemSelector) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(itemSelector).forEach((el) => {
      const haystack = (el.dataset.search || el.textContent).toLowerCase();
      el.style.display = (!q || haystack.includes(q)) ? '' : 'none';
    });
  });
}


/* ---------------------------------------------------------------------
   3c. FIXED HEADER HEIGHT SYNC
   header.topbar is position:fixed (see base.css) so it can never scroll
   away, which means it's no longer in normal document flow — without
   this, page content would render right underneath it. This measures
   the header's actual rendered height and pushes <body> down to match,
   recalculating on resize and once more after the page fully loads (web
   fonts swapping in late can shift the header's height by a few px).
   Call once, on DOMContentLoaded, on every page that has the header.
--------------------------------------------------------------------- */
function initFixedHeader() {
  const header = document.querySelector('header.topbar');
  if (!header) return;
  const sync = () => { document.body.style.paddingTop = header.offsetHeight + 'px'; };
  sync();
  window.addEventListener('resize', _debounce(sync, 150));
  window.addEventListener('load', sync);
}


/* ---------------------------------------------------------------------
   3d. CONTACT FORM (contact.html)
   Submits to Formspree via fetch instead of a plain browser POST, so a
   successful send shows an inline confirmation right on the page rather
   than redirecting away to Formspree's own generic thank-you page.
   Requires the form's action="" to already point at a real Formspree
   endpoint (https://formspree.io/f/YOUR_FORM_ID) — see the comment in
   contact.html for setup.
--------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form.action.includes('YOUR_FORM_ID')) {
      status.textContent = "This form isn't connected yet — see the comment above it in contact.html.";
      status.className = 'form-status error';
      return;
    }

    status.textContent = 'Sending…';
    status.className = 'form-status';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        status.textContent = "Thanks — we'll get back to you soon.";
        status.className = 'form-status success';
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        status.textContent = (data && data.errors)
          ? data.errors.map((err) => err.message).join(', ')
          : 'Something went wrong — try again, or email us directly.';
        status.className = 'form-status error';
      }
    } catch (err) {
      status.textContent = 'Network error — check your connection and try again.';
      status.className = 'form-status error';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}


/* ---------------------------------------------------------------------
   4. MATERIALS DRAWER (modal)
   Expects `<div class="overlay" id="overlay"><div class="drawer"
   id="drawer"></div></div>` somewhere in the page. Call
   `openDrawer(subjectDataObject)` from a card's click handler.
--------------------------------------------------------------------- */
function initDrawer() {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDrawer(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeDrawer();
  });
}

let _lastFocusedBeforeDrawer = null;

function openDrawer(subject) {
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  if (!overlay || !drawer) return;

  drawer.style.setProperty('--accent', `var(--${subject.accent})`);

  let html = `
    <div class="drawer-head">
      <div>
        <span class="code">${subject.code}</span>
        <h3>${subject.title}</h3>
        <p>${subject.desc}</p>
      </div>
      <button class="close-btn" id="closeBtn" aria-label="Close">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
    <div class="drawer-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input type="search" id="drawerSearch" class="search-box" placeholder="Search within ${subject.title}…">
    </div>`;

  subject.categories.forEach((cat, idx) => {
    html += `<div class="cat" style="animation-delay:${0.08 + idx * 0.09}s">
      <h4>${cat.name}</h4>
      ${cat.items.map((it, itemIdx) => _renderItemRow(cat.name, it, subject, idx, itemIdx)).join('')}
    </div>`;
  });

  drawer.innerHTML = html;
  _lastFocusedBeforeDrawer = document.activeElement;
  overlay.classList.add('open');
  lockBodyScroll();
  document.getElementById('closeBtn').addEventListener('click', closeDrawer);
  document.getElementById('closeBtn').focus();

  // wire up each material row to expand/collapse its Download + Open actions
  drawer.querySelectorAll('.item').forEach((btn) => btn.addEventListener('click', () => _toggleItemActions(btn)));
  _wireDrawerSearch();
}

// filters this course's material rows as you type, and hides a whole
// category (e.g. "Assignments") if none of its rows currently match —
// unlike the page-level search boxes, this one also collapses those
// now-empty category headers rather than leaving them dangling
function _wireDrawerSearch() {
  const input = document.getElementById('drawerSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('#drawer .cat').forEach((cat) => {
      let anyVisible = false;
      cat.querySelectorAll('.item-row').forEach((row) => {
        const match = !q || row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      cat.style.display = anyVisible ? '' : 'none';
    });
  });
}

function closeDrawer() {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  unlockBodyScroll();
  if (_lastFocusedBeforeDrawer) _lastFocusedBeforeDrawer.focus();
}

// Builds one material row. If the item has a `file` path, tapping it reveals
// Download + Open buttons. Without a `file` path, it reveals a plain
// "not uploaded yet" note instead — so the list can be built out ahead of
// actually having the PDFs ready.
function _renderItemRow(categoryName, item, subject, catIdx, itemIdx) {
  const rowId = `item-${catIdx}-${itemIdx}`;
  const hasFile = !!item.file;
  const viewerUrl = hasFile
    ? `viewer.html?file=${encodeURIComponent(item.file)}&title=${encodeURIComponent(item.t + ' — ' + subject.title)}`
    : '#';

  return `
    <div class="item-row">
      <button class="item" id="${rowId}" aria-expanded="false" aria-controls="${rowId}-actions">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${_categoryIcon(categoryName)}</svg>
        <span class="t-text">${item.t}</span>
        <span class="meta">${item.m}</span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <div class="item-actions-wrap" id="${rowId}-actions">
        <div class="item-actions">
          <div class="item-actions-inner">
            ${hasFile ? `
              <a class="action-btn" href="${item.file}" download>
                ${_downloadIcon()} Download
              </a>
              <a class="action-btn primary" href="${viewerUrl}">
                ${_openIcon()} Open
              </a>
            ` : `<span class="action-empty">Not uploaded yet — add a "file" path in this semester's js/data/semN.js file</span>`}
          </div>
        </div>
      </div>
    </div>`;
}

function _toggleItemActions(btn) {
  const wrap = document.getElementById(btn.id + '-actions');
  if (!wrap) return;
  const willOpen = !wrap.classList.contains('open');
  wrap.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', String(willOpen));
}

// small icon set used inside the drawer, keyed by category name
function _categoryIcon(name) {
  const icons = {
    "Lecture Notes": `<path d="M4 3h11l5 5v13H4z"/><path d="M15 3v5h5"/>`,
    "Assignments": `<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>`,
    "Previous Year Papers": `<path d="M6 4h9l5 5v11H6z"/><circle cx="13" cy="14" r="3"/><path d="M13 12v2l1.2 1.2"/>`,
    "Reference Reading": `<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z"/><path d="M17 4v16"/>`,
  };
  return icons[name] || `<circle cx="12" cy="12" r="9"/>`;
}

function _downloadIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>`;
}

function _openIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h7v2H6v12h12v-5h2v7H4z"/><path d="M13 3h8v8h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H13z"/></svg>`;
}


/* ---------------------------------------------------------------------
   5. HOMEPAGE — semester timeline
   Reads SEMESTER_LIST (from js/data/semester-list.js) and builds the
   vertical timeline rows on semesters.html.
--------------------------------------------------------------------- */
function renderSemesterTimeline(containerId = 'rows') {
  const container = document.getElementById(containerId);
  if (!container || typeof SEMESTER_LIST === 'undefined') return;

  SEMESTER_LIST.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 't-row' + (s.href ? ' available' : '');
    row.style.animationDelay = (i * 0.08) + 's';

    const tagHtml = s.courses.map((c) => `<span class="tag">${c}</span>`).join('');
    const inner = `
      <div class="t-main">
        <h3>Semester ${s.num}</h3>
        <div class="t-tags">${tagHtml}</div>
      </div>
      <div class="t-side">
        <span class="status ${s.href ? 'on' : 'off'}">${s.href ? 'Available' : 'Coming soon'}</span>
        ${s.href ? `<svg class="t-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>` : ''}
      </div>`;

    row.innerHTML = `
      <div class="t-node">${String(i + 1).padStart(2, '0')}</div>
      ${s.href
        ? `<a class="t-entry" href="${s.href}">${inner}</a>`
        : `<div class="t-entry" aria-disabled="true">${inner}</div>`}`;
    container.appendChild(row);
  });

  initScrollReveal('.t-row');
}



/* ---------------------------------------------------------------------
   6. ANNOUNCEMENTS
   Fetches data/announcements.txt as plain text and parses it with a
   very small, forgiving format (see the comment block at the top of
   that file). Renders one card per entry, most recent first.

   IMPORTANT — fetch() needs a real HTTP server. If you just double
   click index.html and open it as a file:// URL, most browsers block
   this fetch for security reasons and you'll see the friendly error
   message below instead of your announcements. Fixes:
     • Run `python3 -m http.server` inside the site folder, then open
       http://localhost:8000
     • Or upload the folder to any static host (GitHub Pages, Netlify,
       Vercel, etc.) — fetch works normally there.
--------------------------------------------------------------------- */
async function loadAnnouncements(path = 'data/announcements.txt', containerId = 'announcementsList') {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('File not found (' + res.status + ')');
    const text = await res.text();
    const entries = _parseAnnouncements(text);

    if (!entries.length) {
      container.innerHTML = `<p class="announce-empty">No announcements yet. Add one to <code>${path}</code>.</p>`;
      return;
    }

    container.innerHTML = entries.map((e, i) => `
      <div class="announce-card" style="animation-delay:${i * 0.08}s">
        <span class="a-date">${e.date}</span>
        ${e.author ? `<span class="a-author">Posted by ${e.author}</span>` : ''}
        <h4>${e.title}</h4>
        <p>${e.body}</p>
      </div>`).join('');

    initScrollReveal('.announce-card');
  } catch (err) {
    container.innerHTML = `
      <p class="announce-error">
        Couldn't load announcements from <code>${path}</code>.<br>
        This usually means the page was opened directly as a file
        instead of through a web server. Run <code>python3 -m http.server</code>
        in the site folder (or host it on GitHub Pages / Netlify) and reload.
      </p>`;
  }
}

// Parses the simple "### date | title | author" + body format described
// in data/announcements.txt (the "| author" part is optional). Returns
// entries sorted newest-first.
function _parseAnnouncements(text) {
  const blocks = text.split(/\n(?=### )/).filter((b) => b.trim().startsWith('###'));
  const entries = blocks.map((block) => {
    const lines = block.trim().split('\n');
    const header = lines[0].replace(/^###\s*/, '');
    const [datePart, titlePart, authorPart] = header.split('|').map((p) => (p || '').trim());
    return {
      date: datePart || '',
      title: titlePart || 'Untitled',
      author: authorPart || '',
      body: lines.slice(1).join('\n').trim(),
      _sortKey: Date.parse(datePart || '') || 0,
    };
  });
  entries.sort((a, b) => b._sortKey - a._sortKey);
  return entries;
}


/* ---------------------------------------------------------------------
   7. SEMESTER PAGE (Materials / Syllabus / Timetable / Announcements /
   Calendar)
   Call `initSemesterPage('sem1')` once, after the page has loaded.
   `key` must match a key attached to SEMESTER_DATA by a js/data/semN.js
   file (that file must be loaded, via a <script> tag, before this runs).
--------------------------------------------------------------------- */
function initSemesterPage(key) {
  const data = (typeof SEMESTER_DATA !== 'undefined') ? SEMESTER_DATA[key] : null;
  const grid = document.getElementById('cardGrid');

  if (!data) {
    // Friendly fallback for a semester page that's been wired up (tabs,
    // markup) before its js/data/semN.js content was actually filled in —
    // see the comment at the bottom of e.g. js/data/sem2.js.
    if (grid) grid.innerHTML = `<p class="announce-empty">This semester hasn't been published yet — check back soon.</p>`;
    console.warn('No SEMESTER_DATA found for key:', key);
    return;
  }

  _renderMaterials(data.materials);
  _renderSyllabus(data.syllabus);
  _renderTimetable(data.timetable);
  _renderCalendar(data.calendar);
  _initTabs();
  initDrawer();
  initScrollReveal('.card');
  initFilterBox('materialsSearch', '.card');
  initFilterBox('semAnnounceSearch', '#semAnnouncementsList .announce-card');

  // per-semester announcements — same component/format as the site-wide
  // feed on the homepage, just a different source file per semester
  loadAnnouncements(`data/${key}-announcements.txt`, 'semAnnouncementsList');
}

// --- 7a. Materials tab: one clickable card per course -------------
function _renderMaterials(materials) {
  const grid = document.getElementById('cardGrid');
  if (!grid || !materials) return;

  Object.entries(materials).forEach(([key, subj], i) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.subj = key;
    // includes every material's title too, not just the card's own visible
    // text, so searching for e.g. "Bayes" finds the Probability I card even
    // though that word only actually appears inside its (closed) drawer
    card.dataset.search = [
      subj.code, subj.title, subj.desc,
      ...subj.categories.flatMap((c) => c.items.map((it) => it.t)),
    ].join(' ').toLowerCase();
    card.style.animationDelay = (i * 0.08) + 's';
    card.setAttribute('aria-haspopup', 'dialog');
    card.innerHTML = `
      <span class="code">${subj.code}</span>
      <h3>${subj.title}</h3>
      <p>${subj.desc}</p>
      <svg class="glyph" viewBox="0 0 64 40">${subj.glyph}</svg>
      <div class="cta">Open materials
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </div>`;
    card.addEventListener('click', () => openDrawer(subj));
    grid.appendChild(card);
  });
}

// --- 7b. Syllabus tab: accordion of units per course -----------------
// A course's syllabus can be shaped two ways:
//   1. Flat — { course, accent, units:[...] } — a single numbered list.
//      This is what Statistics/Probability/Economics I use.
//   2. Grouped — { course, accent, groups:[{heading, units:[...]}, ...] }
//      — one or more named sub-sections, each with its OWN numbering
//      restarting at 1. Use this when a course's actual syllabus is
//      itself split into named parts, e.g. Mathematics I here being
//      "One Variable Calculus" + "Linear Algebra" rather than one
//      undifferentiated list of 15 units.
// A course only needs whichever one actually matches its real syllabus.
function _renderSyllabus(syllabus) {
  const wrap = document.getElementById('syllabusList');
  if (!wrap || !syllabus) return;

  wrap.innerHTML = syllabus.map((course, i) => `
    <details class="syllabus-course" ${i === 0 ? 'open' : ''} style="--accent:var(--${course.accent})">
      <summary>
        ${course.course}
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </summary>
      <div class="units">
        ${course.groups ? _renderSyllabusGroups(course.groups) : _renderSyllabusUnits(course.units)}
      </div>
    </details>`).join('');
}

function _renderSyllabusUnits(units) {
  return (units || []).map((u, idx) => `
    <div class="syllabus-unit">
      <span class="u-num">Unit ${idx + 1}</span>
      <span>${u}</span>
    </div>`).join('');
}

function _renderSyllabusGroups(groups) {
  return groups.map((g) => `
    <div class="syllabus-group">
      <h5 class="syllabus-group-heading">${g.heading}</h5>
      ${_renderSyllabusUnits(g.units)}
    </div>`).join('');
}

// --- 7c. Timetable tab: responsive scrollable table -----------------
function _renderTimetable(timetable) {
  const wrap = document.getElementById('timetableWrap');
  if (!wrap || !timetable) return;

  const dayKeys = timetable.days.map((d) => d.toLowerCase());
  const rowsHtml = timetable.rows.map((row) => {
    const cells = dayKeys.map((dk) => {
      const val = row[dk] || '';
      const isBreak = /break|lunch/i.test(val);
      const isFree = val === '';
      return `<td class="${isFree ? 'free' : ''}">${isBreak ? `<em>${val}</em>` : (val || '—')}</td>`;
    }).join('');
    return `<tr><td class="slot">${row.time}</td>${cells}</tr>`;
  }).join('');

  wrap.innerHTML = `
    <div class="table-scroll">
      <table class="timetable">
        <thead><tr><th>Time</th>${timetable.days.map((d) => `<th>${d}</th>`).join('')}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
    <p class="scroll-hint">Swipe sideways to see the full week →</p>`;
}

// --- 7d. Calendar tab: chronological list grouped by month ----------
function _renderCalendar(calendar) {
  const wrap = document.getElementById('calendarList');
  if (!wrap || !calendar) return;

  const sorted = [...calendar].sort((a, b) => new Date(a.date) - new Date(b.date));
  const groups = {};
  sorted.forEach((item) => {
    const d = new Date(item.date);
    const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    (groups[key] = groups[key] || []).push(item);
  });

  wrap.innerHTML = Object.entries(groups).map(([month, items]) => `
    <div class="cal-month">
      <h4>${month}</h4>
      ${items.map((item) => `
        <div class="cal-item">
          <span class="cal-date">${_formatCalendarDate(item)}</span>
          <span class="cal-title">${item.title}</span>
          <span class="cal-type ${item.type}">${item.type}</span>
        </div>`).join('')}
    </div>`).join('');
}

// `date` must always be a single real date — that's what sorting and
// month-grouping above rely on. For a multi-day entry (e.g. a study
// leave spanning several days), add a second "end" field rather than
// putting a range string into "date" itself — a range like
// "2026-12-05 - 2026-12-08" isn't something JavaScript's Date can
// parse, so it silently became "Invalid Date" everywhere. e.g.:
//   { date:"2026-12-05", end:"2026-12-08", title:"Study Leave", type:"holiday" }
function _formatCalendarDate(item) {
  const start = _shortDate(item.date);
  if (!item.end) return start;
  return `${start} – ${_shortDate(item.end)}`;
}

function _shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

// --- 7e. Tabs: switches which panel is visible -----------------------
function _initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  if (!tabs.length) return;

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== `panel-${btn.dataset.tab}`;
      });

      // re-trigger the fade-in animation on the newly shown panel
      const active = document.getElementById(`panel-${btn.dataset.tab}`);
      const inner = active && active.querySelector('.tab-panel-inner');
      if (inner) {
        inner.style.animation = 'none';
        void inner.offsetWidth; // force reflow so the animation restarts
        inner.style.animation = '';
      }
    });
  });
}


/* ---------------------------------------------------------------------
   8. PDF VIEWER (viewer.html)
   -----------------------------------------------------------------
   Renders a PDF using PDF.js (loaded from a CDN by viewer.html, before
   this file). Every page is stacked vertically in one continuously
   scrollable column — like Google Drive's preview — rather than one
   page at a time, so reading feels natural on both a phone (thumb
   scroll) and a desktop (mouse wheel/trackpad).

   Pages render lazily as they scroll near the viewport (via
   IntersectionObserver), not all at once — so a 40-page PDF doesn't
   stall the browser rendering pages nobody's looked at yet. Each
   page's box is still sized correctly up front (from a cheap metadata
   read, not a full render) so the scrollbar never jumps around.

   Alongside each page's canvas, an invisible text layer is built
   (via pdfjsLib.renderTextLayer) — this is what makes in-document
   search possible, and as a bonus lets people actually select/copy
   text out of the PDF, which a plain canvas render can't do.

   Two-finger pinch-to-zoom is left as the browser's normal, native
   page zoom (nothing here calls preventDefault on touch gestures or
   sets touch-action:none) — so pinching zooms the whole page, exactly
   like any other webpage, in addition to the in-app +/- zoom buttons
   which re-render the PDF itself at a new scale.

   Reads two things from the URL query string:
     ?file=<url-encoded relative path to a .pdf under files/>
     ?title=<url-encoded display name>  (optional)

   Call initViewer() once, on DOMContentLoaded, from viewer.html.
--------------------------------------------------------------------- */
let _pdfDoc = null;
let _pdfZoom = 1;              // user-controlled multiplier on top of the auto-fit scale
let _pdfBaseScale = 1;         // scale that makes a page exactly fill the stage width
let _pdfPageMeta = [];         // [{width,height}, ...] natural (scale:1) size of every page
let _pdfTextContentCache = []; // raw PDF.js TextContent object per page (reused for text layer + search)
let _pdfTextIndex = [];        // plain lowercase-searchable string per page, built from the cache above
let _pdfRenderedPages = new Set(); // page numbers already drawn to their canvas
let _pdfRenderObserver = null; // triggers lazy rendering as pages near the viewport
let _pdfVisibilityObserver = null; // tracks which page is "current" for the toolbar label
let _pdfCurrentPage = 1;
let _pdfSearchQuery = '';
let _pdfSearchMatchPages = [];      // page numbers containing the current query, in order
let _pdfSearchPageIndex = -1;       // which page, within _pdfSearchMatchPages, we're currently on
let _pdfSearchMarkIndexOnPage = -1; // which occurrence ON that page we're currently on
let _pdfScrollbarUpdate = null; // set by _initCustomScrollbar(); called by _resizeAllPages() after zoom

async function initViewer() {
  const params = new URLSearchParams(window.location.search);
  const fileParam = params.get('file');
  const titleParam = params.get('title');

  const titleEl = document.getElementById('viewerTitle');
  const downloadBtn = document.getElementById('viewerDownload');
  const statusEl = document.getElementById('viewerStatus');
  const pagesEl = document.getElementById('pdfPages');

  if (titleParam && titleEl) titleEl.textContent = titleParam;
  if (fileParam && downloadBtn) {
    downloadBtn.href = fileParam;
    downloadBtn.setAttribute('download', '');
  }

  _updateThemeToggleIcon(); // sync the icon with whatever the early <head> script already applied
  _syncViewerHeaderHeight(); // push PDF content down to clear the fixed header, before anything else loads

  if (!fileParam) {
    _showViewerError('No document was specified in the link.');
    return;
  }
  if (typeof pdfjsLib === 'undefined') {
    _showViewerError('The PDF engine failed to load — check your internet connection and reload.');
    return;
  }

  try {
    const task = pdfjsLib.getDocument(fileParam);
    // shows real download progress for large PDFs — without this, a big
    // file just sits on the spinner with no feedback, which is exactly
    // what reads as "stuck" or "not fetching" on a slower connection
    task.onProgress = (progress) => {
      if (progress.total) {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        _updateLoadingStatus(`Loading document… ${pct}%`);
      }
    };
    _pdfDoc = await task.promise;
  } catch (err) {
    _showViewerError(`
      Couldn't load this PDF at <code>${fileParam}</code>. If this works on a
      local server but not once it's deployed (e.g. on GitHub Pages), the
      most likely causes are:<br><br>
      • <strong>Case sensitivity</strong> — GitHub Pages' server is
      case-sensitive even if your own computer isn't. Double-check the
      "file" path in js/data/semN.js matches the real filename's
      capitalisation exactly.<br>
      • <strong>Git LFS</strong> — if this PDF is large and tracked with
      Git LFS, GitHub Pages can't serve LFS files correctly; it deploys a
      small text pointer instead of the actual PDF. Either keep large
      files under GitHub's 100MB limit without LFS, or host them
      elsewhere (a GitHub Release asset, cloud storage, etc.) and point
      "file" at that URL instead.<br>
      • The file genuinely hasn't been uploaded yet, or the site needs to
      be served through a real server rather than opened directly.
    `);
    return;
  }

  document.getElementById('pageTotal').textContent = _pdfDoc.numPages;

  // Read every page's natural dimensions AND text content up front (cheap —
  // metadata/text extraction only, no actual rendering) so placeholders can
  // be laid out correctly immediately, and search works instantly without
  // waiting for a page to scroll into view first. For a very long document
  // this loop is the main thing worth watching — the progress label below
  // is what tells you it's still working rather than stuck.
  _pdfPageMeta = [];
  _pdfTextContentCache = [];
  _pdfTextIndex = [];
  for (let n = 1; n <= _pdfDoc.numPages; n++) {
    _updateLoadingStatus(`Preparing page ${n} of ${_pdfDoc.numPages}…`);
    const page = await _pdfDoc.getPage(n);
    const vp = page.getViewport({ scale: 1 });
    _pdfPageMeta.push({ width: vp.width, height: vp.height });

    const textContent = await page.getTextContent();
    _pdfTextContentCache.push(textContent);
    _pdfTextIndex.push(textContent.items.map((it) => it.str).join(' ').toLowerCase());
  }

  _computeBaseScale();
  _buildPagePlaceholders();
  _setupPageObservers();
  _wireViewerControls();
  _initCustomScrollbar();
  _wireFullscreenButton();

  if (statusEl) statusEl.hidden = true;
  if (pagesEl) pagesEl.hidden = false;

  // re-fit to width on rotate/resize, keeping the user's zoom multiplier
  window.addEventListener('resize', _debounce(() => {
    _computeBaseScale();
    _resizeAllPages();
    _syncViewerHeaderHeight(); // header height can change (title wraps differently, etc.)
  }, 200));

  // fonts loading late can shift the header's height by a few px after
  // the very first sync — catch that instead of leaving a small gap/overlap
  window.addEventListener('load', _syncViewerHeaderHeight);
}

// Measures the fixed header/toolbar/search-bar wrapper's real rendered
// height and pushes the PDF stage down to match exactly, so content is
// never hidden underneath it. Called on load, on resize, and whenever
// the search bar opens/closes (since that changes the wrapper's height).
function _syncViewerHeaderHeight() {
  const head = document.getElementById('viewerFixedHead');
  const stage = document.getElementById('viewerStage');
  const scrollbar = document.getElementById('viewerScrollbar');
  if (!head || !stage) return;
  const h = head.offsetHeight;
  stage.style.paddingTop = h + 16 + 'px'; // +16 for a little breathing room
  if (scrollbar) scrollbar.style.top = h + 'px'; // scrollbar spans only the actual scrollable area, not behind the header
}

/* ---- 8c. Custom right-edge scrollbar -----------------------------------
   A real, always-visible drag-to-jump scrubber, like Google Drive's PDF
   preview — native scrollbars are invisible-by-design on mobile and
   inconsistent to style, so this replaces it entirely (the native one is
   hidden via CSS on .viewer-stage). Supports: dragging the thumb, clicking
   anywhere on the track to jump straight there, and a small "Page X / N"
   tooltip while dragging. Uses Pointer Events so the same code handles
   mouse, touch, and pen without separate branches.
--------------------------------------------------------------------------- */
function _initCustomScrollbar() {
  const stage = document.getElementById('viewerStage');
  const bar = document.getElementById('viewerScrollbar');
  const track = bar && bar.querySelector('.viewer-scrollbar-track');
  const thumb = document.getElementById('viewerScrollbarThumb');
  const tooltip = document.getElementById('viewerScrollbarTooltip');
  if (!stage || !bar || !track || !thumb) return;

  let dragging = false;
  let rafPending = false;

  function updateThumb() {
    const trackH = track.clientHeight;
    const scrollable = stage.scrollHeight - stage.clientHeight;
    if (scrollable <= 4) { bar.hidden = true; return; } // document fits on one screen — nothing to scrub
    bar.hidden = false;

    const thumbH = Math.max(32, (stage.clientHeight / stage.scrollHeight) * trackH);
    const maxThumbTop = trackH - thumbH;
    const thumbTop = Math.min(maxThumbTop, Math.max(0, (stage.scrollTop / scrollable) * maxThumbTop));

    thumb.style.height = thumbH + 'px';
    thumb.style.transform = `translateY(${thumbTop}px)`;
    if (tooltip) tooltip.style.top = (thumbTop + thumbH / 2) + 'px';
  }

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { updateThumb(); rafPending = false; });
  }
  _pdfScrollbarUpdate = scheduleUpdate;

  function jumpToClientY(clientY) {
    const rect = track.getBoundingClientRect();
    const thumbH = thumb.offsetHeight;
    const usable = rect.height - thumbH;
    const ratio = usable > 0 ? Math.min(1, Math.max(0, (clientY - rect.top - thumbH / 2) / usable)) : 0;
    const scrollable = stage.scrollHeight - stage.clientHeight;
    stage.scrollTop = ratio * scrollable;
  }

  function showTooltip() {
    if (!tooltip || !_pdfDoc) return;
    tooltip.textContent = `Page ${_pdfCurrentPage} / ${_pdfDoc.numPages}`;
    tooltip.classList.add('show');
  }
  function hideTooltip() { if (tooltip) tooltip.classList.remove('show'); }

  stage.addEventListener('scroll', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);

  thumb.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragging = true;
    thumb.classList.add('dragging');
    thumb.setPointerCapture(e.pointerId);
    showTooltip();
  });
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    jumpToClientY(e.clientY);
    showTooltip();
  });
  ['pointerup', 'pointercancel'].forEach((evt) => {
    thumb.addEventListener(evt, (e) => {
      dragging = false;
      thumb.classList.remove('dragging');
      if (thumb.hasPointerCapture(e.pointerId)) thumb.releasePointerCapture(e.pointerId);
      hideTooltip();
    });
  });

  // clicking (or tapping) anywhere else on the track jumps straight there —
  // this is the "instant navigation" part, no dragging required
  track.addEventListener('pointerdown', (e) => {
    if (e.target === thumb) return;
    jumpToClientY(e.clientY);
  });

  updateThumb();
}

function _showViewerError(message) {
  const statusEl = document.getElementById('viewerStatus');
  if (!statusEl) return;
  statusEl.innerHTML = `<div class="viewer-error">${message}<br><br><a href="javascript:history.back()">← Go back</a></div>`;
}

function _updateLoadingStatus(text) {
  const label = document.getElementById('statusLabel');
  if (label) label.textContent = text;
}

// fit-to-width scale, based on page 1's natural size and the stage's
// current width (capped at a comfortable reading width on wide desktops)
function _computeBaseScale() {
  const stage = document.getElementById('viewerStage');
  const naturalWidth = _pdfPageMeta[0].width;
  const available = Math.min(stage.clientWidth - 32, 900);
  _pdfBaseScale = available / naturalWidth;
}

// creates one placeholder <div class="pdf-page-wrap"> per page, correctly
// sized, each holding an (empty, until rendered) canvas + a page-number badge
function _buildPagePlaceholders() {
  const container = document.getElementById('pdfPages');
  container.innerHTML = '';
  const scale = _pdfBaseScale * _pdfZoom;

  _pdfPageMeta.forEach((meta, idx) => {
    const n = idx + 1;
    const wrap = document.createElement('div');
    wrap.className = 'pdf-page-wrap';
    wrap.dataset.page = n;
    wrap.style.width = Math.floor(meta.width * scale) + 'px';
    wrap.style.height = Math.floor(meta.height * scale) + 'px';
    wrap.innerHTML = `<canvas class="pdf-page-canvas"></canvas><span class="page-badge">${n} / ${_pdfDoc.numPages}</span>`;
    container.appendChild(wrap);
  });

  _pdfRenderedPages = new Set();
}

// re-sizes every placeholder for a new zoom/window-width, and immediately
// re-renders any page that was already drawn (so what's on screen updates)
function _resizeAllPages() {
  const scale = _pdfBaseScale * _pdfZoom;
  document.querySelectorAll('.pdf-page-wrap').forEach((wrap) => {
    const n = parseInt(wrap.dataset.page, 10);
    const meta = _pdfPageMeta[n - 1];
    wrap.style.width = Math.floor(meta.width * scale) + 'px';
    wrap.style.height = Math.floor(meta.height * scale) + 'px';
    if (_pdfRenderedPages.has(n)) {
      _pdfRenderedPages.delete(n);
      _renderSinglePage(n);
    }
  });
  document.getElementById('zoomLabel').textContent = Math.round(_pdfZoom * 100) + '%';
  if (_pdfScrollbarUpdate) _pdfScrollbarUpdate(); // page heights just changed, so has the scrollable total
}

// two observers: one with a wide margin that triggers rendering slightly
// before a page is actually visible (so scrolling feels instant), and a
// tighter one purely for updating the "Page X / N" toolbar label
// two observers: one with a wide margin that triggers rendering slightly
// before a page is actually visible (so scrolling feels instant), and a
// tighter one purely for updating the "Page X / N" toolbar label
function _setupPageObservers() {
  if (_pdfRenderObserver) _pdfRenderObserver.disconnect();
  if (_pdfVisibilityObserver) _pdfVisibilityObserver.disconnect();

  _pdfRenderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const n = parseInt(entry.target.dataset.page, 10);
      if (entry.isIntersecting) {
        if (!_pdfRenderedPages.has(n)) _renderSinglePage(n);
      } else {
        // well outside the 1500px margin below — free this page's canvas
        // and text layer rather than leaving it rendered forever. Without
        // this, a long document just accumulates more and more live
        // canvases and text-layer DOM nodes as you scroll, which is
        // exactly what shows up as scrolling/selection lag over time.
        // The placeholder box stays the correct size either way, so
        // nothing shifts — it just goes blank until scrolled back near.
        _releasePage(n);
      }
    });
  }, { rootMargin: '600px 0px', threshold: 0.01 });

  _pdfVisibilityObserver = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach((entry) => {
      if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) best = entry;
    });
    if (best) {
      _pdfCurrentPage = parseInt(best.target.dataset.page, 10);
      document.getElementById('pageCurrent').textContent = _pdfCurrentPage;
      document.getElementById('prevPage').disabled = _pdfCurrentPage <= 1;
      document.getElementById('nextPage').disabled = _pdfCurrentPage >= _pdfDoc.numPages;
    }
  }, { threshold: [0.25, 0.5, 0.75, 1] });

  document.querySelectorAll('.pdf-page-wrap').forEach((el) => {
    _pdfRenderObserver.observe(el);
    _pdfVisibilityObserver.observe(el);
  });
}

// Frees a rendered page's actual pixel/DOM cost (canvas bitmap + text
// layer spans) once it's scrolled well out of range, without touching
// its placeholder's size — so scroll position and the scrollbar never
// jump. Re-rendered automatically (via _pdfRenderObserver above) the
// moment it scrolls back within range.
function _releasePage(n) {
  if (!_pdfRenderedPages.has(n)) return;
  _pdfRenderedPages.delete(n);

  const wrap = document.querySelector(`.pdf-page-wrap[data-page="${n}"]`);
  if (!wrap) return;

  const canvas = wrap.querySelector('canvas');
  if (canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0; // actually releases the backing bitmap's memory, not just visually clearing it
  }
  const textLayer = wrap.querySelector('.pdf-text-layer');
  if (textLayer) textLayer.innerHTML = '';
}

async function _renderSinglePage(n) {
  if (_pdfRenderedPages.has(n)) return;
  _pdfRenderedPages.add(n);

  const wrap = document.querySelector(`.pdf-page-wrap[data-page="${n}"]`);
  if (!wrap) return;
  const canvas = wrap.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const page = await _pdfDoc.getPage(n);
  const scale = _pdfBaseScale * _pdfZoom;
  const viewport = page.getViewport({ scale });
  // Capped at 2x rather than the raw devicePixelRatio (which is 3 on many
  // phones) — canvas pixel count scales with the SQUARE of this number, so
  // uncapped 3x means roughly double the pixels to paint vs capped 2x, for
  // a difference in sharpness that's barely visible. This was the single
  // biggest contributor to scroll/selection lag on high-DPI phones.
  const outputScale = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
  await page.render({ canvasContext: ctx, viewport, transform }).promise;
  await _renderTextLayer(n, viewport, wrap);
}

// builds the invisible, selectable text layer over a page's canvas — this
// is what real text search + copy/paste rely on, since the canvas itself
// is just pixels PDF.js has no way to search inside of.
async function _renderTextLayer(n, viewport, wrap) {
  let textLayerDiv = wrap.querySelector('.pdf-text-layer');
  if (!textLayerDiv) {
    textLayerDiv = document.createElement('div');
    textLayerDiv.className = 'pdf-text-layer';
    wrap.appendChild(textLayerDiv);
  }
  textLayerDiv.innerHTML = '';
  textLayerDiv.style.width = Math.floor(viewport.width) + 'px';
  textLayerDiv.style.height = Math.floor(viewport.height) + 'px';
  textLayerDiv.style.setProperty('--scale-factor', String(viewport.scale));

  const textContent = _pdfTextContentCache[n - 1];
  await pdfjsLib.renderTextLayer({
    textContentSource: textContent,
    container: textLayerDiv,
    viewport,
    textDivs: [],
  }).promise;

  // if a search is currently active and this page is one of the matches,
  // re-apply its highlights (this runs after every (re)render, including
  // the first time a matched page scrolls into view)
  if (_pdfSearchQuery && _pdfSearchMatchPages.includes(n)) {
    _highlightPage(n, _pdfSearchQuery);
  }
}

function _wireViewerControls() {
  document.getElementById('prevPage').addEventListener('click', () => _scrollToPage(_pdfCurrentPage - 1));
  document.getElementById('nextPage').addEventListener('click', () => _scrollToPage(_pdfCurrentPage + 1));
  document.getElementById('zoomIn').addEventListener('click', () => _setZoom(Math.min(3, _pdfZoom * 1.2)));
  document.getElementById('zoomOut').addEventListener('click', () => _setZoom(Math.max(0.5, _pdfZoom / 1.2)));

  document.addEventListener('keydown', (e) => {
    // don't hijack arrow keys while the person is typing in the search box
    if (document.activeElement && document.activeElement.id === 'searchInput') return;
    if (e.key === 'ArrowRight') _scrollToPage(_pdfCurrentPage + 1);
    if (e.key === 'ArrowLeft') _scrollToPage(_pdfCurrentPage - 1);
  });

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleViewerTheme);

  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchBar && searchInput) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open')) searchInput.focus();
      else { searchInput.value = ''; _runPdfSearch(''); }
      _syncViewerHeaderHeight(); // the search bar toggling changes the fixed header's total height
    });
    searchInput.addEventListener('input', _debounce(() => _runPdfSearch(searchInput.value), 350));
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); _gotoSearchMatch(e.shiftKey ? -1 : 1); }
      if (e.key === 'Escape') { searchInput.value = ''; _runPdfSearch(''); searchBar.classList.remove('open'); _syncViewerHeaderHeight(); }
    });
  }
  const searchPrev = document.getElementById('searchPrev');
  const searchNext = document.getElementById('searchNext');
  if (searchPrev) searchPrev.addEventListener('click', () => _gotoSearchMatch(-1));
  if (searchNext) searchNext.addEventListener('click', () => _gotoSearchMatch(1));
}

function _scrollToPage(n) {
  n = Math.max(1, Math.min(_pdfDoc.numPages, n));
  const wrap = document.querySelector(`.pdf-page-wrap[data-page="${n}"]`);
  if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// zooming re-lays-out every page's placeholder size; we capture the
// scroll position as a fraction beforehand and restore it after, so the
// reader doesn't lose their place when the page stack's height changes
function _setZoom(newZoom) {
  const stage = document.getElementById('viewerStage');
  const maxScroll = Math.max(1, stage.scrollHeight - stage.clientHeight);
  const scrollFraction = stage.scrollTop / maxScroll;

  _pdfZoom = newZoom;
  _resizeAllPages();

  requestAnimationFrame(() => {
    const newMaxScroll = Math.max(1, stage.scrollHeight - stage.clientHeight);
    stage.scrollTop = scrollFraction * newMaxScroll;
  });
}

/* ---- 8a. In-document search ------------------------------------------
   Scans the pre-built _pdfTextIndex (no network/render needed) to find
   which pages contain the query, force-renders those specific pages if
   they haven't been drawn yet (so highlights have something to attach
   to), then highlights every match and lets Enter / the arrow buttons
   step through them.
------------------------------------------------------------------------ */
async function _runPdfSearch(query) {
  _clearAllHighlights();
  query = query.trim();
  _pdfSearchQuery = query;
  const resultsLabel = document.getElementById('searchResults');
  _pdfSearchMatchPages = [];
  _pdfSearchPageIndex = -1;
  _pdfSearchMarkIndexOnPage = -1;

  if (!query) {
    if (resultsLabel) resultsLabel.textContent = '';
    return;
  }

  // Everything here reads only the pre-cached _pdfTextIndex — no
  // rendering happens yet. Rendering (and highlighting) every matching
  // page up front used to be exactly what made searching a long document
  // feel slow: a common word can match most of the document, which meant
  // rendering nearly the whole thing just to show a result count.
  const q = query.toLowerCase();
  let totalOccurrences = 0;
  _pdfTextIndex.forEach((text, idx) => {
    let count = 0, pos = 0;
    while ((pos = text.indexOf(q, pos)) !== -1) { count++; pos += q.length; }
    if (count > 0) { _pdfSearchMatchPages.push(idx + 1); totalOccurrences += count; }
  });

  if (!_pdfSearchMatchPages.length) {
    if (resultsLabel) resultsLabel.textContent = 'No matches';
    return;
  }

  if (resultsLabel) resultsLabel.textContent = `${totalOccurrences} match${totalOccurrences === 1 ? '' : 'es'}`;
  _gotoSearchMatch(1); // renders + highlights only this one page, lazily
}

// Wraps every occurrence of `query` inside a page's (already-rendered)
// text layer in a <mark>. This works ACROSS span boundaries, not just
// within a single one — PDF text is broken into a new span at every
// font/kerning change, not at word boundaries, so a match can easily
// straddle two (or more) spans. Matching only within individual spans
// (the simpler approach) silently misses those, which is exactly what
// caused only one occurrence per page to ever get highlighted: whichever
// one happened to land cleanly inside a single span, while the others —
// still real, still found by the page-level search — were invisible.
function _highlightPage(n, query) {
  const wrap = document.querySelector(`.pdf-page-wrap[data-page="${n}"]`);
  const textLayer = wrap && wrap.querySelector('.pdf-text-layer');
  if (!textLayer || !query) return;
  const q = query.toLowerCase();

  const spans = Array.from(textLayer.querySelectorAll('span'));
  if (!spans.length) return;
  const originals = spans.map((s) => s.textContent);

  // one combined string across every span, joined the same way
  // _pdfTextIndex was (single space between items) — keeps this in sync
  // with how pages get *found* in the first place, and with a matching
  // character-position map so a match's range can be traced back to
  // exactly which span(s) it touches
  const combined = originals.join(' ').toLowerCase();
  const charMap = []; // charMap[i] = {spanIdx, offset} | null (a joining space)
  originals.forEach((text, spanIdx) => {
    for (let i = 0; i < text.length; i++) charMap.push({ spanIdx, offset: i });
    charMap.push(null);
  });

  const ranges = [];
  let pos = 0;
  while (true) {
    const found = combined.indexOf(q, pos);
    if (found === -1) break;
    ranges.push([found, found + q.length]);
    pos = found + q.length;
  }
  if (!ranges.length) return;

  // group each match's characters by which span they land in, collapsing
  // consecutive same-span characters into single runs — a match entirely
  // within one span becomes one run; one straddling a boundary becomes
  // two (or more) runs, each highlighted separately but sitting right
  // next to each other so they still read as one continuous highlight
  const bySpan = new Map();
  ranges.forEach(([start, end]) => {
    for (let i = start; i < end; i++) {
      const c = charMap[i];
      if (!c) continue;
      if (!bySpan.has(c.spanIdx)) bySpan.set(c.spanIdx, []);
      const runs = bySpan.get(c.spanIdx);
      const last = runs[runs.length - 1];
      if (last && last[1] === c.offset) last[1] = c.offset + 1;
      else runs.push([c.offset, c.offset + 1]);
    }
  });

  bySpan.forEach((runs, spanIdx) => {
    const span = spans[spanIdx];
    const text = originals[spanIdx];
    let html = '';
    let cursor = 0;
    runs.forEach(([start, end]) => {
      html += text.slice(cursor, start);
      html += `<mark class="pdf-search-mark">${text.slice(start, end)}</mark>`;
      cursor = end;
    });
    html += text.slice(cursor);
    span.innerHTML = html;
  });
}

function _clearAllHighlights() {
  document.querySelectorAll('.pdf-search-mark').forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

// Steps to the next/previous individual highlighted occurrence — every
// match on the current page first, only moving to the next/previous
// matching PAGE once those are exhausted. This is deliberately NOT
// "render every matching page up front and flatten them into one list":
// that was the old approach, and for a common word matching most of a
// long document, it meant rendering nearly the whole thing just to
// search. Instead, only the page actually being visited ever gets
// rendered — one page at a time, lazily — while still visiting every
// occurrence on it before moving on, not skipping straight to the next
// page's first match.
async function _gotoSearchMatch(step) {
  if (!_pdfSearchMatchPages.length) return;

  // first call after a fresh search — start on the first page
  if (_pdfSearchPageIndex === -1) {
    _pdfSearchPageIndex = 0;
    await _renderSinglePage(_pdfSearchMatchPages[_pdfSearchPageIndex]);
    _highlightPage(_pdfSearchMatchPages[_pdfSearchPageIndex], _pdfSearchQuery);
    _pdfSearchMarkIndexOnPage = step >= 0 ? -1 : _currentPageMarks().length; // so the step below lands on the first/last mark
  }

  let marks = _currentPageMarks();
  let nextIndex = _pdfSearchMarkIndexOnPage + step;

  // ran off either end of the current page's matches — move to the
  // next/previous matching page (wrapping around the whole document),
  // render + highlight it, then land on its first/last match
  if (nextIndex < 0 || nextIndex >= marks.length) {
    _pdfSearchPageIndex = (_pdfSearchPageIndex + step + _pdfSearchMatchPages.length) % _pdfSearchMatchPages.length;
    const n = _pdfSearchMatchPages[_pdfSearchPageIndex];
    await _renderSinglePage(n);
    _highlightPage(n, _pdfSearchQuery);
    marks = _currentPageMarks();
    nextIndex = step >= 0 ? 0 : marks.length - 1;
  }

  _pdfSearchMarkIndexOnPage = nextIndex;

  document.querySelectorAll('.pdf-search-mark.active').forEach((m) => m.classList.remove('active'));
  const target = marks[_pdfSearchMarkIndexOnPage];
  if (target) {
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// all highlighted marks on the page we're currently stepping through,
// in reading order
function _currentPageMarks() {
  const n = _pdfSearchMatchPages[_pdfSearchPageIndex];
  const wrap = document.querySelector(`.pdf-page-wrap[data-page="${n}"]`);
  return wrap ? Array.from(wrap.querySelectorAll('.pdf-search-mark')) : [];
}

/* ---- 8b. Light / dark theme (viewer only) -----------------------------
   Flips a data-theme attribute on <html>, which css/viewer.css uses to
   swap the design tokens (see the `html[data-theme="light"]` block in
   that file). Persisted to localStorage; viewer.html has a tiny inline
   script in <head> that applies the saved preference before first paint
   so there's no flash of the wrong theme.
------------------------------------------------------------------------ */
function toggleViewerTheme() {
  const html = document.documentElement;
  const goingLight = html.getAttribute('data-theme') !== 'light';
  if (goingLight) html.setAttribute('data-theme', 'light');
  else html.removeAttribute('data-theme');
  try { localStorage.setItem('bsds-viewer-theme', goingLight ? 'light' : 'dark'); } catch (e) { /* private browsing, etc — safe to ignore */ }
  _updateThemeToggleIcon();
}

function _updateThemeToggleIcon() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  btn.innerHTML = isLight
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
}

/* ---- 8c. Fullscreen toggle ---------------------------------------------
   Plain Fullscreen API. Note that iOS Safari doesn't support it at all
   (only for <video> elements) — rather than show a button that silently
   does nothing there, the button hides itself when the API isn't there.
--------------------------------------------------------------------------- */
function _wireFullscreenButton() {
  const btn = document.getElementById('fullscreenToggle');
  if (!btn) return;

  const supported = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (!supported) { btn.style.display = 'none'; return; }

  btn.addEventListener('click', () => {
    const isFull = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFull) {
      const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
      request.call(document.documentElement).catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      exit.call(document).catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', _onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', _onFullscreenChange);
  _updateFullscreenIcon();
}

function _onFullscreenChange() {
  _updateFullscreenIcon();
  // entering/exiting fullscreen changes the viewport size (browser chrome
  // appears/disappears), so the header height and the PDF's fit-to-width
  // scale both need recomputing, same as a window resize would trigger
  _syncViewerHeaderHeight();
  _computeBaseScale();
  _resizeAllPages();
}

function _updateFullscreenIcon() {
  const btn = document.getElementById('fullscreenToggle');
  if (!btn) return;
  const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
  btn.setAttribute('aria-label', isFull ? 'Exit fullscreen' : 'Enter fullscreen');
  btn.innerHTML = isFull
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M9 21H5a2 2 0 01-2-2v-4M15 21h4a2 2 0 002-2v-4"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V5a2 2 0 012-2h4M20 9V5a2 2 0 00-2-2h-4M4 15v4a2 2 0 002 2h4M20 15v4a2 2 0 01-2 2h-4"/></svg>`;
}

function _debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
