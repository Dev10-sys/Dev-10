"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-30 bg-[#050505] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars 
          radius={100} 
          depth={50} 
          count={2000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.1} 
        />
        <Sparkles 
          count={80} 
          scale={[20, 20, 20]} 
          size={1} 
          speed={0.1} 
          color="#F7931A" 
        />
      </Canvas>
      
      {/* Global Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-40" />
    </div>
  );
}
