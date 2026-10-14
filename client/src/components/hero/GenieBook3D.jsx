import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ── Magical Orb that floats above the book ── */
function GenieOrb({ active, thinking }) {
  const ref = useRef();
  const glowRef = useRef();
  const [pulse, setPulse] = useState(0);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // Float up/down
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      active ? 2.1 + Math.sin(t * 1.8) * 0.15 : 1.6 + Math.sin(t * 0.8) * 0.08,
      delta * 3
    );

    // Scale pulse when thinking
    const targetScale = thinking ? 1.15 + Math.sin(t * 4) * 0.12 : active ? 1.05 : 0.85;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, delta * 4);
    ref.current.scale.set(s, s, s);

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        active ? 0.35 + Math.sin(t * 2.5) * 0.15 : 0.12,
        delta * 3
      );
    }

    // Gentle rotation
    ref.current.rotation.y += delta * (active ? 1.2 : 0.3);
  });

  return (
    <group ref={ref} position={[0, 1.6, 0]}>
      {/* Core orb */}
      <mesh>
        <icosahedronGeometry args={[0.28, 4]} />
        <meshStandardMaterial
          color={active ? "#ff8c42" : "#c95722"}
          emissive={active ? "#ff6600" : "#c95722"}
          emissiveIntensity={active ? 1.5 : 0.4}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <icosahedronGeometry args={[0.22, 3]} />
        <meshStandardMaterial
          color="#ffe4c4"
          emissive="#ffaa55"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color="#ff8c42"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Sparkle particles around orb */}
      {active && <OrbSparkles />}
    </group>
  );
}

/* ── Sparkle particles around the orb ── */
function OrbSparkles() {
  const ref = useRef();
  const sparkles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      arr.push({
        angle,
        radius: 0.4 + Math.random() * 0.25,
        speed: 0.8 + Math.random() * 1.2,
        yOffset: (Math.random() - 0.5) * 0.4,
        size: 0.015 + Math.random() * 0.02,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const s = sparkles[i];
      child.position.x = Math.cos(s.angle + t * s.speed) * s.radius;
      child.position.z = Math.sin(s.angle + t * s.speed) * s.radius;
      child.position.y = s.yOffset + Math.sin(t * 2 + i) * 0.1;
      child.material.opacity = 0.4 + Math.sin(t * 3 + i * 0.7) * 0.4;
    });
  });

  return (
    <group ref={ref}>
      {sparkles.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshBasicMaterial color="#ffe4a0" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 3D Book that opens when genie is active ── */
function MagicBook({ active, result }) {
  const groupRef = useRef();
  const leftCoverRef = useRef();
  const rightCoverRef = useRef();

  useFrame(({ clock, pointer }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle floating
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      Math.sin(t * 0.7) * 0.08,
      delta * 3
    );

    // Mouse parallax on the whole group
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15 + (active ? 0 : -0.15),
      delta * 2.5
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.08 + 0.2,
      delta * 2.5
    );

    // Open/close book covers
    if (leftCoverRef.current && rightCoverRef.current) {
      const openAngle = active ? 0.45 : 0.15;
      leftCoverRef.current.rotation.y = THREE.MathUtils.lerp(
        leftCoverRef.current.rotation.y,
        openAngle,
        delta * 3
      );
      rightCoverRef.current.rotation.y = THREE.MathUtils.lerp(
        rightCoverRef.current.rotation.y,
        -openAngle,
        delta * 3
      );
    }
  });

  const coverColor = result ? "#5c6b4f" : "#a9421d";
  const pageColor = "#f7f0df";
  const spineColor = "#d5b888";

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.15}>
      {/* Left cover (hinged at center) */}
      <group ref={leftCoverRef} position={[0, 0, 0]}>
        <RoundedBox
          args={[1.8, 0.12, 1.4]}
          radius={0.04}
          smoothness={3}
          position={[-0.9, 0, 0]}
          castShadow
        >
          <meshStandardMaterial
            color={coverColor}
            roughness={0.5}
            metalness={0.08}
          />
        </RoundedBox>
        {/* Pages on left */}
        <RoundedBox
          args={[1.6, 0.18, 1.2]}
          radius={0.03}
          smoothness={2}
          position={[-0.8, 0.1, 0]}
        >
          <meshStandardMaterial color={pageColor} roughness={0.9} />
        </RoundedBox>
        {/* Page lines */}
        {[0.14, 0.17, 0.2].map((y) => (
          <mesh key={y} position={[-0.8, y, 0]}>
            <boxGeometry args={[1.4, 0.008, 1.0]} />
            <meshStandardMaterial color="#dfcba8" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Right cover (hinged at center) */}
      <group ref={rightCoverRef} position={[0, 0, 0]}>
        <RoundedBox
          args={[1.8, 0.12, 1.4]}
          radius={0.04}
          smoothness={3}
          position={[0.9, 0, 0]}
          castShadow
        >
          <meshStandardMaterial
            color={coverColor}
            roughness={0.5}
            metalness={0.08}
          />
        </RoundedBox>
        {/* Pages on right */}
        <RoundedBox
          args={[1.6, 0.18, 1.2]}
          radius={0.03}
          smoothness={2}
          position={[0.8, 0.1, 0]}
        >
          <meshStandardMaterial color={pageColor} roughness={0.9} />
        </RoundedBox>
        {/* Page lines */}
        {[0.14, 0.17, 0.2].map((y) => (
          <mesh key={y} position={[0.8, y, 0]}>
            <boxGeometry args={[1.4, 0.008, 1.0]} />
            <meshStandardMaterial color="#dfcba8" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Spine */}
      <RoundedBox
        args={[0.1, 0.22, 1.35]}
        radius={0.03}
        smoothness={2}
        position={[0, 0.08, 0]}
        castShadow
      >
        <meshStandardMaterial color={spineColor} roughness={0.8} />
      </RoundedBox>

      {/* Bookmark ribbon */}
      <mesh position={[0.3, 0.22, -0.5]} rotation={[0.1, 0, 0.08]}>
        <boxGeometry args={[0.06, 0.5, 0.01]} />
        <meshStandardMaterial color="#c95722" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ── Floating mini books around the scene ── */
function FloatingMiniBook({ position, rotation, scale = 0.4, color = "#5e6d55", delay = 0 }) {
  return (
    <Float
      speed={0.8 + delay * 0.3}
      rotationIntensity={0.15}
      floatIntensity={0.2}
      floatingRange={[-0.06, 0.06]}
    >
      <group position={position} rotation={rotation} scale={scale}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.12, 1.0]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.88]} />
          <meshStandardMaterial color="#f7f0df" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Magic dust particles ── */
function MagicDust({ active }) {
  const ref = useRef();
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 3.5 - 0.5,
        z: (Math.random() - 0.5) * 3,
        speed: 0.3 + Math.random() * 0.7,
        size: 0.01 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.y = ((p.y + t * p.speed * 0.3) % 3.5) - 0.5;
      child.position.x = p.x + Math.sin(t * 0.5 + p.phase) * 0.3;
      child.material.opacity = active
        ? 0.3 + Math.sin(t * 2 + p.phase) * 0.3
        : 0.08 + Math.sin(t + p.phase) * 0.08;
    });
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 4, 4]} />
          <meshBasicMaterial color="#ffe4a0" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Base platform ── */
