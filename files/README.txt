HOW TO ADD YOUR OWN PDFS
=========================
Put PDFs anywhere inside this "files" folder — organise them however
you like. The four subfolders here (statistics, mathematics,
probability, economics) are just a starting suggestion; feel free to
rename, restructure, or add e.g. a "files/sem2/" folder later.

Each PDF needs one matching line added to js/semester-data.js — see
the comment above SEMESTER_DATA in that file for the exact format.
In short: add a "file" property pointing at the PDF's path, e.g.

    {t:"My Lecture Notes", m:"PDF · 10p", file:"files/statistics/my-notes.pdf"}

The four PDFs already in these subfolders are placeholder samples so
you can test the "Open Materials" → Download/Open flow immediately.
Replace them with your real files at any time — same filename, or a
new one (just update the "file" path in semester-data.js to match).
