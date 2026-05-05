import {
  DEFAULT_ABOUT_ACCORDION,
  DEFAULT_ABOUT_FEATURES,
  DEFAULT_ABOUT_SECTION,
  DEFAULT_HERO,
  DEFAULT_HERO_STATS,
  DEFAULT_PROCESS_SECTION,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_SERVICES,
  DEFAULT_SERVICES_SECTION,
  DEFAULT_SITE_CONTACT,
} from "../content/defaults";
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
import { getSupabase } from "./supabase";

type HeroRow = {
  eyebrow: string;
  headline_italic: string;
  headline_plain: string;
  lead: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
};

type HeroStatRow = {
  id: string;
  sort_order: number;
  value: string;
  label: string;
};

type ServicesSectionRow = {
  section_label: string;
  section_title: string;
};

type ServiceRow = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
};

type AboutSectionRow = {
  section_label: string;
  story_title: string;
  story_text: string;
  accordion_heading: string;
};

type AboutFeatureRow = {
  id: string;
  sort_order: number;
  bullet: string;
};

type AboutAccordionRow = {
  id: string;
  sort_order: number;
  title: string;
  body: string;
};

type ProcessSectionRow = {
  section_label: string;
  section_title: string;
};

type ProcessStepRow = {
  id: string;
  sort_order: number;
  step_number: string;
  title: string;
  body: string;
};

type SiteContactRow = {
  office_line: string;
  address_short: string;
  phone_display: string;
  phone_href: string;
  email: string;
  footer_tagline: string;
  legal_footer_line: string;
  copyright_entity: string;
  brand_primary: string;
  brand_accent: string;
};

function mapHero(row: HeroRow): HeroSection {
  return {
    eyebrow: row.eyebrow,
    headlineItalic: row.headline_italic,
    headlinePlain: row.headline_plain,
    lead: row.lead,
    ctaPrimaryText: row.cta_primary_text,
    ctaPrimaryHref: row.cta_primary_href,
    ctaSecondaryText: row.cta_secondary_text,
    ctaSecondaryHref: row.cta_secondary_href,
  };
}

function mapStat(row: HeroStatRow): HeroStat {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    value: row.value,
    label: row.label,
  };
}

function mapServicesSection(row: ServicesSectionRow): ServicesSection {
  return {
    sectionLabel: row.section_label,
    sectionTitle: row.section_title,
  };
}

function mapService(row: ServiceRow): ServiceItem {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    title: row.title,
    description: row.description,
  };
}

function mapAboutSection(row: AboutSectionRow): AboutSection {
  return {
    sectionLabel: row.section_label,
    storyTitle: row.story_title,
    storyText: row.story_text,
    accordionHeading: row.accordion_heading,
  };
}

function mapAboutFeature(row: AboutFeatureRow): AboutFeature {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    bullet: row.bullet,
  };
}

function mapAboutAccordion(row: AboutAccordionRow): AboutAccordionItem {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    title: row.title,
    body: row.body,
  };
}

function mapProcessSection(row: ProcessSectionRow): ProcessSection {
  return {
    sectionLabel: row.section_label,
    sectionTitle: row.section_title,
  };
}

function mapProcessStep(row: ProcessStepRow): ProcessStep {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    stepNumber: row.step_number,
    title: row.title,
    body: row.body,
  };
}

function mapSiteContact(row: SiteContactRow): SiteContact {
  return {
    officeLine: row.office_line,
    addressShort: row.address_short,
    phoneDisplay: row.phone_display,
    phoneHref: row.phone_href,
    email: row.email,
    footerTagline: row.footer_tagline,
    legalFooterLine: row.legal_footer_line,
    copyrightEntity: row.copyright_entity,
    brandPrimary: row.brand_primary,
    brandAccent: row.brand_accent,
  };
}

export type SiteContentBundle = {
  hero: HeroSection;
  heroStats: HeroStat[];
  servicesSection: ServicesSection;
  services: ServiceItem[];
  aboutSection: AboutSection;
  aboutFeatures: AboutFeature[];
  aboutAccordion: AboutAccordionItem[];
  processSection: ProcessSection;
  processSteps: ProcessStep[];
  siteContact: SiteContact;
  source: "supabase" | "defaults";
};

