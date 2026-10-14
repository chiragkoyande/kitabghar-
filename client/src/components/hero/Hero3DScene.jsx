import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function OpenBook({ onHover }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, hovered ? 0.16 : 0, delta * 4);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, hovered ? -0.025 : 0, delta * 4);
  });
  return <group ref={group} onPointerEnter={() => { setHovered(true); onHover(true); }} onPointerLeave={() => { setHovered(false); onHover(false); }} rotation={[0.24, -0.18, 0]}>
    <RoundedBox args={[2.28, 0.18, 1.62]} radius={0.08} smoothness={3} position={[-1.06, 0, 0]} rotation={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#a9421d" roughness={0.5} metalness={0.08} /></RoundedBox>
    <RoundedBox args={[2.28, 0.18, 1.62]} radius={0.08} smoothness={3} position={[1.06, 0, 0]} rotation={[0, -0.2, 0]} castShadow><meshStandardMaterial color="#a9421d" roughness={0.5} metalness={0.08} /></RoundedBox>
    <RoundedBox args={[2.08, 0.24, 1.42]} radius={0.06} smoothness={3} position={[-0.94, 0.16, 0]} rotation={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#f7f0df" roughness={0.82} /></RoundedBox>
    <RoundedBox args={[2.08, 0.24, 1.42]} radius={0.06} smoothness={3} position={[0.94, 0.16, 0]} rotation={[0, -0.2, 0]} castShadow><meshStandardMaterial color="#f7f0df" roughness={0.82} /></RoundedBox>
    {[0.205, 0.24, 0.275].map((y) => <mesh key={y} position={[-0.93, y, 0]} rotation={[0, 0.2, 0]}><boxGeometry args={[1.92, 0.012, 1.25]} /><meshStandardMaterial color="#dfcba8" roughness={1} /></mesh>)}
    {[0.205, 0.24, 0.275].map((y) => <mesh key={y} position={[0.93, y, 0]} rotation={[0, -0.2, 0]}><boxGeometry args={[1.92, 0.012, 1.25]} /><meshStandardMaterial color="#dfcba8" roughness={1} /></mesh>)}
    <RoundedBox args={[0.12, 0.28, 1.5]} radius={0.035} smoothness={2} position={[0, 0.25, 0]} castShadow><meshStandardMaterial color="#d5b888" roughness={0.82} /></RoundedBox>
    <mesh position={[0, 0.39, 0]}><boxGeometry args={[0.06, 0.012, 1.2]} /><meshStandardMaterial color="#c95722" roughness={0.55} /></mesh>
  </group>;
}

function FloatingBook({ position, rotation, scale = 1, color = "#5e6d55", label }) {
  return <Float speed={1.05} rotationIntensity={0.12} floatIntensity={0.22} floatingRange={[-0.08, 0.08]}>
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow><boxGeometry args={[0.85, 0.16, 1.3]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.72, 0.05, 1.15]} /><meshStandardMaterial color="#f7f0df" roughness={0.9} /></mesh>
      {label && <Html center distanceFactor={9}><span className="scene-tooltip">{label}</span></Html>}
    </group>
  </Float>;
}

function HouseStructure() {
  return <group position={[0, 0.7, -0.52]} scale={0.92}>
    <mesh position={[-0.62, 0.2, 0]} castShadow><boxGeometry args={[0.12, 1.05, 0.12]} /><meshStandardMaterial color="#5e6d55" roughness={0.8} /></mesh>
    <mesh position={[0.62, 0.2, 0]} castShadow><boxGeometry args={[0.12, 1.05, 0.12]} /><meshStandardMaterial color="#5e6d55" roughness={0.8} /></mesh>
    <mesh position={[0, 0.7, 0]}><boxGeometry args={[1.35, 0.1, 0.12]} /><meshStandardMaterial color="#5e6d55" roughness={0.8} /></mesh>
    <mesh position={[-0.5, 0.86, 0]} rotation={[0, 0, -0.62]} castShadow><boxGeometry args={[0.95, 0.1, 0.12]} /><meshStandardMaterial color="#c95722" roughness={0.55} /></mesh>
    <mesh position={[0.5, 0.86, 0]} rotation={[0, 0, 0.62]} castShadow><boxGeometry args={[0.95, 0.1, 0.12]} /><meshStandardMaterial color="#c95722" roughness={0.55} /></mesh>
    <mesh position={[0, 0.22, -0.04]}><boxGeometry args={[0.24, 0.5, 0.08]} /><meshStandardMaterial color="#c95722" roughness={0.7} /></mesh>
  </group>;
}

