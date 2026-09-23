export type ScholarshipTabKey = "closing" | "funded" | "verified";

export interface ScholarshipSummary {
  slug: string;
  initials: string;
  name: string;
  org: string;
  level: string;
  field: string;
  funding: string;
  amount: string;
  deadlineLabel: string;
  urgent: boolean;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface HowItWorksStep {
  n: string;
  title: string;
  body: string;
}

export interface MatchReason {
  text: string;
}

export interface ProfileChecklistItem {
  mark: "✓" | "!";
  done: boolean;
  label: string;
  hint: string;
}

export interface AdviserService {
  icon: string;
  title: string;
  body: string;
  price: string;
  count: string;
}

export interface FeaturedAdviser {
  initials: string;
  name: string;
  role: string;
  rating: string;
  reviews: string;
  langs: string;
  price: string;
}

export interface CvBlock {
  heading: string;
  lines: { w: string }[];
}

export interface CvPoint {
  title: string;
  body: string;
}

export interface GuideCard {
  kicker: string;
  title: string;
  meta: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  initials: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string }[];
}

export const degreeLevelOptions = [
  "Any level",
  "Bachelor",
  "Master's",
  "PhD",
  "Postdoc",
  "Language course",
] as const;

export const quickSearches: { label: string; query: string }[] = [
  { label: "Fully funded Master’s", query: "Fully funded" },
  { label: "Engineering", query: "Engineering" },
  { label: "DAAD", query: "DAAD" },
  { label: "No tuition fees", query: "No tuition fees" },
  { label: "Closing in 30 days", query: "Closing soon" },
];

export const trustStats: TrustStat[] = [
  { value: "1,842", label: "Verified scholarships for Germany" },
  { value: "214", label: "Approved freelance advisers" },
  { value: "316", label: "Listings updated this month" },
  { value: "48h", label: "Sources checked regularly" },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    n: "01",
    title: "Create your profile",
    body: "Degree, GPA, nationality, language level and intended intake — four minutes, no documents needed.",
  },
  {
    n: "02",
    title: "Discover matching scholarships",
    body: "We filter 1,842 listings down to the ones whose eligibility rules you actually satisfy.",
  },
  {
    n: "03",
    title: "Prepare or hire help",
    body: "Build your CV and letters yourself, or book a vetted adviser for the parts you want reviewed.",
  },
  {
    n: "04",
    title: "Track and submit",
    body: "One board per application with deadlines, required documents and submission status.",
  },
];

export const scholarshipTabs: { key: ScholarshipTabKey; label: string }[] = [
  { key: "closing", label: "Closing soon" },
  { key: "funded", label: "Fully funded" },
  { key: "verified", label: "Recently verified" },
];