export async function fetchSiteContent(): Promise<SiteContentBundle> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      hero: DEFAULT_HERO,
      heroStats: DEFAULT_HERO_STATS,
      servicesSection: DEFAULT_SERVICES_SECTION,
      services: DEFAULT_SERVICES,
      aboutSection: DEFAULT_ABOUT_SECTION,
      aboutFeatures: DEFAULT_ABOUT_FEATURES,
      aboutAccordion: DEFAULT_ABOUT_ACCORDION,
      processSection: DEFAULT_PROCESS_SECTION,
      processSteps: DEFAULT_PROCESS_STEPS,
      siteContact: DEFAULT_SITE_CONTACT,
      source: "defaults",
    };
  }

  const [
    heroRes,
    statsRes,
    sectionRes,
    servicesRes,
    aboutSecRes,
    aboutFeatRes,
    aboutAccRes,
    procSecRes,
    procStepsRes,
    siteContactRes,
  ] = await Promise.all([
    supabase.from("hero_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("hero_stats").select("*").order("sort_order", { ascending: true }),
    supabase.from("services_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
    supabase.from("about_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("about_features").select("*").order("sort_order", { ascending: true }),
    supabase.from("about_accordion").select("*").order("sort_order", { ascending: true }),
    supabase.from("process_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("process_steps").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_contact").select("*").eq("id", 1).maybeSingle(),
  ]);

  const warn = (label: string, err: { message: string } | null) => {
    if (err) console.warn(`[ISG] ${label}:`, err.message);
  };

  warn("hero_section", heroRes.error);
  warn("hero_stats", statsRes.error);
  warn("services_section", sectionRes.error);
  warn("services", servicesRes.error);
  warn("about_section", aboutSecRes.error);
  warn("about_features", aboutFeatRes.error);
  warn("about_accordion", aboutAccRes.error);
  warn("process_section", procSecRes.error);
  warn("process_steps", procStepsRes.error);
  warn("site_contact", siteContactRes.error);

  const hero =
    !heroRes.error && heroRes.data ? mapHero(heroRes.data as HeroRow) : DEFAULT_HERO;
  const heroStats =
    !statsRes.error && statsRes.data != null
      ? (statsRes.data as HeroStatRow[]).map(mapStat)
      : DEFAULT_HERO_STATS;
  const servicesSection =
    !sectionRes.error && sectionRes.data
      ? mapServicesSection(sectionRes.data as ServicesSectionRow)
      : DEFAULT_SERVICES_SECTION;
  const services =
    !servicesRes.error && servicesRes.data != null
      ? (servicesRes.data as ServiceRow[]).map(mapService)
      : DEFAULT_SERVICES;

  const aboutSection =
    !aboutSecRes.error && aboutSecRes.data
      ? mapAboutSection(aboutSecRes.data as AboutSectionRow)
      : DEFAULT_ABOUT_SECTION;
  const aboutFeatures =
    !aboutFeatRes.error && aboutFeatRes.data != null
      ? (aboutFeatRes.data as AboutFeatureRow[]).map(mapAboutFeature)
      : DEFAULT_ABOUT_FEATURES;
  const aboutAccordion =
    !aboutAccRes.error && aboutAccRes.data != null
      ? (aboutAccRes.data as AboutAccordionRow[]).map(mapAboutAccordion)
      : DEFAULT_ABOUT_ACCORDION;
  const processSection =
    !procSecRes.error && procSecRes.data
      ? mapProcessSection(procSecRes.data as ProcessSectionRow)
      : DEFAULT_PROCESS_SECTION;
  const processSteps =
    !procStepsRes.error && procStepsRes.data != null
      ? (procStepsRes.data as ProcessStepRow[]).map(mapProcessStep)
      : DEFAULT_PROCESS_STEPS;
  const siteContact =
    !siteContactRes.error && siteContactRes.data
      ? mapSiteContact(siteContactRes.data as SiteContactRow)
      : DEFAULT_SITE_CONTACT;

  return {
    hero,
    heroStats,
    servicesSection,
    services,
    aboutSection,
    aboutFeatures,
    aboutAccordion,
    processSection,
    processSteps,
    siteContact,
    source: "supabase",
  };
}
