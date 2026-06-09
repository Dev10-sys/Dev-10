import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { ProjectsPreview } from "@/components/projects-preview";
import { OpenSourcePreview } from "@/components/open-source-preview";
import { ExtendedCapabilities } from "@/components/extended-capabilities";
import { ContactForm } from "@/components/contact-form";
import { ImportantLinks } from "@/components/links";

export default function Page() {
  return (
    <main className="bg-background text-foreground min-h-screen relative font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Global animated scanline */}
      <div className="scanline-overlay" />

      {/* Global grain/noise overlay for texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none z-0" />

      {/* Navbar with floating dynamic pill */}
      <Navbar />

      <Hero />

      <section id="about" className="relative border-t border-border/40 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <About />
      </section>

      <section id="skills" className="relative border-t border-border/40 py-12">
        <Skills />
      </section>

      <section id="projects" className="relative border-t border-border/40 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50 pointer-events-none" />
        <ProjectsPreview />
      </section>

      <section id="open-source" className="relative border-t border-border/40 py-12">
        <OpenSourcePreview />
      </section>

      <section id="extended" className="relative border-t border-border/40 py-12">
        <ExtendedCapabilities />
      </section>

      <section id="contact" className="relative border-t border-border/40 pt-12 pb-24">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="space-y-12">
          <ContactForm />
          <ImportantLinks />
        </div>
      </section>

      <footer className="relative border-t border-border/40 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="os-window px-8 py-4 inline-flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
              System Online · Open to Opportunities
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-2xl tracking-tighter uppercase text-muted-foreground/40">
              DEV10-SYS
            </h4>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/30">
              © {new Date().getFullYear()} / Systems. Security. Infrastructure.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
