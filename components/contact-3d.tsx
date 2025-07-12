"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Points, PointMaterial, Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DataCascade() {
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= 0.1;
        if (positions[i * 3 + 1] < -25) positions[i * 3 + 1] = 25;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#F7931A"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function SignalLines() {
  const ref = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        l.push({ x, z, height: 10 + Math.random() * 20 });
    }
    return l;
  }, []);

  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y = -state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {lines.map((l, i) => (
        <mesh key={i} position={[l.x, 0, l.z]}>
          <cylinderGeometry args={[0.02, 0.02, l.height, 8]} />
          <meshBasicMaterial color="#F7931A" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export function Contact3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-transparent">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
        <ambientLight intensity={1} />
        
        <DataCascade />
        <SignalLines />
      </Canvas>
    </div>
  );
}
