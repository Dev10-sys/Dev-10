"use client";

import { useEffect, useState, useRef } from "react";
import {
  Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium,
  Wifi, WifiOff, Volume2, Sun, Moon, Bluetooth, Zap, Power, RotateCw,
  Cpu, MemoryStick, Globe, Signal, ChevronRight, ArrowLeft, Check, Lock, Loader2, Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sysAudio } from "@/lib/audio";

interface TopBarProps {
  onShutdown?: () => void;
  onToggleLaunchpad?: () => void;
  recruiterMode: boolean;
  onToggleRecruiterMode: () => void;
}

// Real browser-accessible system APIs
declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
    deviceMemory?: number;
    connection?: NetworkInformation;
    bluetooth?: { getAvailability: () => Promise<boolean> };
  }
  interface BatteryManager extends EventTarget {
    level: number;
    charging: boolean;
  }
  interface NetworkInformation extends EventTarget {
    effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
  }
}

function useRealBattery() {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.getBattery) return;
    navigator.getBattery().then((bat) => {
      setLevel(Math.round(bat.level * 100));
      setCharging(bat.charging);
      bat.addEventListener("levelchange", () => setLevel(Math.round(bat.level * 100)));
      bat.addEventListener("chargingchange", () => setCharging(bat.charging));
    });
  }, []);
  return { level, charging };
}

function useRealNetwork() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [effectiveType, setEffectiveType] = useState<string>("4g");
  const [connType, setConnType] = useState<string>("unknown");
  const [downlink, setDownlink] = useState<number | null>(null);
  const [rtt, setRtt] = useState<number | null>(null);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const onOnline  = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);

    const conn = navigator.connection;
    if (conn) {
      const read = () => {
        setEffectiveType(conn.effectiveType ?? "4g");
        setConnType(conn.type ?? "unknown");
        setDownlink(conn.downlink ?? null);
        setRtt(conn.rtt ?? null);
        setSaveData(conn.saveData ?? false);
      };
      read();
      conn.addEventListener("change", read);
      return () => {
        window.removeEventListener("online",  onOnline);
        window.removeEventListener("offline", onOffline);
        conn.removeEventListener("change", read);
      };
    }
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Map effectiveType and connType to a human-readable label
  let typeLabel = "Offline";
  if (online) {
    if (connType === "wifi") typeLabel = "WiFi";
    else if (connType === "ethernet") typeLabel = "Ethernet";
    else if (connType === "cellular") typeLabel = effectiveType.toUpperCase();
    else if (connType !== "unknown" && connType !== "none") typeLabel = connType.toUpperCase();
    else typeLabel = effectiveType === "4g" ? "WiFi / 4G"
      : effectiveType === "3g" ? "3G"
      : effectiveType === "2g" ? "2G"
      : "Slow";
  }

  return { online, effectiveType, typeLabel, downlink, rtt, saveData };
}

function useRealBluetooth() {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.bluetooth) {
      navigator.bluetooth.getAvailability().then(setAvailable).catch(() => setAvailable(false));
    } else {
      setAvailable(false);
    }
  }, []);
  return available;
}

