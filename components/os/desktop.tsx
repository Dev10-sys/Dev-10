"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { Window } from "./window";
import { Terminal, FolderGit2, UserCircle, GitMerge, Globe, Code2 } from "lucide-react";
import { About } from "../about";
import { OpenSourcePreview } from "../open-source-preview";
import { ProjectsPreview } from "../projects-preview";
import { ImportantLinks } from "../links";
import { SkillsPreview } from "../skills-preview";

type App = {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
  defaultSize?: { width: string | number; height: string | number };
};

export function Desktop() {
  const apps: App[] = [
    {
      id: "about",
      title: "My Profile",
      icon: UserCircle,
      content: <About />,
      defaultSize: { width: "80vw", height: "80vh" }
    },
    {
      id: "experience",
      title: "Experience",
      icon: GitMerge,
      content: <div className="p-8 text-white"><OpenSourcePreview /></div>,
      defaultSize: { width: "85vw", height: "85vh" }
    },
    {
      id: "skills",
      title: "Skills",
      icon: Code2,
      content: <div className="p-8 text-white overflow-y-auto"><SkillsPreview /></div>,
      defaultSize: { width: "85vw", height: "85vh" }
    },
    {
      id: "projects",
      title: "Projects",
      icon: FolderGit2,
      content: <div className="p-8 text-white"><ProjectsPreview /></div>,
      defaultSize: { width: "85vw", height: "85vh" }
    },
    {
      id: "network",
      title: "Network",
      icon: Globe,
      content: <div className="p-8 text-white"><ImportantLinks /></div>,
      defaultSize: { width: "80vw", height: "70vh" }
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: Terminal,
      content: (
        <div className="p-4 font-mono text-green-400 bg-black/90 h-full overflow-y-auto">
          <div>dev10-sys@ubuntu:~$ whoami</div>
          <div className="text-white">dev10-sys</div>
          <div>dev10-sys@ubuntu:~$ cat skills.txt</div>
          <div className="text-white pb-2">Blockchain · Kotlin · Java · System Engineer · Linux · GTK · Wayland</div>
          <div>dev10-sys@ubuntu:~$ cat fun_fact.txt</div>
          <div className="text-white pb-2">Midnight photography of the moon with coffee.</div>
          <div>dev10-sys@ubuntu:~$ <span className="animate-pulse">_</span></div>
        </div>
      ),
      defaultSize: { width: 600, height: 400 }
    }
  ];

  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const openApp = (id: string) => {
    setOpenWindows([id]);
    setActiveWindow(id);
  };

  const closeApp = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[openWindows.length - 2] : null);
    }
  };

  return (
    <div className="relative w-full h-screen desktop-bg overflow-hidden text-foreground z-10">
      <TopBar />

      {/* Premium Ambient Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative flex flex-col items-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[20vw] bg-primary/10 blur-[100px] rounded-full mix-blend-screen" />
          
          <h1 className="text-[12vw] md:text-[14vw] leading-none font-black tracking-tighter select-none relative z-10"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))"
              }}>
            DEV'S OS
          </h1>
          
          <div className="text-white/30 text-xs md:text-sm font-medium tracking-[0.4em] uppercase mt-2 md:mt-0 select-none relative z-10"
               style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            Systems • Security • Infrastructure
          </div>
        </div>
      </div>

      {/* Mac/Linux Style Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center gap-4 shadow-2xl z-50">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="relative group p-2 hover:bg-white/10 rounded-2xl transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-4 shadow-lg group-hover:shadow-primary/20">
              <app.icon className="w-8 h-8 text-white/90 group-hover:text-primary drop-shadow-md" />
            </div>
            {openWindows.includes(app.id) && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full shadow-[0_0_8px_rgba(247,147,26,0.8)]" />
            )}
            {/* Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 border border-white/10 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              {app.title}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-black/80 border-t-4 border-x-transparent border-x-4 border-b-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Windows */}
      {openWindows.map((id) => {
        const app = apps.find((a) => a.id === id);
        if (!app) return null;

        return (
          <Window
            key={id}
            id={id}
            title={app.title}
            isOpen={true}
            onClose={() => closeApp(id)}
            isActive={activeWindow === id}
            onFocus={() => setActiveWindow(id)}
            defaultSize={app.defaultSize}
            defaultPosition={{ 
              x: typeof window !== 'undefined' ? (app.id === "terminal" ? window.innerWidth / 2 - 300 : window.innerWidth * 0.1) + (openWindows.indexOf(id) * 20) : 40, 
              y: typeof window !== 'undefined' ? (app.id === "terminal" ? window.innerHeight / 2 - 200 : window.innerHeight * 0.1) + (openWindows.indexOf(id) * 20) : 40 
            }}
          >
            {app.content}
          </Window>
        );
      })}
    </div>
  );
}
