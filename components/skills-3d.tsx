"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function EngineeringNodes() {
  const nodes = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      speed: 1 + Math.random(),
      distort: 0.4 + Math.random() * 0.4,
      color: i % 2 === 0 ? "#F7931A" : "#FFFFFF"
    }));
  }, []);

  return (
    <group>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={node.position as any}>
            <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
            <MeshDistortMaterial 
              color={node.color} 
              speed={2} 
              distort={node.distort} 
              radius={1}
              transparent
              opacity={0.15}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function DataStream() {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 200; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      ));
    }
    return p;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="#F7931A" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function Skills3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-transparent">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#F7931A" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FFFFFF" />
        
        <EngineeringNodes />
        <DataStream />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