function useSystemInfo() {
  const ram  = typeof navigator !== "undefined" ? navigator.deviceMemory ?? null : null;
  const cpus = typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? null : null;
  const screen_res = typeof window !== "undefined"
    ? `${window.screen.width}×${window.screen.height}`
    : null;
  return { ram, cpus, screen_res };
}
export function TopBar({ onShutdown, onToggleLaunchpad, recruiterMode, onToggleRecruiterMode }: TopBarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const { level: batteryLevel, charging: isCharging } = useRealBattery();
  const { online: realOnline, typeLabel: realTypeLabel } = useRealNetwork();
  const realBtAvailable = useRealBluetooth();
  const { ram, cpus, screen_res } = useSystemInfo();

  const [openSettings, setOpenSettings] = useState(false);
  const [openPowerMenu, setOpenPowerMenu] = useState(false);
  const [focusOn, setFocusOn] = useState(false);
  const [saverOn, setSaverOn] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(85);

  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);

  const [activeView, setActiveView] = useState<"main" | "wifi" | "bluetooth">("main");
  const [connectedWifi, setConnectedWifi] = useState("WiFi Network");
  const [wifiNetworks, setWifiNetworks] = useState([
    { name: "WiFi Network", secure: true },
    { name: "Dev_Engineering_5G", secure: true },
    { name: "LOQ-Office-WiFi", secure: true },
    { name: "iPhone Hotspot", secure: true },
    { name: "Starlink-Beta", secure: false },
  ]);
  const [btDevices, setBtDevices] = useState([
    { name: "MX Master 3S", connected: true },
    { name: "Keychron K2", connected: true },
    { name: "AirPods Pro", connected: false },
    { name: "Sony WH-1000XM4", connected: false },
  ]);
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);
  const [connectingBtDevice, setConnectingBtDevice] = useState<string | null>(null);
  const [editingWifi, setEditingWifi] = useState(false);
  const [tempWifiName, setTempWifiName] = useState("");

  const isOnline = wifiOn && realOnline;
  const displayedTypeLabel = wifiOn ? (realOnline ? connectedWifi : "Offline") : "Off";

  const isBluetoothActive = bluetoothOn && (realBtAvailable ?? true);
  const bluetoothLabel = bluetoothOn ? "On" : "Off";

  const panelRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLDivElement>(null);
  const lastSoundTime = useRef(0);

  const handleRenameWifi = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setConnectedWifi(trimmed);
    localStorage.setItem("__desktopWifiSSID", trimmed);
    setWifiNetworks(prev => {
      const others = prev.filter(n => n.name !== trimmed);
      return [{ name: trimmed, secure: true }, ...others];
    });
    setEditingWifi(false);
  };

  // Fetch real SSID or visitor ISP
  useEffect(() => {
    const fetchWifiName = async () => {
      // Check localStorage first
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("__desktopWifiSSID");
        if (saved) {
          setConnectedWifi(saved);
          const isIN = navigator.language === "en-IN" || navigator.language === "hi";
          const others = isIN 
            ? ["ACT_Fibernet_2.4G", "Airtel_Xstream_Backup", "JioNet_Free", "TP-Link_Guest"]
            : ["Xfinity_WiFi", "Spectrum_Guest", "Linksys_Secure", "NETGEAR_Backup"];
          setWifiNetworks([
            { name: saved, secure: true },
            ...others.filter(n => n !== saved).map(name => ({ name, secure: true }))
          ]);
          return;
        }
      }

      let wifiName = "WiFi Network";
      let country = "IN";

      // 1. Try to get ISP from ipapi.co (handles generic visitors)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          country = data.country || "IN";
          const org = data.org || "";
          if (org.toLowerCase().includes("jio")) {
            wifiName = "JioFiber_5G";
          } else if (org.toLowerCase().includes("airtel")) {
            wifiName = "Airtel_Xstream_5G";
          } else if (org.toLowerCase().includes("act")) {
            wifiName = "ACT_Fibernet_5G";
          } else if (org.toLowerCase().includes("excitel")) {
            wifiName = "Excitel_Broadband";
          } else if (org.toLowerCase().includes("alliance")) {
            wifiName = "Alliance_Broadband";
          } else if (org) {
            const first = org.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
            wifiName = first ? `${first}_5G` : "WiFi Network";
          }
          
          const others = country === "IN" 
            ? ["ACT_Fibernet_2.4G", "Airtel_Xstream_Backup", "JioNet_Free", "TP-Link_Guest"]
            : ["Xfinity_WiFi", "Spectrum_Guest", "Linksys_Secure", "NETGEAR_Backup"];

          setConnectedWifi(wifiName);
          setWifiNetworks([
            { name: wifiName, secure: true },
            ...others.map(name => ({ name, secure: true }))
          ]);
          return;
        }
      } catch (err) {
        // Fall back
      }

      // 2. Fall back to local-wifi.json ONLY on localhost (for owner's local run)
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        try {
          const res = await fetch("/local-wifi.json");
          if (res.ok) {
            const data = await res.json();
            if (data.ssid && data.ssid !== "Local WiFi") {
              wifiName = data.ssid;
              setConnectedWifi(wifiName);
              const isIN = navigator.language === "en-IN" || navigator.language === "hi";
              const others = isIN 
                ? ["ACT_Fibernet_2.4G", "Airtel_Xstream_Backup", "JioNet_Free", "TP-Link_Guest"]
                : ["Xfinity_WiFi", "Spectrum_Guest", "Linksys_Secure", "NETGEAR_Backup"];
              setWifiNetworks([
                { name: wifiName, secure: true },
                ...others.map(name => ({ name, secure: true }))
              ]);
              return;
            }
          }
        } catch (err) {
          // Ignore
        }
      }

      // 3. Static fallback based on OS platform for generic visitors
      const ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
      if (ua.includes("macintosh") || ua.includes("iphone") || ua.includes("ipad")) {
        wifiName = "Apple_Network_5G";
      } else if (ua.includes("android")) {
        wifiName = "AndroidHotspot_5G";
      } else if (ua.includes("linux")) {
        wifiName = "Linux_Mesh_Secure";
      } else {
        wifiName = "Linksys_Secure_5G";
      }

      const isIN = typeof navigator !== "undefined" && (navigator.language === "en-IN" || navigator.language === "hi");
      const others = isIN 
        ? ["ACT_Fibernet_2.4G", "Airtel_Xstream_Backup", "JioNet_Free", "TP-Link_Guest"]
        : ["Xfinity_WiFi", "Spectrum_Guest", "Linksys_Secure", "NETGEAR_Backup"];

      setConnectedWifi(wifiName);
      setWifiNetworks([
        { name: wifiName, secure: true },
        ...others.map(name => ({ name, secure: true }))
      ]);
    };

    fetchWifiName();
  }, []);

  // Broadcast volume to OS audio system
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__desktopVolume = volume / 100;
      window.dispatchEvent(new CustomEvent("desktop-volume-change", { detail: volume }));
    }
  }, [volume]);

  // Broadcast network state
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__desktopOffline = !isOnline;
      window.dispatchEvent(new CustomEvent("desktop-network-change", { detail: { online: isOnline } }));
    }
  }, [isOnline]);

  // Broadcast bluetooth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__desktopBluetoothOn = isBluetoothActive;
      window.dispatchEvent(new CustomEvent("desktop-bluetooth-change", { detail: { active: isBluetoothActive } }));
    }
  }, [isBluetoothActive]);

  const playVolumeFeedback = (vol: number) => {
    const now = Date.now();
    if (now - lastSoundTime.current > 150) {
      sysAudio.playClick();
      lastSoundTime.current = now;
    }
  };

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const t = setInterval(update, 1000);

    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenSettings(false);
        setActiveView("main");
      }
      if (powerRef.current && !powerRef.current.contains(e.target as Node)) setOpenPowerMenu(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => { clearInterval(t); document.removeEventListener("mousedown", handleOutside); };
  }, []);

  const renderBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
    if (batteryLevel === null) return <BatteryFull className="w-4 h-4" />;
    if (batteryLevel > 80) return <BatteryFull className="w-4 h-4" />;
    if (batteryLevel > 40) return <BatteryMedium className="w-4 h-4" />;
    if (batteryLevel > 15) return <BatteryLow className="w-4 h-4" />;
    return <Battery className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="h-8 w-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-between px-4 select-none z-50 fixed top-0 left-0 right-0 border-b border-white/5">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleLaunchpad}
          className="hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors text-white/90 font-bold"
        >
          Dev&apos;s Portfolio
        </button>
      </div>

      {/* Center — Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded-md transition-colors cursor-default font-bold text-white/90">
        <span>{date}</span>
        <span>{time}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Recruiter mode toggle */}
        <button
          onClick={onToggleRecruiterMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all bg-white/5 border border-white/8 hover:bg-violet-600/10 hover:border-violet-500/35 text-white font-mono text-[10px] uppercase font-bold tracking-wide mr-1 shadow-[0_0_12px_rgba(139,92,246,0.06)]"
        >
          {recruiterMode ? "💻 OS Cockpit" : "💼 Recruiter Mode"}
        </button>

        {/* Control Center panel */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => {
              if (openSettings) {
                setActiveView("main");
              }
              setOpenSettings(!openSettings);
            }}
            className={`flex items-center gap-3 px-3 py-1 rounded-md transition-colors cursor-default ${
              openSettings ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            {isOnline
              ? <Wifi className="w-3.5 h-3.5 text-blue-400" />
              : <WifiOff className="w-3.5 h-3.5 text-red-400" />
            }
            <Volume2 className="w-3.5 h-3.5 text-white/80" />
            <div className="flex items-center gap-1.5">
              {batteryLevel !== null && <span className="text-[10px] text-white/70">{batteryLevel}%</span>}
              {renderBatteryIcon()}
            </div>
          </button>

          <AnimatePresence>
            {openSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-[290px] bg-[#0c0c16]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-50 text-white font-sans"
              >
                {/* Main View */}
                {activeView === "main" && (
                  <>
                    {/* Toggle tiles (macOS style grid) */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {/* WiFi card */}
                      <div
                        onClick={() => setActiveView("wifi")}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isOnline
                            ? "bg-blue-600/25 border-blue-500/30 text-blue-100 hover:bg-blue-600/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                            : "bg-white/5 border-white/5 text-white/50 hover:bg-white/8"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setWifiOn(!wifiOn);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isOnline ? "bg-blue-500 text-white" : "bg-white/10 text-white/50"
                            }`}
                          >
                            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold leading-tight">Wi-Fi</span>
                            <span className="text-[9px] opacity-75 font-semibold truncate leading-none mt-0.5">
                              {displayedTypeLabel}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      </div>

                      {/* Bluetooth card */}
                      <div
                        onClick={() => setActiveView("bluetooth")}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isBluetoothActive
                            ? "bg-blue-600/25 border-blue-500/30 text-blue-100 hover:bg-blue-600/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                            : "bg-white/5 border-white/5 text-white/50 hover:bg-white/8"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setBluetoothOn(!bluetoothOn);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isBluetoothActive ? "bg-blue-500 text-white" : "bg-white/10 text-white/50"
                            }`}
                          >
                            <Bluetooth className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold leading-tight">Bluetooth</span>
                            <span className="text-[9px] opacity-75 font-semibold truncate leading-none mt-0.5">
                              {bluetoothLabel}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      </div>
                    </div>

                    {/* macOS Style Thick Volume Slider */}
                    <div className="space-y-2 pt-2 border-t border-white/8">
                      <div className="relative h-7 bg-white/10 rounded-xl overflow-hidden flex items-center px-3">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-blue-500/80 transition-all pointer-events-none" 
                          style={{ width: `${volume}%` }}
                        />
                        <div className="flex justify-between items-center w-full z-10 pointer-events-none select-none text-[10px] font-bold uppercase tracking-wider text-white">
                          <span className="flex items-center gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-white" />
                            Volume
                          </span>
                          <span>{volume}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" value={volume}
                          onChange={e => {
                            const v = parseInt(e.target.value, 10);
                            setVolume(v);
                            playVolumeFeedback(v);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* macOS Style Thick Brightness Slider */}
                      <div className="relative h-7 bg-white/10 rounded-xl overflow-hidden flex items-center px-3">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-amber-500/80 transition-all pointer-events-none" 
                          style={{ width: `${brightness}%` }}
                        />
                        <div className="flex justify-between items-center w-full z-10 pointer-events-none select-none text-[10px] font-bold uppercase tracking-wider text-white">
                          <span className="flex items-center gap-2">
                            <Sun className="w-3.5 h-3.5 text-white" />
                            Brightness
                          </span>
                          <span>{brightness}%</span>
                        </div>
                        <input
                          type="range" min="10" max="100" value={brightness}
                          onChange={e => setBrightness(parseInt(e.target.value, 10))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Wi-Fi Sub-View */}
                {activeView === "wifi" && (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/8">
                      <button 
                        onClick={() => setActiveView("main")}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold">Wi-Fi</span>
                      <button 
                        onClick={() => setWifiOn(!wifiOn)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                          wifiOn ? "bg-blue-500" : "bg-white/20"
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${
                          wifiOn ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                    {/* Network List */}
                    {wifiOn ? (
                      <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                        {editingWifi && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg mb-2">
                            <input
                              type="text"
                              value={tempWifiName}
                              onChange={e => setTempWifiName(e.target.value)}
                              placeholder="Type actual Wi-Fi SSID..."
                              className="bg-transparent border-none outline-none text-[11px] text-white placeholder-white/30 flex-1 min-w-0 px-1 py-0.5"
                              onKeyDown={e => {
                                if (e.key === "Enter") handleRenameWifi(tempWifiName);
                                if (e.key === "Escape") setEditingWifi(false);
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleRenameWifi(tempWifiName)}
                              className="text-[10px] text-blue-400 font-bold hover:underline shrink-0 px-1"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingWifi(false)}
                              className="text-[10px] text-white/50 hover:underline shrink-0 px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {wifiNetworks.map(net => {
                          const isConnected = isOnline && connectedWifi === net.name;
                          const isConnecting = connectingNetwork === net.name;
                          return (
                            <button
                              key={net.name}
                              disabled={isConnecting}
                              onClick={() => {
                                if (isConnected) return;
                                setConnectingNetwork(net.name);
                                setTimeout(() => {
                                  setConnectedWifi(net.name);
                                  setConnectingNetwork(null);
                                }, 1200);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors hover:bg-white/8 ${
                                isConnected ? "text-blue-400 font-semibold" : "text-white/80"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                                  {isConnected && <Check className="w-3.5 h-3.5" />}
                                  {isConnecting && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
                                </div>
                                <span className="truncate">{net.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isConnected && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTempWifiName(net.name);
                                      setEditingWifi(true);
                                    }}
                                    className="p-1 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white"
                                    title="Rename Network"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {net.secure && <Lock className="w-3 h-3 opacity-40" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-white/40">
                        Wi-Fi is turned off.
                      </div>
                    )}
                  </div>
                )}

                {/* Bluetooth Sub-View */}
                {activeView === "bluetooth" && (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/8">
                      <button 
                        onClick={() => setActiveView("main")}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold">Bluetooth</span>
                      <button 
                        onClick={() => setBluetoothOn(!bluetoothOn)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                          bluetoothOn ? "bg-blue-500" : "bg-white/20"
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${
                          bluetoothOn ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>

                    {/* Devices List */}
                    {bluetoothOn ? (
                      <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                        <div className="text-[9px] font-bold text-white/30 px-2.5 uppercase tracking-wider mb-1">
                          My Devices
                        </div>
                        {btDevices.map(dev => {
                          const isConnected = isBluetoothActive && dev.connected;
                          const isConnecting = connectingBtDevice === dev.name;
                          return (
                            <button
                              key={dev.name}
                              disabled={isConnecting}
                              onClick={() => {
                                setConnectingBtDevice(dev.name);
                                setTimeout(() => {
                                  setBtDevices(prev => 
                                    prev.map(d => d.name === dev.name ? { ...d, connected: !d.connected } : d)
                                  );
                                  setConnectingBtDevice(null);
                                }, 1000);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors hover:bg-white/8 text-white/80"
                            >
                              <span className="truncate">{dev.name}</span>
                              <div className="flex items-center gap-1.5 text-[10px] text-white/40 shrink-0">
                                {isConnecting ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                                ) : isConnected ? (
                                  <span className="text-blue-400 font-medium">Connected</span>
                                ) : (
                                  <span>Not Connected</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-white/40">
                        Bluetooth is turned off.
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Power menu */}
        <div className="relative" ref={powerRef}>
          <button
            onClick={() => setOpenPowerMenu(!openPowerMenu)}
            className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
              openPowerMenu ? "bg-red-500/20 text-red-400" : "hover:bg-white/10 text-white/60 hover:text-white"
            }`}
          >
            <Power size={13} />
          </button>
          <AnimatePresence>
            {openPowerMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 bg-[#10101a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-40 py-1 font-sans z-50 text-white"
              >
                <button
                  onClick={() => { setOpenPowerMenu(false); onShutdown?.(); }}
                  className="w-[calc(100%-8px)] flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/8 transition-colors rounded-lg mx-1"
                >
                  <Power size={12} className="text-red-400" />
                  Warp Out (Exit)
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-[calc(100%-8px)] flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/8 transition-colors rounded-lg mx-1"
                >
                  <RotateCw size={12} className="text-blue-400" />
                  Restart System
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Real brightness overlay — CSS filter applied to entire page */}
      <div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{
          opacity: Math.max(0, (100 - brightness) / 100 * 0.65),
          zIndex: 999999,
        }}
      />
    </div>
  );
}