function Platform() {
  return (
    <group position={[0, -0.7, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.18, 48]} />
        <meshStandardMaterial color="#dfc9a7" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.95, 2.1, 0.06, 48]} />
        <meshStandardMaterial color="#f1e5cf" roughness={0.92} />
      </mesh>
    </group>
  );
}

/* ── Full scene composition ── */
function SceneContent({ active, thinking, result }) {
  return (
    <group>
      <Platform />
      <MagicBook active={active} result={result} />
      <GenieOrb active={active} thinking={thinking} />

      {/* Floating mini books */}
      <FloatingMiniBook
        position={[-2.1, 0.8, 0.3]}
        rotation={[0.1, 0.3, -0.2]}
        scale={0.35}
        color="#6d7b61"
        delay={0}
      />
      <FloatingMiniBook
        position={[2.0, 0.9, 0.1]}
        rotation={[-0.12, -0.4, 0.18]}
        scale={0.3}
        color="#9f5634"
        delay={1}
      />
      <FloatingMiniBook
        position={[-1.6, -0.2, -0.7]}
        rotation={[0.15, 0.5, 0.05]}
        scale={0.25}
        color="#7f4c52"
        delay={2}
      />
      <FloatingMiniBook
        position={[1.7, -0.15, -0.6]}
        rotation={[-0.1, -0.25, -0.1]}
        scale={0.22}
        color="#a67a4e"
        delay={3}
      />

      <MagicDust active={active} />
    </group>
  );
}

/* ── Error boundary ── */
class SceneErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ── Exported 3D Scene ── */
export default function GenieBook3D({ active = false, thinking = false, result = null }) {
  return (
    <div className="genie-3d-scene" aria-hidden="true">
      <SceneErrorBoundary fallback={<GenieFallbackArt active={active} />}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          shadows
        >
          <PerspectiveCamera makeDefault position={[0, 1.2, 5.5]} fov={28} />
          <ambientLight intensity={0.9} color="#fff8e8" />
          <directionalLight
            position={[3, 4, 4]}
            intensity={1.6}
            color="#ffd0a3"
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
          <pointLight
            position={[0, 2.5, 1]}
            intensity={active ? 2.5 : 0.8}
            color="#ff8c42"
            distance={6}
          />
          <Suspense fallback={null}>
            <SceneContent active={active} thinking={thinking} result={result} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      <div className={`genie-3d-glow ${active ? "active" : ""}`} />
    </div>
  );
}

/* ── CSS-only fallback if WebGL fails ── */
function GenieFallbackArt({ active }) {
  return (
    <div className={`genie-fallback-art ${active ? "active" : ""}`}>
      <div className="fallback-book">
        <span className="fallback-cover left" />
        <span className="fallback-spine" />
        <span className="fallback-cover right" />
      </div>
      <div className="fallback-orb">
        <span>✦</span>
      </div>
      <i className="fallback-sparkle s1" />
      <i className="fallback-sparkle s2" />
      <i className="fallback-sparkle s3" />
    </div>
  );
}
