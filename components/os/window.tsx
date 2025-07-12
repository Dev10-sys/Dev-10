"use client";

import { motion } from "framer-motion";
import { Maximize2, Minus, X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number | string; height: number | string };
  accentColor?: string;
  onMaximizeChange?: (isMax: boolean) => void;
}

export function Window({
  id,
  title,
  children,
  isOpen,
  onClose,
  onMinimize,
  isActive,
  onFocus,
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 800, height: 600 },
  accentColor = "#a78bfa",
  onMaximizeChange,
}: WindowProps) {
  const [snapMode, setSnapMode] = useState<"normal" | "maximized" | "left-snap" | "right-snap">("normal");
  const [position, setPosition] = useState({ x: defaultPosition.x, y: defaultPosition.y });
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (!isOpen) {
      onMaximizeChange?.(false);
    }
  }, [isOpen, onMaximizeChange]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!isOpen) return null;

  const widthVal = typeof defaultSize.width === "string" && defaultSize.width.endsWith("vw")
    ? (viewportSize.width * parseFloat(defaultSize.width)) / 100
    : typeof defaultSize.width === "number" ? defaultSize.width : 800;

  const heightVal = typeof defaultSize.height === "string" && defaultSize.height.endsWith("vh")
    ? (viewportSize.height * parseFloat(defaultSize.height)) / 100
    : typeof defaultSize.height === "number" ? defaultSize.height : 600;

  const toggleMaximize = () => {
    const nextMode = snapMode === "maximized" ? "normal" : "maximized";
    setSnapMode(nextMode);
    onMaximizeChange?.(nextMode === "maximized");
  };

  const handleDragEnd = (event: any, info: any) => {
    const x = info.point.x;
    const y = info.point.y;

    if (y < 45) {
      setSnapMode("maximized");
      onMaximizeChange?.(true);
    } else if (x < 24) {
      setSnapMode("left-snap");
      onMaximizeChange?.(false);
    } else if (viewportSize.width - x < 24) {
      setSnapMode("right-snap");
      onMaximizeChange?.(false);
    } else {
      setPosition((prev) => ({
        x: prev.x + info.offset.x,
        y: prev.y + info.offset.y
      }));
    }
  };

  const handleDragStart = () => {
    if (snapMode !== "normal") {
      setSnapMode("normal");
      onMaximizeChange?.(false);
    }
  };

  const isMaximized = snapMode === "maximized";

  return (
    <motion.div
      drag={true}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        top: 32,
        left: 0,
        right: Math.max(100, viewportSize.width - 150),
        bottom: Math.max(100, viewportSize.height - 100)
      }}
      initial={{ opacity: 0, scale: 0.9, x: defaultPosition.x, y: defaultPosition.y }}
      animate={
        snapMode === "maximized"
          ? { opacity: 1, scale: 1, x: 0, y: 32, width: viewportSize.width, height: viewportSize.height - 32 }
          : snapMode === "left-snap"
          ? { opacity: 1, scale: 1, x: 0, y: 32, width: viewportSize.width / 2, height: viewportSize.height - 32 }
          : snapMode === "right-snap"
          ? { opacity: 1, scale: 1, x: viewportSize.width / 2, y: 32, width: viewportSize.width / 2, height: viewportSize.height - 32 }
          : { opacity: 1, scale: 1, x: position.x, y: position.y, width: widthVal, height: heightVal }
      }
      transition={{ type: "spring", bounce: 0, duration: 0.22 }}
      onMouseDown={onFocus}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="absolute gtk-window shadow-2xl pointer-events-auto"
      style={{
        touchAction: "none",
        boxShadow: isActive
          ? `0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px ${accentColor}35`
          : "0 12px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
      }}
    >
      <div 
        className="gtk-headerbar cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-between" 
        onDoubleClick={toggleMaximize}
        onMouseDown={onFocus}
      >
        <div className="flex-1" />
        <div className="gtk-headerbar-title select-none pointer-events-none font-bold text-sm tracking-tight text-white/95">
          {title}
        </div>
        
        <div className="gtk-window-controls flex items-center gap-2 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-all"
            style={{ background: "#ff5f57", border: "1px solid rgba(0,0,0,0.2)" }}
            title="Close"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximizeChange?.(false); onMinimize?.(); }}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-all"
            style={{ background: "#febc2e", border: "1px solid rgba(0,0,0,0.2)" }}
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-all"
            style={{ background: "#28c840", border: "1px solid rgba(0,0,0,0.2)" }}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      <div 
        className="gtk-content cursor-auto flex-1 min-h-0 overflow-y-auto" 
        onMouseDown={(e) => {
          e.stopPropagation();
          onFocus();
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
