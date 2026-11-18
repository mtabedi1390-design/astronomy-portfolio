/**
 * Page copy and resume data.
 * Zero-fake rule: every value here comes from the resume, from a cited source,
 * or is counted from these arrays at render time. Nothing is estimated.
 */

export const person = {
  name: 'Mohammad Taha Abedi Roudmajani',
  nameFa: 'محمد طاها عابدی رودمعجنی',
  shortName: 'Mohammad Taha Abedi',
  field: 'Astronomy & Scientific Computing',
  school: 'Imam Jafar Sadegh School',
  location: 'Tehran, Iran',
  email: 'm.t.abedi1390@gmail.com',
  phoneDisplay: '+98 912 778 5124',
  phoneHref: '+989127785124',
  timeZone: 'Asia/Tehran',
} as const;

/** Observing sites for the sky panel. Longitudes are east-positive. */
export const sites = {
  tehran: {
    label: 'Tehran',
    tag: 'Researcher',
    lat: 35.6892,
    lon: 51.389,
    coords: '35.69° N  51.39° E',
    timeZone: 'Asia/Tehran',
  },
  palomar: {
    label: 'Palomar',
    tag: 'ZTF · MPC I41',
    lat: 33.3582,
    lon: -116.8618,
    coords: '33.36° N  116.86° W',
    timeZone: 'America/Los_Angeles',
  },
} as const;

export type SiteId = keyof typeof sites;

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'faq', label: 'FAQ' },
] as const;

