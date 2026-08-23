/* =====================================================================
   BSDS ARCHIVE — SEMESTER 1 DATA
   =====================================================================
   This is the ONE file to edit for everything on the Semester I page:
   Materials, Syllabus, Timetable, and Calendar. It attaches itself to
   the shared SEMESTER_DATA object (declared once, safely, below) so
   semester1.html only ever needs to load THIS file — not everyone
   else's semester data too. When sem2 is ready, copy this file to
   sem2.js, change every "sem1" below to "sem2", and load it from
   semester2.html instead.

   Nothing here needs a build step — just edit the plain JavaScript
   objects/arrays and save. Reload the page to see changes.

   ADDING A PDF TO A MATERIAL ITEM
   --------------------------------
   Every material item can optionally carry a "file" property — a path
   to a PDF, relative to the site's root, e.g.:

       {t:"Descriptive Statistics & Summary Measures", m:"PDF · 18p",
        file:"files/statistics/descriptive-statistics.pdf"}

   1. Drop the actual PDF into the files/ folder (organise it however
      you like — the four course subfolders already there are just a
      suggestion, e.g. files/statistics/, files/mathematics/, ...).
   2. Set "file" to that same path on the matching item below.
   3. That's it — the drawer automatically shows Download + Open
      buttons for any item with a "file" path, and "Open" launches
      viewer.html, which renders the PDF right in the browser (works
      on both phones and desktops, scrolling continuously through
      every page).

   Items WITHOUT a "file" property still show up in the list, just
   with a "Not uploaded yet" note instead of the two buttons — so you
   can list out a course's full set of materials before you've
   actually uploaded every PDF.

   ANNOUNCEMENTS FOR THIS SEMESTER
   --------------------------------
   The Announcements tab on this page reads from a plain text file at
   data/sem1-announcements.txt — edit that file directly, same format
   as the site-wide one on the homepage. See that file for the format.
   ===================================================================== */

// Declared once, added to (not overwritten) by each semN.js file, so
// load order between semester files never matters.
window.SEMESTER_DATA = window.SEMESTER_DATA || {};

