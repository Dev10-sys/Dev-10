"use client";

import { motion } from "framer-motion";
import { Maximize2, Minus, X } from "lucide-react";
import { ReactNode, useState } from "react";

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number | string; height: number | string };
}

export function Window({
  id,
  title,
  children,
  isOpen,
  onClose,
  isActive,
  onFocus,
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 800, height: 600 }
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      initial={defaultPosition}
      animate={isMaximized ? { x: 0, y: 32, width: "100%", height: "calc(100vh - 32px)" } : { width: defaultSize.width, height: defaultSize.height }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      onMouseDown={onFocus}
      className={`absolute gtk-window shadow-2xl ${isActive ? "z-40 ring-1 ring-white/10" : "z-30"}`}
      style={{ touchAction: "none" }}
    >
      {/* Header Bar */}
      <div className="gtk-headerbar cursor-grab active:cursor-grabbing" onDoubleClick={() => setIsMaximized(!isMaximized)}>
        <div className="flex-1" />
        <div className="gtk-headerbar-title">{title}</div>
        
        <div className="gtk-window-controls">
          <button className="gtk-circle-btn" onClick={() => {}} title="Minimize">
            <Minus className="w-3 h-3 text-white/70" />
          </button>
          <button className="gtk-circle-btn" onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
            <Maximize2 className="w-3 h-3 text-white/70" />
          </button>
          <button className="gtk-circle-btn close" onClick={onClose} title="Close">
            <X className="w-3 h-3 text-white/70" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="gtk-content cursor-auto" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  );
}