export const scholarshipsByTab: Record<ScholarshipTabKey, ScholarshipSummary[]> = {
  closing: [
    { slug: "daad-epos-postgraduate", initials: "DA", name: "DAAD EPOS Development-Related Postgraduate", org: "DAAD · Germany-wide", level: "Master's", field: "Engineering", funding: "Fully funded", amount: "€992/mo + travel", deadlineLabel: "11 days left", urgent: true },
    { slug: "heinrich-boell-scholarship", initials: "HB", name: "Heinrich Böll Foundation Scholarship", org: "Heinrich-Böll-Stiftung · Berlin", level: "Master / PhD", field: "Social Sciences", funding: "Fully funded", amount: "€934/mo + tuition", deadlineLabel: "18 days left", urgent: true },
    { slug: "kaad-scholarship", initials: "KA", name: "KAAD Scholarship for Developing Countries", org: "KAAD · Bonn", level: "Master / PhD", field: "Any field", funding: "Fully funded", amount: "€1,050/mo", deadlineLabel: "23 days left", urgent: false },
    { slug: "tum-sustainable-futures-grant", initials: "TU", name: "TUM Sustainable Futures Grant", org: "TU München · Bavaria", level: "Master's", field: "Sustainability", funding: "Partial", amount: "€6,000/year", deadlineLabel: "26 days left", urgent: false },
    { slug: "deutschlandstipendium-rwth-aachen", initials: "DB", name: "Deutschlandstipendium (RWTH Aachen)", org: "RWTH Aachen · NRW", level: "Bachelor / Master", field: "STEM", funding: "Partial", amount: "€300/mo", deadlineLabel: "29 days left", urgent: false },
    { slug: "erasmus-joint-master-mobility", initials: "ES", name: "Erasmus+ Joint Master Mobility", org: "European Commission", level: "Master's", field: "Multiple", funding: "Fully funded", amount: "€1,400/mo", deadlineLabel: "34 days left", urgent: false },
  ],
  funded: [
    { slug: "humboldt-research-fellowship", initials: "AV", name: "Humboldt Research Fellowship", org: "Alexander von Humboldt Stiftung", level: "Postdoc", field: "All research", funding: "Fully funded", amount: "€2,670/mo", deadlineLabel: "Rolling", urgent: false },
    { slug: "max-planck-imprs-doctoral", initials: "MP", name: "Max Planck IMPRS Doctoral Programme", org: "Max Planck Society", level: "PhD", field: "Sciences", funding: "Fully funded", amount: "Full TV-L 13 contract", deadlineLabel: "2 Nov 2026", urgent: false },
    { slug: "konrad-adenauer-graduate-grant", initials: "KO", name: "Konrad-Adenauer-Stiftung Graduate Grant", org: "KAS · Sankt Augustin", level: "Master / PhD", field: "Politics, Law", funding: "Fully funded", amount: "€934/mo + seminars", deadlineLabel: "15 Dec 2026", urgent: false },
    { slug: "friedrich-ebert-scholarship", initials: "FE", name: "Friedrich-Ebert-Stiftung Scholarship", org: "FES · Bonn", level: "Bachelor–PhD", field: "Any field", funding: "Fully funded", amount: "€861/mo", deadlineLabel: "30 Nov 2026", urgent: false },
    { slug: "daad-helmut-schmidt-public-policy", initials: "DA", name: "DAAD Helmut-Schmidt Public Policy", org: "DAAD · Multiple unis", level: "Master's", field: "Public Policy", funding: "Fully funded", amount: "€992/mo + tuition", deadlineLabel: "31 Jul 2027", urgent: false },
    { slug: "bayer-otto-bayer-fellowship", initials: "BA", name: "Bayer Foundation Otto Bayer Fellowship", org: "Bayer Foundation", level: "Master / PhD", field: "Life Sciences", funding: "Fully funded", amount: "up to €10,000", deadlineLabel: "1 Mar 2027", urgent: false },
  ],
  verified: [
    { slug: "lmu-munich-international-merit-award", initials: "LM", name: "LMU Munich International Merit Award", org: "LMU München · Bavaria", level: "Master's", field: "Humanities", funding: "Partial", amount: "€500/mo", deadlineLabel: "12 Jan 2027", urgent: false },
    { slug: "hu-berlin-elsa-neumann-grant", initials: "HU", name: "Humboldt-Universität Elsa-Neumann Grant", org: "HU Berlin · Berlin", level: "PhD", field: "All fields", funding: "Fully funded", amount: "€1,200/mo", deadlineLabel: "1 Oct 2026", urgent: true },
    { slug: "kit-study-completion-scholarship", initials: "KI", name: "KIT Study Completion Scholarship", org: "KIT Karlsruhe · BW", level: "Master's", field: "Engineering", funding: "Partial", amount: "€750/mo (6 mo)", deadlineLabel: "20 Oct 2026", urgent: true },
    { slug: "stiftung-der-deutschen-wirtschaft", initials: "SB", name: "Stiftung der Deutschen Wirtschaft", org: "sdw · Berlin", level: "Bachelor / Master", field: "Business, STEM", funding: "Fully funded", amount: "€300/mo + programme", deadlineLabel: "15 Feb 2027", urgent: false },
    { slug: "uni-hamburg-merit-scholarship", initials: "UH", name: "Uni Hamburg Merit Scholarship", org: "Universität Hamburg", level: "Master's", field: "Climate Science", funding: "Partial", amount: "€4,800/year", deadlineLabel: "28 Feb 2027", urgent: false },
    { slug: "goethe-institut-language-grant", initials: "GS", name: "Goethe-Institut Language Grant", org: "Goethe-Institut", level: "Pre-study", field: "German B2/C1", funding: "Fully funded", amount: "Course + housing", deadlineLabel: "5 Dec 2026", urgent: false },
  ],
};

