/* =====================================================================
   BSDS ARCHIVE — SEMESTER 3 DATA (placeholder)
   =====================================================================
   Not published yet — semester3.html doesn't exist, and this
   semester's entry in js/data/semester-list.js still has href:null,
   so it shows as "Coming soon" on the semester picker.

   TO PUBLISH THIS SEMESTER:
   1. Copy the full contents of js/data/sem1.js into this file.
   2. Replace every "SEMESTER_DATA.sem1" below with "SEMESTER_DATA.sem3"
      and fill in this semester's real materials/syllabus/timetable/calendar.
   3. Copy semester1.html to semester3.html; update its
      <script src="js/data/sem1.js"> to sem3.js and its
      initSemesterPage('sem1') call to initSemesterPage('sem3').
   4. Create data/sem3-announcements.txt (copy data/sem1-announcements.txt
      as a starting point).
   5. In js/data/semester-list.js, set this semester's href to
      "semester3.html".
   ===================================================================== */

window.SEMESTER_DATA = window.SEMESTER_DATA || {};

// Left undefined on purpose until step 2 above is done. initSemesterPage()
// in js/app.js checks for this and shows a friendly "not published yet"
// message instead of erroring if a page is wired up before its data is.
// SEMESTER_DATA.sem3 = { materials: {}, syllabus: [], timetable: {days:[],rows:[]}, calendar: [] };
