import type {
  AboutAccordionItem,
  AboutFeature,
  AboutSection,
  HeroSection,
  HeroStat,
  ProcessSection,
  ProcessStep,
  ServiceItem,
  ServicesSection,
  SiteContact,
} from "../types/siteContent";

export const DEFAULT_HERO: HeroSection = {
  eyebrow: "Toronto · Chartered Professional Accountants",
  headlineItalic: "Clarity",
  headlinePlain: "for complex Canadian tax & finance.",
  lead: "ISG Consulting partners with owners and leadership teams who expect discretion, precision, and counsel that stands up to scrutiny — from CRA correspondence to strategic planning.",
  ctaPrimaryText: "Schedule a consultation",
  ctaPrimaryHref: "#contact",
  ctaSecondaryText: "Explore services",
  ctaSecondaryHref: "#services",
};

export const DEFAULT_HERO_STATS: HeroStat[] = [
  { id: "default-0", sortOrder: 0, value: "180+", label: "Clients served" },
  { id: "default-1", sortOrder: 1, value: "15+", label: "Years combined experience" },
  { id: "default-2", sortOrder: 2, value: "CPA", label: "Ontario-regulated advisors" },
  { id: "default-3", sortOrder: 3, value: "24h", label: "Typical response time" },
];

export const DEFAULT_SERVICES_SECTION: ServicesSection = {
  sectionLabel: "Services",
  sectionTitle: "Comprehensive assurance for Canadian enterprises.",
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "default-s0",
    sortOrder: 0,
    title: "Tax Services",
    description:
      "Corporate, trust, and personal filing with proactive planning aligned to federal and Ontario regulations.",
  },
  {
    id: "default-s1",
    sortOrder: 1,
    title: "Bookkeeping",
    description:
      "Month-end close, reconciliations, and management reporting tailored to your governance needs.",
  },
  {
    id: "default-s2",
    sortOrder: 2,
    title: "Payroll",
    description: "Remittances, year-end slips, and scalable payroll architecture as your team grows.",
  },
  {
    id: "default-s3",
    sortOrder: 3,
    title: "CRA Audit Support",
    description:
      "Measured representation, documentation strategy, and correspondence handled with rigour.",
  },
  {
    id: "default-s4",
    sortOrder: 4,
    title: "Small Business Financing",
    description:
      "Forecast models, lender-ready statements, and scenario planning for capital decisions.",
  },
  {
    id: "default-s5",
    sortOrder: 5,
    title: "Real Estate Taxation",
    description:
      "Disposition planning, rental structures, and integration with broader wealth objectives.",
  },
];

export const DEFAULT_ABOUT_SECTION: AboutSection = {
  sectionLabel: "About ISG",
  storyTitle: "A Toronto firm built for judgment, not volume.",
  storyText:
    "ISG Consulting was founded on a straightforward premise: Canadian businesses deserve CPA-grade rigour with the attentiveness of a dedicated advisory partner. We serve owner-managed companies, professional practices, and family-held enterprises that value stability, discretion, and precise execution.",
  accordionHeading: "Why clients choose us",
};

export const DEFAULT_ABOUT_FEATURES: AboutFeature[] = [
  { id: "default-af0", sortOrder: 0, bullet: "Senior CPA oversight on every engagement" },
  { id: "default-af1", sortOrder: 1, bullet: "Documentation discipline built for audit readiness" },
  { id: "default-af2", sortOrder: 2, bullet: "Plain-language briefings for directors and stakeholders" },
  { id: "default-af3", sortOrder: 3, bullet: "Cross-border awareness where US exposure exists" },
];

export const DEFAULT_ABOUT_ACCORDION: AboutAccordionItem[] = [
  {
    id: "default-aa0",
    sortOrder: 0,
    title: "Institutional discipline",
    body: "We apply the same structured methodology used by national firms — without the layers, noise, or hourly surprises.",
  },
  {
    id: "default-aa1",
    sortOrder: 1,
    title: "Principal-led service",
    body: "You work with professionals who own the file end-to-end. Expect continuity, accountability, and direct access.",
  },
  {
    id: "default-aa2",
    sortOrder: 2,
    title: "Toronto context",
    body: "From Queen’s Park policy shifts to municipal compliance, our counsel reflects operating realities in Canada’s largest market.",
  },
  {
    id: "default-aa3",
    sortOrder: 3,
    title: "Long-range partnership",
    body: "We optimize for relationships measured in years: proactive calendars, timely reminders, and strategic checkpoints.",
  },
];

export const DEFAULT_PROCESS_SECTION: ProcessSection = {
  sectionLabel: "Process",
  sectionTitle: "From first conversation to enduring counsel.",
};

export const DEFAULT_SITE_CONTACT: SiteContact = {
  officeLine: "Toronto, Ontario — serving clients across Canada",
  addressShort: "Toronto, ON",
  phoneDisplay: "(416) 555-0199",
  phoneHref: "tel:+14165550199",
  email: "hello@isgconsulting.ca",
  footerTagline:
    "Chartered Professional Accountants delivering disciplined advisory for Canadian enterprises.",
  legalFooterLine: "CPA Ontario · Professional standards apply.",
  copyrightEntity: "ISG Consulting",
  brandPrimary: "ISG",
  brandAccent: " Consulting",
};

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    id: "default-ps0",
    sortOrder: 0,
    stepNumber: "01",
    title: "Consultation",
    body: "We align on objectives, risk appetite, and timelines — establishing scope with clarity.",
  },
  {
    id: "default-ps1",
    sortOrder: 1,
    stepNumber: "02",
    title: "Assessment",
    body: "Diagnostic review of records, filings, and exposures informs a prioritized roadmap.",
  },
  {
    id: "default-ps2",
    sortOrder: 2,
    stepNumber: "03",
    title: "Execution",
    body: "Deliverables are prepared to CPA standards, documented for continuity and review.",
  },
  {
    id: "default-ps3",
    sortOrder: 3,
    stepNumber: "04",
    title: "Partnership",
    body: "Ongoing rhythm of monitoring, planning windows, and responsive counsel as needs evolve.",
  },
];
