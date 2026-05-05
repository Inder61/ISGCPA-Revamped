export type HeroSection = {
  eyebrow: string;
  headlineItalic: string;
  headlinePlain: string;
  lead: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
};

export type HeroStat = {
  id: string;
  sortOrder: number;
  value: string;
  label: string;
};

export type ServicesSection = {
  sectionLabel: string;
  sectionTitle: string;
};

export type ServiceItem = {
  id: string;
  sortOrder: number;
  title: string;
  description: string;
};

export type AboutSection = {
  sectionLabel: string;
  storyTitle: string;
  storyText: string;
  accordionHeading: string;
};

export type AboutFeature = {
  id: string;
  sortOrder: number;
  bullet: string;
};

export type AboutAccordionItem = {
  id: string;
  sortOrder: number;
  title: string;
  body: string;
};

export type ProcessSection = {
  sectionLabel: string;
  sectionTitle: string;
};

export type ProcessStep = {
  id: string;
  sortOrder: number;
  stepNumber: string;
  title: string;
  body: string;
};

/** Single row: phone, email, addresses, footer wordmark + taglines */
export type SiteContact = {
  officeLine: string;
  addressShort: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  footerTagline: string;
  legalFooterLine: string;
  copyrightEntity: string;
  brandPrimary: string;
  brandAccent: string;
};
