HOW TO ADD YOUR OWN PDFS
=========================
Put PDFs anywhere inside this "files" folder — organise them however
you like. The four subfolders here (statistics, mathematics,
probability, economics) are just a starting suggestion; feel free to
rename, restructure, or add e.g. a "files/sem2/" folder later.

Each PDF needs one matching line added to that semester's data file —
e.g. js/data/sem1.js for Semester I. See the comment above
SEMESTER_DATA.sem1 in that file for the exact format. In short: add a
"file" property pointing at the PDF's path, e.g.

    {t:"My Lecture Notes", m:"PDF · 10p", file:"files/statistics/my-notes.pdf"}

The four PDFs already in these subfolders are placeholder samples so
you can test the "Open Materials" → Download/Open flow immediately.
Replace them with your real files at any time — same filename, or a
new one (just update the "file" path in that semester's js/data/semN.js
to match).

IF THIS IS GOING ON GITHUB PAGES — two gotchas worth knowing up front,
both of which look identical (viewer says it can't load the PDF) but
have different fixes:

  1. Case sensitivity. GitHub Pages' server is case-sensitive, even if
     your own computer isn't. "Files/Notes.PDF" and "files/notes.pdf"
     are different files as far as it's concerned. If something works
     on your machine but 404s once deployed, this is almost always why
     — check the "file" path matches the real filename's capitalisation
     exactly.

  2. Git LFS. If a PDF is large enough that Git warns you or you set up
     Git LFS to get around GitHub's 100MB file limit, know that GitHub
     Pages does NOT serve LFS-tracked files correctly — it deploys a
     small plain-text pointer file instead of your actual PDF, and the
     viewer will fail to parse it. Either keep files under the limit
     without LFS, or host large PDFs elsewhere (a GitHub Release asset,
     Google Drive, any static file host) and point "file" at that full
     URL instead of a local path.
