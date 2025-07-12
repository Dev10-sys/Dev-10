"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Desktop } from "@/components/os/desktop";
import { BootScreen } from "@/components/os/boot-screen";
import { ChatBot } from "@/components/os/chat-bot";
import { CustomCursor } from "@/components/os/custom-cursor";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hide native cursor globally
    document.documentElement.style.cursor = "none";
    setMounted(true);
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, []);

  function handleEnter() {
    setBooted(true);
  }

  function handleShutdown() {
    sessionStorage.removeItem("dev10_booted");
    setBooted(false);
  }

  if (!mounted) return null;

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onEnter={handleEnter} />}
      </AnimatePresence>
      {booted && (
        <>
          <Desktop onShutdown={handleShutdown} />
          <ChatBot />
        </>
      )}
    </>
  );
}
