import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
import { fetchSiteContent, type SiteContentBundle } from "../lib/fetchSiteContent";
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

type Status = "idle" | "loading" | "ready" | "error";

type SiteContentContextValue = {
  status: Status;
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
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [bundle, setBundle] = useState<SiteContentBundle | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchSiteContent();
      setBundle(data);
      setStatus("ready");
    } catch (e) {
      console.error("[ISG] Failed to load site content", e);
      setBundle(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<SiteContentContextValue>(() => {
    const effective =
      bundle ??
      ({
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
        source: "defaults" as const,
      } satisfies SiteContentBundle);
    return {
      status,
      hero: effective.hero,
      heroStats: effective.heroStats,
      servicesSection: effective.servicesSection,
      services: effective.services,
      aboutSection: effective.aboutSection,
      aboutFeatures: effective.aboutFeatures,
      aboutAccordion: effective.aboutAccordion,
      processSection: effective.processSection,
      processSteps: effective.processSteps,
      siteContact: effective.siteContact,
      source: effective.source,
      refresh: load,
    };
  }, [status, bundle, load]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}
