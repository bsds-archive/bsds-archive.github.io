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
          {t:"Fundamentals of Statistics — S.C. Gupta", m:"Book", links:{ drive:"https://drive.google.com/drive/folders/YOUR_FOLDER_ID", dropbox:"https://www.dropbox.com/sh/YOUR_SHARE_LINK" } },
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

    computing: {
      code: "ITC 101",
      title: "Introduction to Computing",
      desc: "Programming fundamentals and computational thinking for data science.",
      accent: "brick",
      glyph: `<path d="M8,8 L8,32 M8,20 L24,20 M24,8 L24,32" stroke-linecap="round"/>`,
      categories: [
        { name:"Lecture Notes", items:[
          {t:"Introduction to Programming", m:"PDF"},
        ]},
        { name:"Assignments", items:[
          {t:"Problem Set 1", m:"PDF"},
        ]},
        { name:"Previous Year Papers", items:[] },
        { name:"Reference Reading", items:[] },
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
     One entry per course. Two shapes are supported — use whichever
     matches how that course's real syllabus is actually organised:

       "units": [...]              — one flat numbered list (see
                                      Statistics I below).
       "groups": [{heading, units}] — one or more NAMED sections, each
                                      restarting its own numbering at 1
                                      (see Mathematics I below, which is
                                      really "One Variable Calculus" +
                                      "Linear Algebra", not one list).

     A course only needs one or the other, never both.
  --------------------------------------------------------------- */
  syllabusDownload: "files/BSDS_Curriculum.pdf",

  syllabus: [
    { course:"Statistics I", accent:"gold", groups:[
      { heading:"Data Exploration", units:[
        "Concepts of population and sample. Intuitive idea about a random sample.",
        "Observational studies and randomized studies.",
        "Types of data and methods of data collection. Primary and secondary data. Summarization and presentation of different kinds of univariate and bivariate data. Box plots, histograms, empirical c.d.f., Q-Q plots, scatter plots. Bar plots, pie charts.",
        "Descriptive measures: Location, dispersion and skewness. Concept of outliers and robust measures. Comparison of various methods.",
        "Analysis of bivariate data. Measures of association, correlation and simple linear regression.",
        "Categorical data. Cross tabulation. Basic properties. Odds Ratio.",
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
      "Mathematical set-up for probability, equally likely outcomes, basic counting arguments.",
      "Conditional probability, Bayes' rule, independent events.",
      "Sampling with and without replacement, Binomial distribution, Normal and Poisson approximations to Binomial distribution.",
      "Discrete random variables: Discrete Uniform, Bernoulli, Binomial, Poisson, Hyper-geometric, Geometric distributions.",
      "Expectation of a random variable. Variance, standard error, higher moments and generating functions.",
      "Discrete joint distributions, independent random variables, repeated trials.",
      "Continuous random variables, density, cumulative distribution function, change of variable formula. Expectation, variance and higher moments for continuous random variables. Uniform, Exponential, Gamma, Beta and Normal distributions.",
      "Continuous joint distributions, independence. Discrete and continuous conditional distributions and conditional expectations. Covariance and correlation of two random variables. Correlation and independence.",
      "Bivariate Normal distribution, density function and basic properties. Marginal and conditional distributions. Spherical symmetry of the Bivariate Normal distribution.",
      "Distribution of sums, products and quotients for continuous distributions. Student's t, χ² (Chi-square) and F distributions, and their elementary properties.",
    ]},
    { course:"Introduction to Computing", accent:"blue", groups:[
      { heading:"Software Programming / General Techniques", units:[
        "Introduction to number system: binary, octal, hexadecimal. Introduction to algorithms: Illustration using simple examples (Euclid's algorithm, bisection method, regula falsi). Representation of numbers and data types: Signed and unsigned integers, floating points, overflow, underflow.",
        "Imperative programming: Introduction, common syntax and constructs — variables, assignment, expressions, conditionals and branching, iteration. Input / output. Functions: parameter passing, call by value, call by reference, recursion. Illustration using C / R / Python / Javascript (basic similarities and differences).",
        "Arrays. Illustration using sorting.",
        "Pointers, structures, dynamic allocation.",
        "Data Structures: Queue, Stack, Linked lists, Trees.",
        "Basic ideas of Object-oriented programming: Introduction to classes, inheritance, overloading, polymorphism.",
      ]},
      { heading:"Software / Hardware / Software-Hardware Interface", units:[
        "Introduction to digital computers: CPU, main memory, peripherals, I/O devices, storage.",
        "Random access machine model of computing. Basic concepts of formal run-time analysis.",
        "Basic ideas of parallel programming.",
        "Memory management strategies: C (dynamic allocation / free) vs R / Python (garbage collection).",
      ]},
      { heading:"Algorithms", units:[
        "Introduction to error analysis: round-off errors, floating point operations, error propagation, condition number and stability. Illustration using simple examples.",
      ]},
    ]},
    { course:"Economics I", accent:"brick", groups:[
      { heading:"Micro Economics", units:[
        "Welfare Economics: Supply and Demand, Elasticity.",
        "Consumption and Consumer behaviour.",
        "Production and Theory of costs.",
        "Market Organisation: Competition, Monopoly.",
      ]},
      { heading:"Macro Economics", units:[
        "National income accounting, demand and supply.",
        "Simple Keynesian model and extensions.",
        "Consumption and Investment.",
        "Inflation and Unemployment.",
        "Fiscal policy.",
        "Money, banking and finance.",
      ]},
    ]},
    { course:"Biology I", accent:"teal", units:[
      "Biological classification of living organisms: Distinguishing characteristics of living and non-living things; Definition and concept of Biodiversity; Need for classification; Three domains of life; Concept of species and taxonomical hierarchy; Binomial nomenclature. Five kingdom classifications; classification of plants; classification of animals.",
      "Cell and cell division: Study of cell structure and functions; Mitosis and Meiosis, comparative account of mitosis and meiosis. Cell theory and cell as the basic unit of life, structure of prokaryotic and eukaryotic cells; Plant cell and animal cell; Cell envelope; Cell membrane, Cell wall. Chemical constituents of living cells: biomolecules, structure and function of proteins, carbohydrates, lipids, nucleic acids; Enzymes - types, properties, enzyme action; Cell cycle, mitosis, meiosis and their significance.",
      "Central dogma: Structure and function of DNA and RNA; Replication, transcription, translation.",
      "Basic biochemistry: Metabolism of protein, carbohydrate and fat.",
      "Basic microbiology: Microbial culture medium. Microbial morphology, growth and development. Applications of microbiology.",
      "Basic agriculture: Plant, soil and environment interaction. Major agricultural and horticultural crops of India. Pest and diseases of crop plants.",
      "Plant Physiology: Photosynthesis: Light harvesting complexes; mechanisms of electron transport; photoprotective mechanisms; CO2 fixation - C3, C4 and CAM pathways. Respiration and photorespiration: Citric acid cycle; plant mitochondrial electron transport and ATP synthesis; alternate oxidase; photorespiratory pathway. Nitrogen metabolism: Nitrate and ammonium assimilation; amino acid biosynthesis.",
      "Animal Physiology: Digestive system. Cardiovascular System. Respiratory system. Nervous system. Sense organs: Vision, hearing and tactile response. Excretory system.",
    ]},
    { course:"Earth System Sciences", accent:"blue", units:[
      "The Earth System: The Scientific Method; System Concept, Dynamic Interactions among Systems, The Energy Cycle, Introduction to Geological data.",
      "Earth as a Planet in the Solar System: Origin of the Universe and the Solar System, Evolution of the Planets, Meteorites and Asteroids, Origin of Atmosphere, Ocean and Life.",
      "The Solid Earth: The Earth as a Layered Planet / Mechanical Layering of the Earth, Layers of Different Composition and Physical State, Earthquake and the Earth's Interior, Plate Tectonics, Geothermal Gradient, Magmas and Volcanoes.",
      "The Earth's Evolving Crust: Sedimentary Strata; Sedimentary process and Sedimentary Rocks; Metamorphism and Metamorphic Rocks; Plate Tectonics, Continental Crust and Mountain Building; Understanding the past from Stratigraphic Records; Geological Time Scale.",
      "Hydrosphere, Atmosphere and Biosphere: Water and the Hydrologic Cycle; Snow and Ice; The Oceans; The Atmosphere; Winds and the Global Air Circulation; The Earth's Climate System and the Changing Climate.",
      "Life on Earth: A Planetary Perspective on Life; The Habitable Planet; Biogeochemical Cycles and Biological Evolution; Mass Extinctions.",
      "Resources on Earth: Coal and Petroleum Resources; Nuclear, Wind and Hydroelectric Power Energy.",
      "Geostatistics: Application of statistics to Geological Data; Pattern recognition of geological events; Statistics for earth resources.",
    ]}
  ],

  /* ---- TIMETABLE TAB --------------------------------------------
     "days" is the column header row.
     "rows" is one row per time slot; keys must match entries in
     "days" (lowercased). Use "" for a free period.
  ------------------------------------------------------------------ */
  timetable: {
    download: "files/timetable-sem1.pdf",
    days: ["Mon","Tue","Wed","Thu","Fri"],
    rows: [
      { time:"10:30 – 12:00", mon:"Mathematics I",  tue:"Probability I", wed:"Mathematics I",  thu:"T: Probability I", fri:"Probability I" },
      { time:"12:05 – 1:35",  mon:"ITC", tue:"Statistics I", wed:"ITC", thu:"Statistics I", fri:"Earth Science" },
      { time:"1:35 – 2:30",   mon:"Break", tue:"Break", wed:"Break", thu:"Break", fri:"Break" },
      { time:"2:30 – 4:00",   mon:"Economics I", tue:"Economics I", wed:"T: Statistics I", thu:"Biology I", fri:"T: Mathematics I" },
      { time:"4:05 – 5:35",   mon:"T: Economics I", tue:"Biology I", wed:"Earth Science", thu:"T: ITC", fri:"T: Earth Science / T: Biology I" },
    ],
    // optional — leave the whole array out (or empty) to hide this table.
    // "ta" can list more than one name, just as a plain comma-separated string.
    faculty: [
      { course:"Statistics I",             teacher:"Prof. Kaushik Jana",                           ta:"" },
      { course:"Mathematics I",            teacher:"Prof. Jishnu Gupta Biswas",                    ta:"" },
      { course:"Probability I",            teacher:"Prof. Abhay Gopal Bhatt",                      ta:"" },
      { course:"Introduction to Computing",teacher:"Prof. Mandar Mitra",                           ta:"" },
      { course:"Biology I",                teacher:"Prof. Shyamolina Ghosh, Prof. Devendra Meena",       ta:"" },
      { course:"Economics I",              teacher:"Prof. Farzana Afridi",                         ta:"" },
      { course:"Earth System Sciences",    teacher:"Prof. Amlan Banerjee, Prof. Shreya Karmakar",        ta:"" },
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
    { date:"2026-12-05", title:"Study Leave begins", type:"holiday" },
    { date:"2026-12-08", title:"Study Leave ends", type:"holiday" },
    { date:"2026-12-09", title:"End-Semester exams begin", type:"exam" },
    { date:"2026-12-18", title:"End-Semester exams end", type:"exam" },
    { date:"2026-12-19", title:"Semester I ends", type:"event" },
    { date:"2026-12-25", title:"Christmas", type:"holiday" },
  ],
};
