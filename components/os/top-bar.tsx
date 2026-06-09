"use client";

import { useEffect, useState } from "react";
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, Wifi, Volume2 } from "lucide-react";

export function TopBar() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    // Battery API
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          setIsCharging(battery.charging);
        });
      });
    }

    return () => clearInterval(timer);
  }, []);

  const renderBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="w-4 h-4" />;
    if (batteryLevel === null) return <BatteryFull className="w-4 h-4" />;
    if (batteryLevel > 80) return <BatteryFull className="w-4 h-4" />;
    if (batteryLevel > 40) return <BatteryMedium className="w-4 h-4" />;
    if (batteryLevel > 15) return <BatteryLow className="w-4 h-4" />;
    return <Battery className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="h-8 w-full bg-black/50 backdrop-blur-md text-white text-sm font-medium flex items-center justify-between px-4 select-none z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-4 cursor-default">
        <span className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">Activities</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 hover:bg-white/10 px-3 py-0.5 rounded transition-colors cursor-default font-bold">
        <span>{date}</span>
        <span>{time}</span>
      </div>

      <div className="flex items-center gap-3 hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-default">
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <div className="flex items-center gap-1">
          {batteryLevel !== null && <span className="text-xs">{batteryLevel}%</span>}
          {renderBatteryIcon()}
        </div>
      </div>
    </div>
  );
}