export const matchReasons: MatchReason[] = [
  { text: "BEng Mechanical Engineering, 2:1 — meets the 2.5 German-grade minimum" },
  { text: "Nigerian nationality is on the EPOS partner-country list" },
  { text: "2 years professional experience — EPOS requires 2+" },
  { text: "IELTS 7.0 covers the English-taught programme requirement" },
];

export const profileCompleteness = 72;

export const profileChecklist: ProfileChecklistItem[] = [
  { mark: "✓", done: true, label: "Academic background", hint: "Complete" },
  { mark: "✓", done: true, label: "Nationality & intake", hint: "Complete" },
  { mark: "✓", done: true, label: "Language certificates", hint: "IELTS 7.0" },
  { mark: "!", done: false, label: "Work experience", hint: "Add 1 role" },
  { mark: "!", done: false, label: "Target fields of study", hint: "Pick 3" },
];

export const adviserServices: AdviserService[] = [
  { icon: "E", title: "Eligibility assessment", body: "An adviser reads the funder rules against your documents and tells you where you stand.", price: "from €15", count: "182 advisers" },
  { icon: "S", title: "Scholarship shortlist", body: "A ranked list of 8–12 realistic scholarships with deadlines and required documents.", price: "from €35", count: "140 advisers" },
  { icon: "C", title: "CV creation", body: "German-format academic CV written with you, exported ATS-clean in PDF and DOCX.", price: "from €30", count: "166 advisers" },
  { icon: "M", title: "Motivation-letter coaching", body: "Two or three revision rounds on structure, evidence and tone for a specific funder.", price: "from €45", count: "151 advisers" },
  { icon: "D", title: "Document review", body: "Transcripts, APS, translations and certification checked before you upload anything.", price: "from €25", count: "118 advisers" },
  { icon: "I", title: "Interview preparation", body: "Mock panel in English or German with written feedback on your answers.", price: "from €40", count: "96 advisers" },
];

export const featuredAdvisers: FeaturedAdviser[] = [
  { initials: "NK", name: "Nadia K.", role: "Ex-DAAD reviewer · Bonn", rating: "4.9", reviews: "312", langs: "German (native) · English · Arabic", price: "€45" },
  { initials: "TO", name: "Tobias O.", role: "Admissions officer, TU Berlin", rating: "4.8", reviews: "188", langs: "German (native) · English", price: "€38" },
  { initials: "PS", name: "Priya S.", role: "MSc TUM · 6 yrs coaching", rating: "5.0", reviews: "241", langs: "English · Hindi · German B2", price: "€30" },
  { initials: "AM", name: "Ahmed M.", role: "CV & ATS specialist · Köln", rating: "4.9", reviews: "204", langs: "Arabic · English · German C1", price: "€25" },
];

export const cvBlocks: CvBlock[] = [
  { heading: "EDUCATION", lines: [{ w: "92%" }, { w: "74%" }, { w: "58%" }] },
  { heading: "RESEARCH EXPERIENCE", lines: [{ w: "88%" }, { w: "96%" }, { w: "66%" }] },
  { heading: "LANGUAGES & CERTIFICATES", lines: [{ w: "70%" }, { w: "45%" }] },
];

export const cvPoints: CvPoint[] = [
  { title: "ATS-friendly by construction", body: "single column, real text, no tables or graphics that parsers drop." },
  { title: "Funder-specific variants", body: "keep one master profile, export a tailored CV per scholarship." },
  { title: "PDF and DOCX export", body: "unlimited downloads, plus a link advisers can comment on." },
];

