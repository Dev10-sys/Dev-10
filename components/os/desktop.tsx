"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "./top-bar";
import {
  Power, Sparkles, Search, RotateCw
} from "lucide-react";
import { About } from "../about";
import { ProjectsPreview } from "../projects-preview";
import { ImportantLinks } from "../links";
import { SkillsPreview } from "../skills-preview";
import { Blogs } from "./blogs";
import { PullRequestExplorer } from "./pr-explorer";
import { InteractiveTerminal } from "./interactive-terminal";
import { NovaStrike } from "./nova-strike";
import { BrowserApp } from "./browser-app";
import { SpotifyApp } from "./spotify-app";
import { NotepadApp } from "./notepad-app";
import { Window } from "./window";

import { sysAudio } from "@/lib/audio";
import {
  ChromeIcon, SpotifyIcon, NotepadIcon, TerminalIconCustom,
  ProfileIcon, BlogsIcon, ContactIcon, ProjectsIcon,
  ExperienceIcon, SkillsIcon, GameIcon, ResumePdfIcon
} from "./icons";

type AppId = "about" | "projects" | "prs" | "skills" | "blogs" | "contact" | "terminal" | "game" | "browser" | "music" | "notepad" | "resume";

type AppDef = {
  id: AppId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  content: React.ReactNode;
  defaultW: number;
  defaultH: number;
  accent: string;
};

type Props = { onShutdown: () => void };

