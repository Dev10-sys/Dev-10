import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { ProjectsPreview } from "@/components/projects-preview";
import { OpenSourcePreview } from "@/components/open-source-preview";
import { ContactForm } from "@/components/contact-form";
import { ImportantLinks } from "@/components/links";

export default function Page() {
  return (
    <main className="bg-background text-foreground min-h-screen relative font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Global animated scanline */}
      <div className="scanline-overlay" />

      {/* Global grain/noise overlay for texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none z-0" />

      <Navbar />

      <Hero />

      <section id="about" className="relative border-t border-border/40 py-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none" />
        <About />
      </section>

      <section id="skills" className="relative border-t border-border/40 py-8">
        <Skills />
      </section>

      <section id="projects" className="relative border-t border-border/40 py-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-30 pointer-events-none" />
        <ProjectsPreview />
      </section>

      <section id="open-source" className="relative border-t border-border/40 py-8">
        <OpenSourcePreview />
      </section>

      <section id="contact" className="relative border-t border-border/40 pt-8 pb-16">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />
        <div className="space-y-8">
          <ContactForm />
          <ImportantLinks />
        </div>
      </section>

      <footer className="relative border-t border-border/40 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="space-y-2">
            <h4 className="font-black text-xl tracking-tighter uppercase text-muted-foreground/60">
              Dev
            </h4>
            <p className="text-xs uppercase tracking-widest text-muted-foreground/40">
              © {new Date().getFullYear()} / Full Stack & Systems Engineer
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