/** Builds a pre-filled email link. */
export function mailTo(subject: string, body?: string): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${person.email}?${params.join('&')}`;
}

export const mailBody =
  'Hello Mohammad Taha,\n\nI would like to discuss a possible collaboration.\n\nName:\nInstitution / lab:\nResearch area:\nBrief context:\n\nBest regards,';

/* ---------------------------------------------------------------- Hero */

export const hero = {
  distinction: 'Top Researcher of 1405',
  distinctionScope: 'Pardis',
  headline: ['Searching archival ZTF frames for objects that move.', 'Studying how primordial black holes evaporate.'],
  lede: "I'm a 16-year-old student researcher in astronomy, theoretical astrophysics and scientific computing, in 9th grade at Imam Jafar Sadegh School in Tehran. I write Python pipelines for archival sky-survey data, and I'm preparing a theoretical manuscript on evaporating primordial black holes. My training also covers artificial intelligence.",
} as const;

export const identity: readonly { k: string; v: string; fa?: string }[] = [
  { k: 'Name', v: person.name, fa: person.nameFa },
  { k: 'Role', v: '16-year-old student researcher' },
  { k: 'School', v: 'Imam Jafar Sadegh School, Tehran · 9th grade' },
  { k: 'Fields', v: 'Astronomy · Theoretical astrophysics · Scientific computing' },
];

/* ------------------------------------------------------ Record summary */

export const recordSummary = [
  { when: '1404 · 1405', result: '1st place', body: 'Kharazmi Youth Festival', scope: 'Provincial stage' },
  { when: '1405', result: 'Top Researcher', body: 'Researcher of the Year', scope: 'Pardis' },
  { when: '1401', result: '2nd place', body: 'Little Scientist Festival', scope: 'Tehran Province' },
  { when: 'Certificates', result: 'AI: introductory and advanced', body: 'TechnoSharif Academy', scope: 'Two certificates' },
] as const;

/* --------------------------------------------------------------- About */

export const about = {
  title: 'A student researcher working on survey data and black-hole theory.',
  paragraphs: [
    "I'm Mohammad Taha Abedi Roudmajani, a 16-year-old student researcher in Tehran, in 9th grade at Imam Jafar Sadegh School. My work covers observational astronomy, theoretical astrophysics and scientific computing.",
    "On the observational side I process archival survey images: FITS frames in, source catalogs out, then a search for anything that moved. On the theory side I'm writing up a study of evaporating primordial black holes. Both lines are in progress, and neither has published results yet.",
    "I'm looking for a mentor who can check my methods, and for collaborators who work with survey data or black-hole theory.",
  ],
  scope: [
    {
      code: 'OBS',
      title: 'Observational astronomy',
      text: 'Archival ZTF data, FITS image processing, source extraction, frame catalogs and moving-object candidates.',
    },
    {
      code: 'THY',
      title: 'Theoretical astrophysics',
      text: 'Evaporating primordial black holes, Hawking radiation, Loop Quantum Gravity, Memory Burden, fast radio bursts and short gamma-ray bursts.',
    },
    {
      code: 'CMP',
      title: 'Scientific computing',
      text: 'Python on Linux / WSL for astronomical data processing, with MATLAB at beginner level.',
    },
  ],
} as const;

export interface FitsCard {
  key: string;
  value?: string;
  type?: 'string' | 'number' | 'logical';
  comment?: string;
  lang?: 'fa';
}

/** The profile, written in the keyword = value / comment notation of a FITS header. */
export const fitsCards: readonly FitsCard[] = [
  { key: 'SIMPLE', value: 'T', type: 'logical', comment: 'FITS header notation' },
  { key: 'AUTHOR', value: person.name, type: 'string' },
  { key: 'NAMEFA', value: person.nameFa, type: 'string', lang: 'fa' },
  { key: 'ROLE', value: 'Student researcher', type: 'string' },
  { key: 'AGE', value: '16', type: 'number', comment: '[yr]' },
  { key: 'GRADE', value: '9', type: 'number', comment: 'current school year' },
  { key: 'ORIGIN', value: person.school, type: 'string', comment: 'Tehran' },
  { key: 'SITE', value: person.location, type: 'string' },
  { key: 'SITELAT', value: '35.6892', type: 'number', comment: '[deg] north, city center' },
  { key: 'SITELONG', value: '51.3890', type: 'number', comment: '[deg] east, city center' },
  { key: 'TIMEZONE', value: 'UTC+03:30', type: 'string', comment: 'Iran Standard Time' },
  { key: 'LANG1', value: 'Persian', type: 'string', comment: 'native' },
  { key: 'LANG2', value: 'English', type: 'string', comment: 'beginner' },
  { key: 'FIELD1', value: 'Observational astronomy', type: 'string' },
  { key: 'FIELD2', value: 'Theoretical astrophysics', type: 'string' },
  { key: 'FIELD3', value: 'Scientific computing', type: 'string' },
  { key: 'COMMENT', comment: 'Open to mentorship and research collaboration.' },
  { key: 'END' },
];

/* ------------------------------------------------------------ Research */

export interface Project {
  id: string;
  code: string;
  name: string;
  field: string;
  status: { state: 'active' | 'draft'; label: string; detail: string };
  summary: string;
  facts: readonly { k: string; v: string }[];
  openTo: string;
  mailSubject: string;
}

export const researchNote =
  'No results are reported on this page. AsteroidHunter is ongoing work and The Last Cosmic Survivors is an unreviewed manuscript. The two calculators beside the projects are textbook reference models, added for context, with their assumptions listed.';

export const projects: readonly Project[] = [
  {
    id: 'asteroidhunter',
    code: 'P-01',
    name: 'AsteroidHunter',
    field: 'Observational astronomy · Data processing',
    status: { state: 'active', label: 'Active research line', detail: 'Ongoing' },
    summary:
      'A processing pipeline for archival Zwicky Transient Facility (ZTF) data that looks for moving-object candidates, including asteroids. It processes the FITS images, extracts the sources in each frame, writes them to frame catalogs, and uses those catalogs to find objects that changed position.',
    facts: [
      { k: 'Input', v: 'Archival ZTF data (FITS images)' },
      { k: 'Output', v: 'Moving-object candidates, including asteroids' },
      { k: 'Stack', v: 'Python · Linux / WSL · ZTF · FITS' },
      { k: 'Status', v: 'Active research line' },
    ],
    openTo: 'Open to mentorship in observational methods and to collaborators with survey-data experience.',
    mailSubject: 'AsteroidHunter: research collaboration inquiry',
  },
  {
    id: 'last-cosmic-survivors',
    code: 'P-02',
    name: 'The Last Cosmic Survivors',
    field: 'Theoretical astrophysics',
    status: { state: 'draft', label: 'Manuscript in preparation', detail: 'Unpublished · not peer-reviewed' },
    summary:
      'A theoretical study of possible links between evaporating primordial black holes (PBHs) and two kinds of transient: fast radio bursts (FRBs) and short gamma-ray bursts (SGRBs). The mechanisms examined are Hawking radiation, Loop Quantum Gravity (LQG) and Memory Burden.',
    facts: [
      { k: 'Objects', v: 'Evaporating primordial black holes (PBHs)' },
      { k: 'Signals', v: 'Fast radio bursts (FRBs) · Short gamma-ray bursts (SGRBs)' },
      { k: 'Mechanisms', v: 'Hawking radiation · Loop Quantum Gravity (LQG) · Memory Burden' },
      { k: 'Output', v: 'Manuscript, in preparation' },
      { k: 'Review', v: 'None yet: unpublished, not peer-reviewed' },
    ],
    openTo: 'Open to feedback from researchers in theoretical astrophysics.',
    mailSubject: 'The Last Cosmic Survivors: manuscript feedback',
  },
];

export const pipelineStages = [
  { id: 'S1', operation: 'FITS image processing', product: 'Processed frames' },
  { id: 'S2', operation: 'Source extraction', product: 'Sources per frame' },
  { id: 'S3', operation: 'Frame catalogs', product: 'One catalog per frame' },
  { id: 'S4', operation: 'Moving-object detection', product: 'Candidates, including asteroids' },
] as const;

/** Published instrument values for the survey whose archive the pipeline reads. */
export const ztfSpecs = [
  { k: 'Facility', v: 'Zwicky Transient Facility, Palomar Observatory' },
  { k: 'Telescope', v: '48-inch (1.2 m) Samuel Oschin Schmidt' },
  { k: 'Camera', v: '16 CCDs, 6144 × 6160 px each' },
  { k: 'Field', v: '47 deg² per exposure' },
  { k: 'Pixel scale', v: '1.01″ per pixel' },
  { k: 'Filters', v: 'ZTF-g, ZTF-r, ZTF-i' },
  { k: 'MPC code', v: 'I41' },
] as const;

/* -------------------------------------------------------------- Skills */

export interface SkillGroup {
  code: string;
  title: string;
  items: readonly { name: string; note?: string }[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    code: 'CMP',
    title: 'Scientific Computing',
    items: [
      { name: 'Python' },
      { name: 'Linux / WSL' },
      { name: 'Astronomical data processing' },
      { name: 'MATLAB', note: 'Beginner' },
    ],
  },
  {
    code: 'AI',
    title: 'Artificial Intelligence',
    items: [
      { name: 'AI fundamentals' },
      { name: 'TechnoSharif introductory AI', note: 'Certificate' },
      { name: 'TechnoSharif advanced AI', note: 'Certificate' },
    ],
  },
  {
    code: 'ENG',
    title: 'Engineering & CAD',
    items: [
      { name: 'Altium Designer', note: 'PCB design' },
      { name: 'SolidWorks', note: '3D CAD' },
      { name: 'Scratch' },
    ],
  },
  {
    code: 'SFT',
    title: 'Soft Skills',
    items: [
      { name: 'Problem solving' },
      { name: 'Analytical thinking' },
      { name: 'Independent learning' },
      { name: 'Teamwork' },
      { name: 'Time management' },
      { name: 'Presentation' },
    ],
  },
  {
    code: 'LNG',
    title: 'Languages',
    items: [
      { name: 'Persian', note: 'Native' },
      { name: 'English', note: 'Beginner' },
    ],
  },
  {
    code: 'INT',
    title: 'Research Interests',
    items: [
      { name: 'Observational astronomy' },
      { name: 'Moving objects and asteroids' },
      { name: 'Primordial black holes' },
      { name: 'Cosmology' },
      { name: 'AI' },
      { name: 'Scientific computing' },
    ],
  },
];

/* -------------------------------------------------------------- Honors */

/** Solar Hijri year, with the Gregorian years it overlaps. Newest first. */
export const honors = [
  { sh: 1405, ce: '2026/27', award: 'Top Researcher', event: 'Researcher of the Year', level: 'Pardis' },
  { sh: 1405, ce: '2026/27', award: '1st place', event: 'Kharazmi Youth Festival', level: 'Provincial stage' },
  { sh: 1404, ce: '2025/26', award: '1st place', event: 'Kharazmi Youth Festival', level: 'Provincial stage' },
  { sh: 1401, ce: '2022/23', award: '2nd place', event: 'Little Scientist Festival', level: 'Tehran Province' },
] as const;

export const education = {
  school: person.school,
  place: person.location,
  level: '9th grade',
  status: 'Current',
} as const;

export const certificates = {
  issuer: 'TechnoSharif Academy',
  items: ['Introductory AI certificate', 'Advanced AI certificate'],
} as const;

/* ----------------------------------------------------------------- FAQ */

export const faqs = [
  {
    id: 'focus',
    question: 'What are you working on now?',
    answer:
      'Two lines. AsteroidHunter is a pipeline that processes archival ZTF FITS images, extracts sources, builds frame catalogs and searches them for moving-object candidates such as asteroids. The Last Cosmic Survivors is a theoretical manuscript on possible links between evaporating primordial black holes and fast radio bursts or short gamma-ray bursts, through Hawking radiation, Loop Quantum Gravity and Memory Burden.',
  },
  {
    id: 'availability',
    question: 'Are you available for mentorship or research collaboration?',
    answer:
      "Yes. I'm looking for mentorship from university professors and research mentors, and for collaboration with astrophysics labs, scientific institutions and technical collaborators. I'm in school full time, so email is the best first contact.",
  },
  {
    id: 'publication',
    question: 'Has the theoretical manuscript been published?',
    answer:
      'No. The Last Cosmic Survivors is in preparation. It is unpublished and has not been peer-reviewed, so its conclusions are provisional until it has been reviewed.',
  },
  {
    id: 'results',
    question: 'Does this page show results from your projects?',
    answer:
      'No. AsteroidHunter is ongoing and the manuscript is unreviewed, so no detections or findings are claimed here. The sky chart plots catalog star positions for the current time. The motion and evaporation panels compute textbook relations, and each lists its assumptions and sources.',
  },
  {
    id: 'tools',
    question: 'What tools do you use?',
    answer:
      "Python on Linux / WSL for astronomical data processing, with MATLAB at beginner level. I hold the introductory and advanced AI certificates from TechnoSharif Academy, and I've used Altium Designer for PCB design, SolidWorks for 3D CAD, and Scratch.",
  },
  {
    id: 'language',
    question: 'Which languages can you work in?',
    answer:
      'Persian is my native language. My English is at beginner level, so written messages in plain English or in Persian work best.',
  },
] as const;

/* ------------------------------------------------------------- Contact */

export const contactTopics = [
  { id: 'mentorship', label: 'Academic mentorship', subject: 'Academic mentorship inquiry' },
  { id: 'lab', label: 'Lab collaboration', subject: 'Research lab collaboration inquiry' },
  { id: 'data', label: 'Data and software', subject: 'Data pipeline and scientific computing collaboration' },
  { id: 'theory', label: 'Manuscript feedback', subject: 'Theoretical astrophysics manuscript feedback' },
] as const;

/* ------------------------------------------------------------- Sources */

export const references = [
  {
    text: 'Dekany, R., et al. (2020). The Zwicky Transient Facility: Observing System. PASP 132, 038001.',
    use: 'ZTF camera, pixel scale and field of view',
  },
  {
    text: 'Hawking, S. W. (1974). Black hole explosions? Nature 248, 30–31.',
    use: 'temperature and lifetime relations',
  },
  {
    text: 'Carr, B. J., Kohri, K., Sendouda, Y., & Yokoyama, J. (2010). New cosmological constraints on primordial black holes. Phys. Rev. D 81, 104019.',
    use: 'M*, the initial mass that finishes evaporating today',
  },
  {
    text: 'Planck Collaboration (2020). Planck 2018 results VI: Cosmological parameters. A&A 641, A6.',
    use: 'age of the universe',
  },
  {
    text: 'Fixsen, D. J. (2009). The temperature of the cosmic microwave background. ApJ 707, 916–920.',
    use: 'CMB temperature',
  },
  {
    text: 'Tiesinga, E., et al. (2021). CODATA recommended values of the fundamental physical constants: 2018. Rev. Mod. Phys. 93, 025010.',
    use: 'physical constants',
  },
  {
    text: 'Meeus, J. (1998). Astronomical Algorithms, 2nd ed. Willmann-Bell.',
    use: 'sidereal time and coordinate transforms',
  },
  {
    text: 'The Astronomical Almanac, low-precision formulas for the Sun. U.S. Naval Observatory and HM Nautical Almanac Office.',
    use: 'solar altitude and twilight state',
  },
  {
    text: 'Anderson, E., & Francis, C. (2012). XHIP: An extended Hipparcos compilation. Astronomy Letters 38, 331–346.',
    use: 'star positions and magnitudes',
  },
  {
    text: 'Frohn, O. d3-celestial data files. BSD 3-Clause License.',
    use: 'star names and constellation figures',
  },
] as const;
