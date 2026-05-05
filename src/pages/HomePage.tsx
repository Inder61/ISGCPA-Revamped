import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Process } from "../components/Process";
import { Services } from "../components/Services";
import { SiteContentProvider } from "../context/SiteContentContext";

export function HomePage() {
  return (
    <SiteContentProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </SiteContentProvider>
  );
}
