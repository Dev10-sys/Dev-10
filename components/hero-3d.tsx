"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Stars, Sparkles, PerspectiveCamera, MeshDistortMaterial, Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BitcoinInfrastructure() {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      coreRef.current.rotation.x = t * 0.5;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.3;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.2;
    if (ring3Ref.current) ring3Ref.current.rotation.y = t * 0.4;
  });

  return (
    <group ref={meshRef}>
      {/* Central Engineering Core - Replaces the bright coin */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial 
          color="#F7931A" 
          wireframe 
          transparent 
          opacity={0.15}
          emissive="#F7931A"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Inner Heart of the System */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#F7931A" 
          emissive="#F7931A" 
          emissiveIntensity={2} 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* Structural Framework */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.01, 16, 100]} />
        <meshStandardMaterial color="#F7931A" transparent opacity={0.2} />
      </mesh>

      {/* Defensive Perimeter Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.01, 16, 100]} />
        <meshStandardMaterial color="#F7931A" emissive="#F7931A" emissiveIntensity={1} transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / -3, Math.PI / 4, 0]}>
        <torusGeometry args={[5.2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[6, 0.02, 16, 100]} />
        <meshStandardMaterial color="#F7931A" emissive="#F7931A" emissiveIntensity={2} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function TechBackground() {
  return null;
}

function CameraRig() {
  useFrame((state) => {
    const { mouse } = state;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={45} />
        <ambientLight intensity={1.5} />
        <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={5} color="#F7931A" />
        <pointLight position={[-10, -10, -10]} color="#FFFFFF" intensity={2} />
        <pointLight position={[0, 5, 5]} color="#F7931A" intensity={3} />
        <BitcoinInfrastructure />
        <TechBackground />
        <CameraRig />
      </Canvas>
    </div>
  );
}