SEMESTER_DATA.sem1 = {

  /* ---- MATERIALS TAB ---------------------------------------
     One object per course. "accent" must be one of:
     gold | violet | teal | brick  (defined in css/base.css)
     "glyph" is a tiny hand-drawn SVG path shown on the card.
  ------------------------------------------------------------ */
  materials: {
    statistics: {
      code: "STAT 101",
      title: "Statistics I",
      desc: "Descriptive statistics, distributions, and the tools for summarising data.",
      accent: "gold",
      glyph: `<path d="M4,32 C12,32 16,6 32,6 C48,6 52,32 60,32" />`,
      categories: [
        { name:"Lecture Notes", items:[
          {t:"Descriptive Statistics & Summary Measures", m:"PDF · 18p", file:"files/statistics/descriptive-statistics.pdf"},
          {t:"Measures of Central Tendency", m:"PDF · 12p"},
          {t:"Measures of Dispersion & Skewness", m:"PDF · 15p"},
        ]},
        { name:"Assignments", items:[
          {t:"Problem Set 1 – Frequency Distributions", m:"PDF"},
          {t:"Problem Set 2 – Moments & Skewness", m:"PDF"},
        ]},
        { name:"Previous Year Papers", items:[
          {t:"Mid-Semester 2025", m:"PDF"},
          {t:"End-Semester 2024", m:"PDF"},
        ]},
        { name:"Reference Reading", items:[
          {t:"Fundamentals of Statistics — S.C. Gupta", m:"Book"},
        ]},
      ]
    },
    mathematics: {
      code: "MATH 101",
      title: "Mathematics I",
      desc: "Foundations in calculus, sequences, and linear algebra for data science.",
      accent: "violet",
      glyph: `<path d="M10,32 Q10,6 22,6 L22,32 Q22,6 34,6" /><line x1="40" y1="10" x2="56" y2="10"/><line x1="40" y1="20" x2="56" y2="20"/>`,
      categories: [
        { name:"Lecture Notes", items:[
          {t:"Sequences, Series & Limits", m:"PDF · 20p", file:"files/mathematics/sequences-series-limits.pdf"},
          {t:"Differential & Integral Calculus", m:"PDF · 26p"},
          {t:"Vectors & Matrix Algebra", m:"PDF · 22p"},
        ]},
        { name:"Assignments", items:[
          {t:"Problem Set 1 – Limits & Continuity", m:"PDF"},
          {t:"Problem Set 2 – Matrix Operations", m:"PDF"},
        ]},
        { name:"Previous Year Papers", items:[
          {t:"Mid-Semester 2025", m:"PDF"},
          {t:"End-Semester 2024", m:"PDF"},
        ]},
        { name:"Reference Reading", items:[
          {t:"Calculus — Tom M. Apostol", m:"Book"},
        ]},
      ]
    },
    probability: {
      code: "PROB 101",
      title: "Probability I",
      desc: "Sample spaces, random variables, and the standard discrete & continuous laws.",
      accent: "teal",
      glyph: `<circle cx="14" cy="14" r="5"/><circle cx="14" cy="26" r="5"/><path d="M28,32 C28,10 44,10 54,4" />`,
      categories: [
        { name:"Lecture Notes", items:[
          {t:"Sample Spaces & Axioms of Probability", m:"PDF · 14p", file:"files/probability/sample-spaces-axioms.pdf"},
          {t:"Random Variables & Expectation", m:"PDF · 19p"},
          {t:"Standard Distributions (Binomial, Poisson, Normal)", m:"PDF · 23p"},
        ]},
        { name:"Assignments", items:[
          {t:"Problem Set 1 – Combinatorics & Bayes' Theorem", m:"PDF"},
          {t:"Problem Set 2 – Distributions", m:"PDF"},
        ]},
        { name:"Previous Year Papers", items:[
          {t:"Mid-Semester 2025", m:"PDF"},
          {t:"End-Semester 2024", m:"PDF"},
        ]},
        { name:"Reference Reading", items:[
          {t:"An Introduction to Probability Theory — W. Feller", m:"Book"},
        ]},
      ]
    },
    economics: {
      code: "ECON 101",
      title: "Economics I",
      desc: "Microeconomic principles: demand, supply, and market structures.",
      accent: "brick",
      glyph: `<line x1="6" y1="32" x2="58" y2="6"/><line x1="6" y1="6" x2="58" y2="32"/>`,
      categories: [
        { name:"Lecture Notes", items:[
          {t:"Demand, Supply & Market Equilibrium", m:"PDF · 16p", file:"files/economics/demand-supply-equilibrium.pdf"},
          {t:"Elasticity & Consumer Behaviour", m:"PDF · 18p"},
          {t:"Market Structures & Competition", m:"PDF · 21p"},
        ]},
        { name:"Assignments", items:[
          {t:"Problem Set 1 – Equilibrium Analysis", m:"PDF"},
          {t:"Problem Set 2 – Elasticity Calculations", m:"PDF"},
        ]},
        { name:"Previous Year Papers", items:[
          {t:"Mid-Semester 2025", m:"PDF"},
          {t:"End-Semester 2024", m:"PDF"},
        ]},
        { name:"Reference Reading", items:[
          {t:"Principles of Economics — N.G. Mankiw", m:"Book"},
        ]},
      ]
    },
  },

  /* ---- SYLLABUS TAB -------------------------------------------
     One entry per course. "units" is just a plain list — add or
     reorder freely.
  --------------------------------------------------------------- */
  syllabus: [
    { course:"Statistics I", accent:"gold", groups:[
      { heading:"Data Exploration", units:[
        "Population and Sampling — Population, sample, random sampling.",
        "Study Designs — Observational and randomized studies.",
        "Data and Visualization — Types and collection of data; primary and secondary data; univariate and bivariate data; box plots, histograms, ECDF, Q-Q plots, scatter plots, bar plots, and pie charts.",
        "Descriptive Statistics — Location, dispersion, skewness, outliers, and robust measures",
        "Bivariate Analysis — Association, correlation, and simple linear regression.",
      "Categorical Data — Cross-tabulation, basic properties, and odds ratio.",
      ]},
    ]},
    { course:"Mathematics I", accent:"violet", groups:[
      { heading:"One Variable Calculus", units:[
        "Sets: Set operations. Countable and uncountable sets.",
        "Functions: injective and surjective functions. Composition of functions. Inverse of a bijective function.",
        "Sequences and their limits. Convergent sequences. Cauchy sequences. Series, sum of a series.",
        "Catalogue of essential functions (Polynomial, Trigonometric, Exponential, Logarithmic).",
        "Limit and continuity of a function. Computation of limits. Properties of continuous functions.",
        "Derivative of a function. Derivatives of polynomial, exponential and trigonometric functions. Chain rule.",
        "Properties of differentiable functions. Mean Value Theorem, Taylor's theorem. Maxima/minima of a function, L'Hôpital's rule.",
        "Riemann integration. Some classes of integrable functions. Rules of Integration: Integration by parts, substitution rule. (Trigonometric integrals. Trigonometric substitution.) Fundamental Theorems of Calculus.",
        "Improper Riemann integrals.",
        "Sequence of functions: definition and examples.",
      ]},
      { heading:"Linear Algebra", units:[
        "Vector spaces, subspaces, linear independence. Basis. Dimension. Sum and intersection of subspaces.",
        "Matrices. Elementary row operations. Rank of a matrix. Column space and row space.",
        "Operations with partitioned matrices. Trace and determinant of a matrix.",
        "Linear transformations, matrix of a linear transformation.",
        "Linear equations. Homogeneous and inhomogeneous system of equations. Consistency. Solution space.",
      ]},
    ]},
    { course:"Probability I", accent:"teal", units:[
      "Probability Basics — Set-up, equally likely outcomes, and counting.",
      "Conditional Probability — Bayes’ rule and independence.",
      "Sampling and Binomial Distribution — Sampling methods, Binomial distribution, and Normal/Poisson approximations.",
      "Discrete Random Variables — Uniform, Bernoulli, Binomial, Poisson, Hypergeometric, and Geometric distributions.",
      "Moments and Generating Functions — Expectation, variance, standard error, higher moments, and generating functions.",
      "Joint Distributions — Discrete joint distributions, independence, and repeated trials.",
      "Continuous Random Variables — Density, CDF, transformations, moments, and common continuous distributions.",
      "Conditional Distributions — Joint distributions, conditional distributions, expectation, covariance, correlation, and independence.",
      "Bivariate Normal Distribution — Density, marginal and conditional distributions, and spherical symmetry.",
      "Derived Distributions — Sums, products, quotients, Student’s t, χ², and F distributions."
    ]},
    { course:"Economics I", accent:"brick", units:[
      "Basic concepts: scarcity, choice, opportunity cost",
      "Theory of demand and supply, market equilibrium",
      "Elasticity of demand and supply",
      "Consumer behaviour and utility analysis",
      "Production, cost and revenue concepts",
      "Market structures: perfect competition, monopoly, oligopoly",
    ]},
  ],

  /* ---- TIMETABLE TAB --------------------------------------------
     "days" is the column header row.
     "rows" is one row per time slot; keys must match entries in
     "days" (lowercased). Use "" for a free period.
  ------------------------------------------------------------------ */
  timetable: {
    days: ["Mon","Tue","Wed","Thu","Fri"],
    rows: [
      { time:"10:30 – 12:00", mon:"Mathematics I", tue:"Probability I", wed:"Mathematics I", thu:"T: Probability I",  fri:"Probability I" },
      { time:"12:05 – 1:35",  mon:"ITC", tue:"Statistics I", wed:"ITC",  thu:"Statistics I", fri:"Earth Science" },
      { time:"1:35 – 2:30",   mon:"Lunch", tue:"Lunch", wed:"Lunch", thu:"Lunch", fri:"Lunch" },
      { time:"2:30 – 4:00",   mon:"Probability I", tue:"Economics I", wed:"T: Statistics I", thu:"Biology I", fri:"T: Mathematics I" },
      { time:"4:00 – 5:35",   mon:"Economics I", tue:"Biology I", wed:"Earth Science", thu:"T: ITC", fri:"T: Earth Science/ T: Biology I" },
    ]
  },

  /* ---- ACADEMIC CALENDAR TAB --------------------------------------
     type must be one of: holiday | exam | event | registration
     (each renders with a different colored badge)
     Sort order doesn't matter — app.js sorts by date automatically.
  --------------------------------------------------------------------- */
  calendar: [
    { date:"2026-08-10", title:"Classes begin", type:"event" },
    { date:"2026-08-15", title:"Independence Day", type:"holiday" },
    { date:"2026-08-26", title:"Milad un-Nabi", type:"holiday" },
    { date:"2026-09-04", title:"Janmashtami", type:"holiday" },
    { date:"2026-09-14", title:"Ganesh Chaturthi", type:"holiday" },
    { date:"2026-09-28", title:"Mid-Semester exams begin", type:"exam" },
    { date:"2026-10-05", title:"Mid-Semester exams end", type:"exam" },
    { date:"2026-10-02", title:"Gandhi Jayanti", type:"holiday" },
    { date:"2026-10-19", title:"Durga Puja break begins", type:"holiday" },
    { date:"2026-10-23", title:"Durga Puja break ends", type:"holiday" },
    { date:"2026-10-26", title:"Classes resume", type:"event" },
    { date:"2026-11-08", title:"Diwali", type:"holiday" },
    { date:"2026-11-24", title:"Guru Nanak Jayanti", type:"holiday" },
    { date:"2026-12-05", end:"2026-12-08", title:"Study Leave", type:"holiday" },
    { date:"2026-12-09", title:"End-Semester exams begin", type:"exam" },
    { date:"2026-12-18", title:"End-Semester exams end", type:"exam" },
    { date:"2026-12-19", title:"Semester I ends", type:"event" },
    { date:"2026-12-25", title:"Christmas", type:"holiday" },
  ],
};
