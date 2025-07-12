"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars, Float as FloatDrei } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DigitalGrid() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.getElapsedTime() * 2) % 10;
    }
  });

  return (
    <group ref={ref}>
      {[...Array(20)].map((_, i) => (
        <group key={i} position={[0, 0, -i * 10]}>
          {/* Horizontal Lines */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[100, 0.05]} />
            <meshBasicMaterial color="#F7931A" transparent opacity={0.1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
            <planeGeometry args={[100, 0.05]} />
            <meshBasicMaterial color="#F7931A" transparent opacity={0.1} />
          </mesh>
          {/* Vertical Lines */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 0, 0]}>
            <planeGeometry args={[20, 0.05]} />
            <meshBasicMaterial color="#F7931A" transparent opacity={0.1} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[10, 0, 0]}>
            <planeGeometry args={[20, 0.05]} />
            <meshBasicMaterial color="#F7931A" transparent opacity={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingTech() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 1) * 50
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.5 + Math.random() * 1.5,
      type: i % 3
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.position.z += 0.1;
      if (group.current.position.z > 20) group.current.position.z = 0;
    }
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <FloatDrei key={i} speed={2} rotationIntensity={2} floatIntensity={1}>
          <mesh position={item.position as any} rotation={item.rotation as any} scale={item.scale}>
            {item.type === 0 ? <boxGeometry args={[1, 1, 1]} /> : 
             item.type === 1 ? <octahedronGeometry args={[1]} /> : 
             <torusGeometry args={[0.8, 0.2, 16, 32]} />}
            <meshStandardMaterial 
              color={item.type === 0 ? "#F7931A" : "#FFFFFF"} 
              wireframe={i % 2 === 0}
              transparent
              opacity={0.2}
              emissive={item.type === 0 ? "#F7931A" : "#FFFFFF"}
              emissiveIntensity={0.5}
            />
          </mesh>
        </FloatDrei>
      ))}
    </group>
  );
}

export function Project3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-transparent">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#F7931A" />
        
        <DigitalGrid />
        <FloatingTech />
      </Canvas>
    </div>
  );
}
