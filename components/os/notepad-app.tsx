"use client";

import { useState, useEffect } from "react";
import { FileText, Save, Trash2, Check } from "lucide-react";

export function NotepadApp() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("dev10_notepad_text");
    if (cached) setText(cached);
  }, []);

  // Autosave text
  useEffect(() => {
    if (text) {
      localStorage.setItem("dev10_notepad_text", text);
    }
  }, [text]);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      localStorage.setItem("dev10_notepad_text", text);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear this notepad?")) {
      setText("");
      localStorage.removeItem("dev10_notepad_text");
    }
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e] text-slate-300 font-sans overflow-hidden">
      {/* Editor toolbar */}
      <div className="h-11 bg-[#181825] border-b border-white/5 flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <FileText size={14} />
          notes.txt
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-wider"
          >
            <Trash2 size={11} />
            Clear
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)] uppercase tracking-wider"
          >
            {saving ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <Check size={11} />
            ) : (
              <Save size={11} />
            )}
            {saving ? "Saving" : saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Editor text area */}
      <div className="flex-1 p-4 bg-[#11111b] overflow-hidden flex">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your notes or code snippet here..."
          className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-200 font-mono text-xs leading-relaxed focus:ring-0"
        />
      </div>

      {/* Editor footer */}
      <div className="h-8 bg-[#181825] border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-zinc-500 font-mono font-bold shrink-0 select-none">
        <span>WORDS: {wordCount}</span>
        <span>CHARACTERS: {text.length}</span>
      </div>
    </div>
  );
}
