"use client";

import { openInOsBrowser } from "@/lib/os-browser";
import { Github, Twitter, Linkedin, Terminal, FileText, Send } from "lucide-react";
import site from "@/data/site.json";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Download } from "lucide-react";

export function ImportantLinks() {
  const L = site.contact;
  const [showResume, setShowResume] = useState(false);

  const links = [
    { label: "GitHub Profile", href: L.github, icon: Github, sub: "Source control & contributions" },
    { label: "LinkedIn Network", href: L.linkedin, icon: Linkedin, sub: "Professional connections" },
    { label: "X (Twitter)", href: L.twitter, icon: Twitter, sub: "Tech posts & updates" },
    { label: "Portfolio Repo", href: "https://github.com/Dev10-sys/personal-potfolio", icon: Terminal, sub: "Inspect website source code" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#07070a] text-slate-200 font-sans p-6 overflow-hidden">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80 select-none shrink-0">
        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <FileText size={18} className="text-blue-400" />
          Contact Me
        </h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 mt-6 overflow-hidden min-h-0 relative">
        <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-6 pr-2">
          <div className="space-y-4">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider select-none">
              Quick Connections
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => openInOsBrowser(link.href)}
                  className="p-4 rounded-xl bg-zinc-950/20 border border-zinc-800/60 hover:border-blue-500/40 hover:bg-zinc-900/30 transition-all flex items-center gap-3 group text-left w-full"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-105 transition-all">
                    <link.icon className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{link.label}</div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">{link.sub}</div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("copilot-open-app", { detail: { appId: "resume" } }));
                }}
                className={`p-4 rounded-xl border transition-all flex items-center gap-3 text-left w-full bg-zinc-950/20 border-zinc-800/60 hover:border-blue-500/40 hover:bg-zinc-900/30 text-white`}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center transition-all">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">View Resume PDF</div>
                  <div className="text-[10px] text-zinc-500 truncate mt-0.5">Open in PDF viewer window</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-xl p-4 space-y-3">
            <div className="text-xs text-zinc-400 font-bold flex items-center gap-1.5 select-none">
              <Send size={12} className="text-blue-400" />
              Quick Contact
            </div>
            <div className="text-[11px] text-zinc-500 leading-relaxed font-medium">
              Have an opportunity or question? Feel free to reach out directly via my LinkedIn or GitHub profiles listed above!
            </div>
            <button
              onClick={() => openInOsBrowser(L.email?.replace("mailto:", "https://mail.google.com/mail/?view=cm&to=") || "mailto:" + L.email)}
              className="inline-flex items-center justify-center w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors mt-2"
            >
              Send Direct Email
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showResume && (
            <motion.div
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "55%" }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden md:flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative h-full shrink-0"
            >
              <div className="h-10 bg-zinc-900 border-b border-b-zinc-800 px-4 flex items-center justify-between select-none shrink-0">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <FileText size={11} className="text-blue-400" />
                  resume.pdf
                </span>
                <a
                  href="/resume.pdf"
                  download="Dev_Resume.pdf"
                  className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded transition-colors"
                >
                  <Download size={10} />
                  Download
                </a>
              </div>

              <div className="flex-1 w-full bg-[#12121c] relative min-h-0">
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full border-none bg-zinc-950"
                  title="Resume PDF Viewer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
