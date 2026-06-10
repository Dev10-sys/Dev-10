"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { Window } from "./window";
import { Terminal, FolderGit2, UserCircle, GitMerge, Globe } from "lucide-react";
import { About } from "../about";
import { OpenSourcePreview } from "../open-source-preview";
import { ProjectsPreview } from "../projects-preview";
import { ImportantLinks } from "../links";

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
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setActiveWindow(id);
  };

  const closeApp = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[openWindows.length - 2] : null);
    }
  };

  return (
    <div className="relative w-full h-screen desktop-bg overflow-hidden text-foreground">
      <TopBar />

      {/* Desktop Background Widget */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center select-none opacity-50">
        <div className="text-[10vw] font-black text-white/5 tracking-tighter drop-shadow-2xl leading-none">
          DEV'S OS
        </div>
        <div className="text-xl md:text-2xl font-mono text-white/30 mt-4 tracking-[0.5em] uppercase">
          System Core Online
        </div>
      </div>
      
      {/* Desktop Icons */}
      <div className="pt-12 px-4 flex flex-col gap-6 w-24">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="flex flex-col items-center gap-1 group hover:bg-white/10 p-2 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <app.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white drop-shadow-md text-center">{app.title.split(' - ')[0]}</span>
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