export function Desktop({ onShutdown }: Props) {
  const apps = useMemo<AppDef[]>(() => [
    {
      id: "about",
      title: "My Profile",
      description: "About developer, GSoC project summary, and details.",
      icon: ProfileIcon,
      content: <About />,
      defaultW: 900,
      defaultH: 620,
      accent: "#a78bfa",
    },
    {
      id: "projects",
      title: "Projects",
      description: "Browse featured projects and repositories.",
      icon: ProjectsIcon,
      content: <div className="p-4 h-full overflow-y-auto"><ProjectsPreview /></div>,
      defaultW: 1000,
      defaultH: 640,
      accent: "#34d399",
    },
    {
      id: "prs",
      title: "Experience",
      description: "Timeline of Dev's open source contributions and pull requests.",
      icon: ExperienceIcon,
      content: <PullRequestExplorer />,
      defaultW: 1000,
      defaultH: 650,
      accent: "#818cf8",
    },
    {
      id: "skills",
      title: "Skills Hub",
      description: "Inspect technical skills, stack experience, and tools.",
      icon: SkillsIcon,
      content: <div className="p-0 overflow-hidden h-full"><SkillsPreview /></div>,
      defaultW: 920,
      defaultH: 580,
      accent: "#fb923c",
    },
    {
      id: "blogs",
      title: "Dev's Blogs",
      description: "Read technical writeups and weekly GSoC blogs.",
      icon: BlogsIcon,
      content: <Blogs />,
      defaultW: 900,
      defaultH: 620,
      accent: "#22d3ee",
    },
    {
      id: "browser",
      title: "Navigator Web Browser",
      description: "Interactive browser with simulated Google search.",
      icon: ChromeIcon,
      content: <BrowserApp />,
      defaultW: 980,
      defaultH: 640,
      accent: "#60a5fa",
    },
    {
      id: "music",
      title: "Spotify Music",
      description: "Play actual MP3 streaming coding music.",
      icon: SpotifyIcon,
      content: <SpotifyApp />,
      defaultW: 680,
      defaultH: 420,
      accent: "#10b981",
    },
    {
      id: "notepad",
      title: "Scratch Notepad",
      description: "Write temporary code, plans, and notes.",
      icon: NotepadIcon,
      content: <NotepadApp />,
      defaultW: 600,
      defaultH: 400,
      accent: "#f59e0b",
    },
    {
      id: "contact",
      title: "Contact Me",
      description: "Get in touch or view the integrated PDF resume.",
      icon: ContactIcon,
      content: <div className="h-full w-full overflow-hidden"><ImportantLinks /></div>,
      defaultW: 1040,
      defaultH: 650,
      accent: "#3b82f6",
    },
    {
      id: "terminal",
      title: "Dev's Terminal",
      description: "Systems diagnostic terminal shell.",
      icon: TerminalIconCustom,
      content: <InteractiveTerminal />,
      defaultW: 680,
      defaultH: 440,
      accent: "#a3e635",
    },
    {
      id: "game",
      title: "Nova Strike - Arcade",
      description: "Fighter jet shooting game with responsive canvas resizing.",
      icon: GameIcon,
      content: <NovaStrike />,
      defaultW: 640,
      defaultH: 450,
      accent: "#f43f5e",
    },
    {
      id: "resume",
      title: "resume.pdf",
      description: "View and download Dev's resume PDF.",
      icon: ResumePdfIcon,
      content: (
        <div className="flex flex-col h-full bg-[#1a1a2e]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0f0f1a] border-b border-white/10 shrink-0">
            <span className="text-xs font-mono text-white/60">resume.pdf</span>
            <a
              href="/resume.pdf"
              download="Dev_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
            >
              ⬇ Download PDF
            </a>
          </div>
          <iframe
            src="/resume.pdf#toolbar=1&navpanes=1&scrollbar=1"
            className="flex-1 w-full border-none"
            title="Resume PDF"
          />
        </div>
      ),
      defaultW: 820,
      defaultH: 680,
      accent: "#f59e0b",
    },
  ], []);

  const [openWindows, setOpenWindows] = useState<AppId[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<AppId[]>([]);
  const [windowStack, setWindowStack] = useState<AppId[]>([]);
  const [activeWindow, setActiveWindow] = useState<AppId | null>(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [recruiterMode, setRecruiterMode] = useState(false);

  const [maximizedWindows, setMaximizedWindows] = useState<AppId[]>([]);
  const [hoveringBottom, setHoveringBottom] = useState(false);

  const startMenuRef = useRef<HTMLDivElement>(null);

  const focusWindow = useCallback((id: AppId) => {
    setActiveWindow(id);
    setWindowStack((prev) => [...prev.filter((w) => w !== id), id]);
  }, []);

  const openApp = useCallback((id: AppId) => {
    sysAudio.playClick();
    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id]);
    }
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    focusWindow(id);
  }, [openWindows, focusWindow]);

  const closeApp = useCallback((id: AppId) => {
    sysAudio.playClick();
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setMaximizedWindows((prev) => prev.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  }, [activeWindow]);

  const minimizeApp = useCallback((id: AppId) => {
    sysAudio.playClick();
    if (!minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => [...prev, id]);
    }
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  }, [minimizedWindows, activeWindow]);

  const handleDock = useCallback((id: AppId) => {
    if (!openWindows.includes(id)) {
      openApp(id);
    } else if (minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => prev.filter((w) => w !== id));
      focusWindow(id);
    } else if (activeWindow === id) {
      minimizeApp(id);
    } else {
      focusWindow(id);
    }
  }, [openWindows, minimizedWindows, activeWindow, openApp, focusWindow, minimizeApp]);

  useEffect(() => {
    const handleOpenApp = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.appId) {
        const targetId = customEvent.detail.appId === "network" ? "contact" : customEvent.detail.appId;
        openApp(targetId as AppId);
      }
    };
    const handleShutdownOS = () => {
      onShutdown();
    };
    window.addEventListener("copilot-open-app", handleOpenApp);
    window.addEventListener("copilot-shutdown", handleShutdownOS);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowStartMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== "undefined") {
        if (window.innerHeight - e.clientY < 16) {
          setHoveringBottom(true);
        } else if (window.innerHeight - e.clientY > 80) {
          setHoveringBottom(false);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleOutsideClick = (e: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest(".start-menu-trigger")) {
          setShowStartMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("copilot-open-app", handleOpenApp);
      window.removeEventListener("copilot-shutdown", handleShutdownOS);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openApp, onShutdown]);

  const filteredApps = apps.filter((app) => {
    const q = menuSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q)
    );
  });

  const launchFromMenu = (id: AppId) => {
    setShowStartMenu(false);
    setMenuSearch("");
    openApp(id);
  };

  const desktopShortcuts = [
    { id: "about", title: "My Profile", icon: ProfileIcon, action: () => openApp("about"), color: "#a78bfa" },
    { id: "blogs", title: "Dev's Blogs", icon: BlogsIcon, action: () => openApp("blogs"), color: "#22d3ee" },
    { id: "contact", title: "Contact Me", icon: ContactIcon, action: () => openApp("contact"), color: "#3b82f6" },
    { id: "terminal", title: "Dev's Terminal", icon: TerminalIconCustom, action: () => openApp("terminal"), color: "#a3e635" },
    {
      id: "resume-pdf",
      title: "resume.pdf",
      icon: ResumePdfIcon,
      color: "#f59e0b",
      action: () => openApp("resume")
    }
  ];

  const dockApps = apps.filter((app) => 
    app.id === "browser" ||
    app.id === "projects" ||
    app.id === "prs" ||
    app.id === "skills" ||
    app.id === "music" ||
    app.id === "notepad" ||
    app.id === "game"
  );

  const isDockHidden = useMemo(() => {
    if (!activeWindow) return false;
    const isMax = maximizedWindows.includes(activeWindow);
    const isMin = minimizedWindows.includes(activeWindow);
    return isMax && !isMin && !hoveringBottom;
  }, [activeWindow, maximizedWindows, minimizedWindows, hoveringBottom]);

  return (
    <div className="relative w-full h-screen desktop-bg overflow-hidden select-none" style={{ cursor: "none" }}>
      <TopBar 
        onShutdown={onShutdown} 
        onToggleLaunchpad={() => setShowStartMenu(!showStartMenu)}
        recruiterMode={recruiterMode}
        onToggleRecruiterMode={() => setRecruiterMode(!recruiterMode)}
      />

      <AnimatePresence>
        {recruiterMode ? (
          <motion.div
            key="recruiter-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 top-8 bg-[#090911] text-slate-200 overflow-y-auto select-text z-40 pb-20 font-sans scroll-smooth"
          >
            <div className="relative border-b border-white/5 py-20 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 text-center md:text-left md:max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest bg-violet-500/10 border border-violet-500/25 text-violet-400 px-3 py-1 rounded-full uppercase">
                  <Sparkles size={10} />
                  GSoC 2026 Core Contributor
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Dev10-sys
                </h1>
                <p className="text-sm font-mono text-zinc-400 tracking-wide">
                  AI/ML · Systems · Open Source
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                  GSoC 2026 contributor at Sugar Labs (GTK4/Wayland shell migration) and LFX Mentee at LFDT Web3j. I work on Linux display stack internals, Ethereum ABI protocol engineering, and security hardening across distributed open source projects.
                </p>
                
                <div className="flex flex-wrap gap-3 pt-3 justify-center md:justify-start">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold font-mono text-xs text-white transition-all shadow-[0_4px_20px_rgba(139,92,246,0.2)]"
                  >
                    Download Resume
                  </a>
                  <button
                    onClick={() => setRecruiterMode(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/20 font-bold font-mono text-xs text-zinc-300 transition-all"
                  >
                    💻 Launch OS Simulator
                  </button>
                </div>
              </div>

              <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-violet-600 to-emerald-500 p-0.5 shadow-2xl flex items-center justify-center select-none shrink-0 rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full rounded-[22px] bg-[#0c0c16] flex flex-col items-center justify-center">
                  <img 
                    src="/images/profile.png" 
                    alt="Dev10" 
                    className="w-32 h-32 rounded-2xl object-cover shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 space-y-24 mt-10">
              <section id="about" className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-white tracking-wide">My Background</h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                  <About />
                </div>
              </section>

              <section id="skills" className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-white tracking-wide">Skills & Proficiencies</h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <SkillsPreview />
              </section>

              <section id="experience" className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-white tracking-wide">Open Source Experience</h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                  <PullRequestExplorer />
                </div>
              </section>

              <section id="projects" className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-white tracking-wide">Featured Repositories</h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <ProjectsPreview />
              </section>

              <footer id="contact" className="space-y-4 border-t border-white/5 pt-12 text-center select-none pb-12">
                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Let's connect</p>
                <div className="flex justify-center gap-4 text-xs font-bold font-mono">
                  <a href="mailto:dev10sys@gmail.com" className="hover:text-white text-zinc-400 transition-colors">Email</a>
                  <span className="text-zinc-700">·</span>
                  <a href="https://github.com/dev10-sys" target="_blank" rel="noreferrer" className="hover:text-white text-zinc-400 transition-colors">GitHub</a>
                  <span className="text-zinc-700">·</span>
                  <a href="https://medium.com/@dev10sys" target="_blank" rel="noreferrer" className="hover:text-white text-zinc-400 transition-colors">Medium</a>
                </div>
                <p className="text-[10px] text-zinc-600 mt-4">© 2026 Dev10-sys. Built with React, TailwindCSS, & Framer Motion.</p>
              </footer>
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full absolute inset-0">


            <div className="absolute left-6 top-16 grid grid-flow-row auto-rows-max gap-4 z-10 select-none">
              {desktopShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <div
                    key={shortcut.id}
                    onDoubleClick={shortcut.action}
                    onClick={() => {
                      sysAudio.playClick();
                      shortcut.action();
                    }}
                    className="flex flex-col items-center justify-center gap-1 w-20 h-20 cursor-pointer group text-center hover:bg-white/[0.04] border border-transparent hover:border-white/5 rounded-2xl p-1.5 transition-all duration-255"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#0d0d16]/40 border border-white/5 group-hover:border-white/20 group-hover:bg-white/5 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden"
                      style={{ color: shortcut.color }}
                    >
                      {shortcut.id === "about" ? (
                        <img 
                          src="/images/profile.png" 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white tracking-wide truncate max-w-[76px] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] font-sans">
                      {shortcut.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {openWindows.map((id) => {
              const app = apps.find((a) => a.id === id)!;
              const isMinimized = minimizedWindows.includes(id);
              const isActive = activeWindow === id;
              const stackIdx = windowStack.indexOf(id);
              const zIndex = 20 + (stackIdx >= 0 ? stackIdx : 0);
              const offsetIdx = openWindows.indexOf(id);

              return (
                <div
                  key={id}
                  style={{ zIndex, display: isMinimized ? "none" : "block" }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Window
                    id={id}
                    title={app.title}
                    isOpen
                    isActive={isActive}
                    onClose={() => closeApp(id)}
                    onMinimize={() => minimizeApp(id)}
                    onFocus={() => focusWindow(id)}
                    defaultSize={{ width: app.defaultW, height: app.defaultH }}
                    defaultPosition={{
                      x: typeof window !== "undefined" ? Math.max(20, (window.innerWidth - app.defaultW) / 2 + offsetIdx * 20) : 100,
                      y: typeof window !== "undefined" ? Math.max(20, (window.innerHeight - app.defaultH) / 2 + offsetIdx * 15) : 80,
                    }}
                    accentColor={app.accent}
                    onMaximizeChange={(isMax) => {
                      setMaximizedWindows((prev) =>
                        isMax ? [...prev, id] : prev.filter((x) => x !== id)
                      );
                    }}
                  >
                    {app.content}
                  </Window>
                </div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStartMenu && !recruiterMode && (
          <motion.div
            ref={startMenuRef}
            initial={{ opacity: 0, y: 35, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 35, scale: 0.95, x: "-50%" }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute bottom-20 left-1/2 w-[420px] bg-zinc-950/92 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-2xl z-[90] text-slate-200 overflow-hidden flex flex-col justify-between"
            style={{
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <div className="p-4 bg-zinc-900/10 border-b border-zinc-900/80 flex items-center gap-3 select-none">
              <img 
                src="/images/profile.png" 
                alt="Dev10 Profile" 
                className="w-10 h-10 rounded-full object-cover border border-zinc-800 shadow-sm" 
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  Dev10-sys
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[10px] text-zinc-500 truncate">Systems & ML Platform Developer</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[9px] bg-zinc-900/40 border border-zinc-800 px-2 py-0.5 rounded-md font-mono text-zinc-400">
                <Sparkles size={9} className="text-violet-400" />
                active
              </div>
            </div>

            <div className="p-3 select-text">
              <div className="relative flex items-center bg-zinc-950/50 border border-zinc-850 rounded-xl px-3 py-2 text-xs focus-within:border-zinc-700">
                <Search size={12} className="text-zinc-500 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search Applications..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-zinc-650 text-xs"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto px-2 pb-2 space-y-0.5">
              {filteredApps.length === 0 ? (
                <div className="text-center text-[10px] text-zinc-600 py-8 font-mono select-none">
                  No matching apps found
                </div>
              ) : (
                filteredApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => launchFromMenu(app.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left border border-transparent hover:bg-zinc-900/30 hover:border-zinc-900/80 transition-all group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${app.accent}12, ${app.accent}02)`,
                          border: `1px solid ${app.accent}15`,
                        }}
                      >
                        <Icon size={16} style={{ color: app.accent }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block group-hover:text-violet-300 transition-colors">
                          {app.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate block mt-0.5 font-mono">
                          {app.description}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-zinc-900/10 border-t border-zinc-900/80 flex items-center justify-between select-none">
              <button
                onClick={onShutdown}
                className="flex items-center gap-1.5 hover:text-red-400 text-zinc-500 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors"
              >
                <Power size={11} />
                Shutdown
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 hover:text-emerald-400 text-zinc-500 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors"
              >
                <RotateCw size={11} />
                Restart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!recruiterMode && (
        <div 
          className="absolute bottom-4 left-1/2 z-50 transition-all duration-300 ease-out"
          style={{
            transform: `translateX(-50%) ${isDockHidden ? "translateY(calc(100% + 24px))" : "translateY(0)"}`,
          }}
        >
          <div
            className="flex items-end gap-1.5 px-4 py-2.5"
            style={{
              background: "rgba(12,12,18,0.65)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="relative flex flex-col items-center group start-menu-trigger">
              <motion.button
                onClick={() => setShowStartMenu(!showStartMenu)}
                whileHover={{ y: -12, scale: 1.3 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="relative w-12 h-12 rounded-[14px] flex items-center justify-center bg-[#0d0d16]/70 border border-white/8 hover:bg-violet-600/10 hover:border-violet-500/35 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              >
                <div className="w-5 height-5 flex flex-wrap gap-0.5 justify-center items-center">
                  <div className="w-2 h-2 bg-[#f43f5e] rounded-sm shadow-[0_0_8px_#f43f5e]" />
                  <div className="w-2 h-2 bg-[#3b82f6] rounded-sm shadow-[0_0_8px_#3b82f6]" />
                  <div className="w-2 h-2 bg-[#10b981] rounded-sm shadow-[0_0_8px_#10b981]" />
                  <div className="w-2 h-2 bg-[#fb923c] rounded-sm shadow-[0_0_8px_#fb923c]" />
                </div>
              </motion.button>
              <div
                className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
                style={{
                  background: "rgba(10,10,20,0.92)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                Start Menu
              </div>
            </div>

            <div className="w-[1px] h-8 bg-white/10 self-center mx-1" />

            {dockApps.map((app) => {
              const isOpen = openWindows.includes(app.id);
              const isActive = activeWindow === app.id && !minimizedWindows.includes(app.id);
              const Icon = app.icon;

              return (
                <div key={app.id} className="relative flex flex-col items-center group">
                  <motion.button
                    onClick={() => handleDock(app.id)}
                    whileHover={{ y: -12, scale: 1.3 }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="relative w-12 h-12 rounded-[14px] flex items-center justify-center transition-all"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${app.accent}30, ${app.accent}15)`
                        : "rgba(255,255,255,0.06)",
                      border: isActive
                        ? `1px solid ${app.accent}50`
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? `0 0 20px ${app.accent}30, inset 0 1px 0 ${app.accent}30`
                        : "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon
                      size={24}
                      className="transition-all group-hover:scale-110"
                      style={{ color: app.accent }}
                    />
                  </motion.button>

                  {isOpen && (
                    <div
                      className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                      style={{
                        background: app.accent,
                        boxShadow: `0 0 6px ${app.accent}`,
                        opacity: minimizedWindows.includes(app.id) ? 0.4 : 1,
                      }}
                    />
                  )}

                  <div
                    className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
                    style={{
                      background: "rgba(10,10,20,0.92)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {app.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
