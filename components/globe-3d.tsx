"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function GlobalNetwork() {
  const meshRef = useRef<THREE.Group>(null);
  
  const arcPoints = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < 20; i++) {
      const start = new THREE.Vector3().setFromSphericalCoords(
        5,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      const end = new THREE.Vector3().setFromSphericalCoords(
        5,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(7);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      arcs.push(curve.getPoints(50));
    }
    return arcs;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* The Core Globe */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial 
          color="#111" 
          wireframe 
          transparent 
          opacity={0.2} 
          emissive="#F7931A" 
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[4.8, 64, 64]} />
        <meshStandardMaterial color="#050505" transparent opacity={0.8} />
      </mesh>

      {/* Connection Arcs */}
      {arcPoints.map((points, i) => (
        <Line key={i} points={points} />
      ))}

      {/* Glowing Cities (Impact Nodes) */}
      {[...Array(40)].map((_, i) => (
        <mesh 
          key={i} 
          position={new THREE.Vector3().setFromSphericalCoords(5, Math.random() * Math.PI, Math.random() * Math.PI * 2)}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#F7931A" emissive="#F7931A" emissiveIntensity={5} />
        </mesh>
      ))}
    </group>
  );
}

function Line({ points }: { points: THREE.Vector3[] }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#F7931A" transparent opacity={0.2} />
    </line>
  );
}

export function Globe3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#F7931A" />
        <GlobalNetwork />
      </Canvas>
    </div>
  );
}