function PageParticles() {
  const pages = [[-1.9, 1.4, 0.1, 0.35], [1.9, 1.3, -0.2, -0.3], [-2.1, 0.6, -0.2, 0.12], [2.2, 0.4, 0.1, -0.18], [0.1, 1.9, -0.4, 0.08]];
  return <>{pages.map(([x, y, z, r], index) => <Float key={index} speed={0.7 + index * 0.08} rotationIntensity={0.35} floatIntensity={0.2}><mesh position={[x, y, z]} rotation={[0, r, r]}><planeGeometry args={[0.35, 0.48]} /><meshStandardMaterial color="#fff9ed" roughness={1} side={THREE.DoubleSide} /></mesh></Float>)}</>;
}

function SceneContent({ reducedMotion }) {
  const scene = useRef();
  const [bookHovered, setBookHovered] = useState(false);
  useFrame(({ pointer }, delta) => {
    if (!scene.current || reducedMotion) return;
    scene.current.rotation.y = THREE.MathUtils.lerp(scene.current.rotation.y, pointer.x * 0.06, delta * 2.5);
    scene.current.rotation.x = THREE.MathUtils.lerp(scene.current.rotation.x, -pointer.y * 0.04, delta * 2.5);
  });
  return <group ref={scene} position={[0, 0.22, 0]} scale={bookHovered ? 1.03 : 1}>
    <mesh position={[0, -0.25, 0]} receiveShadow castShadow><cylinderGeometry args={[3.3, 3.55, 0.28, 64]} /><meshStandardMaterial color="#dfc9a7" roughness={0.88} /></mesh>
    <mesh position={[0, -0.08, 0]} receiveShadow><cylinderGeometry args={[2.95, 3.1, 0.08, 64]} /><meshStandardMaterial color="#f1e5cf" roughness={0.92} /></mesh>
    <HouseStructure />
    <OpenBook onHover={setBookHovered} />
    <FloatingBook position={[-2.25, 0.7, 0.4]} rotation={[0.1, 0.35, -0.25]} scale={0.8} color="#6d7b61" label={bookHovered ? "Atomic Habits" : ""} />
    <FloatingBook position={[2.15, 0.72, 0.15]} rotation={[-0.15, -0.45, 0.2]} scale={0.72} color="#9f5634" />
    <FloatingBook position={[-1.75, -0.1, -0.9]} rotation={[0.15, 0.4, 0.05]} scale={0.58} color="#7f4c52" />
    <FloatingBook position={[1.8, -0.05, -0.8]} rotation={[-0.1, -0.3, -0.1]} scale={0.55} color="#a67a4e" />
    <PageParticles />
  </group>;
}

function MotionOverlay({ reducedMotion }) {
  const overlay = useRef();
  useFrame(({ pointer }, delta) => {
    if (!overlay.current || reducedMotion) return;
    overlay.current.rotation.y = THREE.MathUtils.lerp(overlay.current.rotation.y, pointer.x * 0.025, delta * 2);
    overlay.current.rotation.x = THREE.MathUtils.lerp(overlay.current.rotation.x, -pointer.y * 0.018, delta * 2);
  });
  return <group ref={overlay}><Float speed={0.7} rotationIntensity={0.12} floatIntensity={0.18}><mesh position={[-2.35, 1.05, 0]} rotation={[0, 0.2, -0.25]}><planeGeometry args={[0.28, 0.4]} /><meshStandardMaterial color="#fff9ed" transparent opacity={0.6} side={THREE.DoubleSide} /></mesh></Float><Float speed={0.85} rotationIntensity={0.1} floatIntensity={0.16}><mesh position={[2.25, 0.9, 0]} rotation={[0, -0.18, 0.24]}><planeGeometry args={[0.24, 0.34]} /><meshStandardMaterial color="#fff9ed" transparent opacity={0.55} side={THREE.DoubleSide} /></mesh></Float></group>;
}

function StaticHeroArt() {
  return <div className="hero-static-art" aria-hidden="true"><div className="static-house" /><div className="static-book"><span /><span /></div><i className="static-page page-one" /><i className="static-page page-two" /><i className="static-page page-three" /></div>;
}

class SceneErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function Hero3DScene() {
  const reducedMotion = useReducedMotion();
  return <div className="hero-3d" aria-hidden="true"><div className="hero-render-stage"><img src="/book-genie.webp" alt="" /><span className="render-halo" /></div><SceneErrorBoundary fallback={null}><Canvas className="hero-motion-layer" dpr={[1, 1.25]} frameloop={reducedMotion ? "demand" : "always"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}><PerspectiveCamera makeDefault position={[0, 0, 5]} fov={30} /><ambientLight intensity={1.1} color="#fff8e8" /><directionalLight position={[2, 3, 4]} intensity={1.8} color="#ffd0a3" /><Suspense fallback={null}><MotionOverlay reducedMotion={reducedMotion} /></Suspense></Canvas></SceneErrorBoundary></div>;
}
