"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="cursor-glow hidden md:block"
      style={{
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
      }}
    />
  );
}
