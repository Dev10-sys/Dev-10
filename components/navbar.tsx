"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X, Wifi, Battery, Clock } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sections = ["about", "skills", "projects", "open-source", "extended", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { href: "#about", label: "About", id: "about" },
    { href: "#skills", label: "Stack", id: "skills" },
    { href: "#projects", label: "Projects", id: "projects" },
    { href: "#open-source", label: "OSS", id: "open-source" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  return (
    <>
      {/* Desktop / Scrolled Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          {/* Top OS-style menubar when NOT scrolled */}
          <AnimatePresence>
            {!scrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full px-6 py-3 flex items-center justify-between"
                style={{ background: "rgba(5,5,8,0.6)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(248,147,26,0.06)" }}
              >
                {/* Left — logo */}
                <a href="/" className="group flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <div className="os-dot os-dot-red" />
                    <div className="os-dot os-dot-yellow" />
                    <div className="os-dot os-dot-green" />
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-primary opacity-60" />
                  <span className="font-mono text-xs text-primary/70 tracking-[0.2em] uppercase">Dev10-sys</span>
                </a>

                {/* Center — nav links */}
                <nav className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.15em] transition-all ${
                        active === link.id
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {active === link.id && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-md"
                          style={{ background: "rgba(248,147,26,0.1)", border: "1px solid rgba(248,147,26,0.2)" }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  ))}
                </nav>

                {/* Right — system tray */}
                <div className="hidden md:flex items-center gap-3 text-muted-foreground/50">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px] text-primary/50">{time}</span>
                </div>

                {/* Mobile menu btn */}
                <button
                  className="md:hidden text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating pill when scrolled */}
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                className="mx-auto mt-4 w-fit"
              >
                <div
                  className="flex items-center gap-1 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(13,13,20,0.9)",
                    border: "1px solid rgba(248,147,26,0.2)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3)"
                  }}
                >
                  <div className="flex gap-1 mr-3">
                    <div className="os-dot os-dot-red" style={{ width: 8, height: 8 }} />
                    <div className="os-dot os-dot-yellow" style={{ width: 8, height: 8 }} />
                    <div className="os-dot os-dot-green" style={{ width: 8, height: 8 }} />
                  </div>
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] transition-all ${
                        active === link.id
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {active === link.id && (
                        <motion.div
                          layoutId="nav-pill-scrolled"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "rgba(248,147,26,0.12)", border: "1px solid rgba(248,147,26,0.3)" }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  ))}
                  <div className="ml-3 pl-3 border-l border-border/40">
                    <span className="font-mono text-[10px] text-primary/40">{time}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && !scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-12 left-4 right-4 z-40 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,20,0.97)",
              border: "1px solid rgba(248,147,26,0.15)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
            }}
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <span className="text-primary/40">~/</span>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
