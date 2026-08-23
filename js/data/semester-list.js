/* =====================================================================
   BSDS ARCHIVE — SEMESTER LIST
   =====================================================================
   Drives the vertical timeline on semesters.html (the semester picker).
   Only semesters.html needs to load this file — semesterN.html pages
   load their own js/data/semN.js instead (see that file for why the
   data got split this way).

   key      : must match a key in SEMESTER_DATA below (e.g. "sem1")
   href     : the page to link to, or null if not published yet
              ("Coming soon" is shown automatically when href is null)
   courses  : short list shown as pills — purely cosmetic preview
   ===================================================================== */
const SEMESTER_LIST = [
  { num:"I",    key:"sem1", href:"semester1.html", courses:["Statistics I","Mathematics I","Probability I","Economics I"] },
  { num:"II",   key:"sem2", href:null, courses:["Statistics II","Mathematics II","Probability II","Economics II"] },
  { num:"III",  key:"sem3", href:null, courses:["Linear Models","Real Analysis","Sampling Techniques","Macroeconomics"] },
  { num:"IV",   key:"sem4", href:null, courses:["Statistical Inference","Design of Experiments","Stochastic Processes","Econometrics I"] },
  { num:"V",    key:"sem5", href:null, courses:["Multivariate Analysis","Time Series","Machine Learning I","Econometrics II"] },
  { num:"VI",   key:"sem6", href:null, courses:["Regression Analysis","Machine Learning II","Dissertation","Electives"] },
  { num:"VII",  key:"sem7", href:null, courses:["Deep Learning","Bayesian Statistics","Advanced Econometrics","Capstone Project I"] },
  { num:"VIII", key:"sem8", href:null, courses:["Big Data Systems","Causal Inference","Research Seminar","Capstone Project II"] },
];