export const guidesFeatured: GuideCard = {
  kicker: "NEW · SEPT 2026",
  title: "The DAAD application, page by page",
  meta: "Every field, every attachment, and the four mistakes that get files closed early. 18 min read.",
};

export const guidesColumnA: GuideCard[] = [
  { kicker: "BY DEGREE LEVEL", title: "Master's funding in Germany: the 9 routes", meta: "12 min · updated Sept 2026" },
  { kicker: "BY NATIONALITY", title: "Applying from Nigeria: APS, visa, funding", meta: "9 min · updated Aug 2026" },
];

export const guidesColumnB: GuideCard[] = [
  { kicker: "POPULAR", title: "Motivation letters that survive the first cut", meta: "14 min · 41k reads" },
  { kicker: "GERMANY 101", title: "Blocked account, health cover, semester fees", meta: "11 min · updated Sept 2026" },
];

export const testimonials: Testimonial[] = [
  { quote: "The adviser rewrote my motivation letter in two rounds. DAAD EPOS accepted me for Kassel — I had been rejected twice applying alone.", name: "Amara Okonjo", detail: "MSc Renewable Energy · Uni Kassel · Nigeria", initials: "AO" },
  { quote: "Matching saved me weeks. It showed 14 scholarships I qualified for and explained exactly which rule I failed on the rest.", name: "Rahul Mehta", detail: "MSc Robotics · TU München · India", initials: "RM" },
  { quote: "My CV finally looked German. Same experience, better structure, and three interview invitations in one month.", name: "Lina Haddad", detail: "MA Public Policy · HU Berlin · Jordan", initials: "LH" },
];

export const faqs: Faq[] = [
  { q: "Is the scholarship database really verified?", a: "Every listing is checked against the funder's official page before publishing and re-checked at least monthly. Each card shows the date of its last verification, and dead listings are removed, not archived quietly." },
  { q: "How are advisers approved?", a: "Advisers submit identity documents, proof of their own German study or admissions experience, and two client references. We interview each one, and profiles show only reviews from bookings paid through the platform." },
  { q: "What does an adviser cost?", a: "Advisers set their own prices per service — eligibility checks start around €15, CV reviews around €30, and full application coaching from €120. You pay per job, not per package." },
  { q: "Is my payment protected?", a: "Payment is held until you confirm the delivery. If the work is not delivered as described, you can open a dispute within 14 days and we refund from escrow." },
  { q: "Do you guarantee I will get a scholarship?", a: "No, and any adviser who promises that is violating our policy. We make your application competitive and your deadlines visible — committees make the decision." },
];

export const socials = ["IG", "LI", "YT", "X"];

export const footerColumns: FooterColumn[] = [
  { title: "SCHOLARSHIPS", links: [{ label: "By degree level" }, { label: "By field of study" }, { label: "Fully funded" }, { label: "Closing soon" }, { label: "By university" }] },
  { title: "ADVISER SERVICES", links: [{ label: "CV review" }, { label: "Eligibility checks" }, { label: "Application coaching" }, { label: "Interview prep" }, { label: "Become an adviser" }] },
  { title: "RESOURCES", links: [{ label: "Application guides" }, { label: "FAQs" }, { label: "Study in Germany" }, { label: "Visa & blocked account" }, { label: "CV Builder" }] },
  { title: "COMPANY", links: [{ label: "About us" }, { label: "Contact" }, { label: "Careers" }, { label: "Press" }] },
  { title: "TRUST & LEGAL", links: [{ label: "Adviser policy" }, { label: "Terms of service" }, { label: "Privacy" }, { label: "Cookies" }, { label: "Refund policy" }] },
];

export const legalLinks = [
  { label: "Adviser policy" },
  { label: "Terms" },
  { label: "Privacy" },
  { label: "Cookies" },
  { label: "Refunds" },
];
