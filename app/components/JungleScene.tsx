"use client";

import { Environment, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type VectorTuple = [number, number, number];

type AssetInstance = {
  src: string;
  position: VectorTuple;
  rotation?: VectorTuple;
  scale?: number | VectorTuple;
};

const MODEL_PATHS = {
  trunk: "/models/rainforest/rainforest-trunk.glb",
  canopy: "/models/rainforest/canopy-cluster.glb",
  fern: "/models/rainforest/fern.glb",
  vines: "/models/rainforest/vines.glb",
  undergrowth: "/models/rainforest/undergrowth.glb",
  floor: "/models/rainforest/forest-floor.glb",
} as const;

const trunks: AssetInstance[] = [
  { src: MODEL_PATHS.trunk, position: [-5.2, 0, -1.6], rotation: [0, -0.12, 0.03], scale: [1.25, 1.25, 1.25] },
  { src: MODEL_PATHS.trunk, position: [4.8, 0, -2.2], rotation: [0, 0.2, -0.02], scale: [1.35, 1.42, 1.35] },
  { src: MODEL_PATHS.trunk, position: [-3.4, 0, -5.2], rotation: [0, 0.55, 0.04], scale: [0.92, 1.06, 0.92] },
  { src: MODEL_PATHS.trunk, position: [2.9, 0, -5.9], rotation: [0, -0.35, -0.04], scale: [1.0, 1.16, 1.0] },
  { src: MODEL_PATHS.trunk, position: [-7.1, 0, -8.5], rotation: [0, -0.5, 0.01], scale: [1.25, 1.5, 1.25] },
  { src: MODEL_PATHS.trunk, position: [6.7, 0, -8.9], rotation: [0, 0.35, -0.03], scale: [1.18, 1.36, 1.18] },
  { src: MODEL_PATHS.trunk, position: [-1.2, 0, -11.2], rotation: [0, 0.14, 0.01], scale: [0.82, 1.0, 0.82] },
  { src: MODEL_PATHS.trunk, position: [1.9, 0, -13.1], rotation: [0, -0.22, -0.02], scale: [0.9, 1.08, 0.9] },
];

const canopies: AssetInstance[] = [
  { src: MODEL_PATHS.canopy, position: [-4.9, 6.0, -2.4], rotation: [0.12, 0.5, -0.1], scale: [2.0, 1.35, 1.6] },
  { src: MODEL_PATHS.canopy, position: [4.5, 6.35, -3.0], rotation: [0.04, -0.7, 0.08], scale: [2.25, 1.45, 1.75] },
  { src: MODEL_PATHS.canopy, position: [-1.2, 7.1, -6.5], rotation: [0.14, 0.15, 0.04], scale: [2.6, 1.55, 2.0] },
  { src: MODEL_PATHS.canopy, position: [2.5, 6.8, -7.5], rotation: [0.08, -0.2, -0.05], scale: [2.2, 1.4, 1.8] },
  { src: MODEL_PATHS.canopy, position: [-5.4, 6.65, -9.6], rotation: [0.08, -0.4, 0.02], scale: [2.3, 1.5, 1.9] },
  { src: MODEL_PATHS.canopy, position: [5.6, 6.8, -10.1], rotation: [0.1, 0.35, -0.04], scale: [2.4, 1.48, 2.0] },
];

const groundVegetation: AssetInstance[] = [
  { src: MODEL_PATHS.fern, position: [-2.8, 0, -1.4], rotation: [0, 0.5, 0], scale: 0.8 },
  { src: MODEL_PATHS.fern, position: [2.4, 0, -1.9], rotation: [0, -0.35, 0], scale: 0.72 },
  { src: MODEL_PATHS.fern, position: [-4.6, 0, -3.2], rotation: [0, 1.2, 0], scale: 1.15 },
  { src: MODEL_PATHS.fern, position: [4.2, 0, -3.8], rotation: [0, -1.0, 0], scale: 1.1 },
  { src: MODEL_PATHS.fern, position: [-2.0, 0, -5.3], rotation: [0, -0.75, 0], scale: 0.78 },
  { src: MODEL_PATHS.fern, position: [1.9, 0, -6.0], rotation: [0, 0.85, 0], scale: 0.82 },
  { src: MODEL_PATHS.undergrowth, position: [-3.8, 0, -2.4], rotation: [0, 0.1, 0], scale: 1.65 },
  { src: MODEL_PATHS.undergrowth, position: [3.6, 0, -2.8], rotation: [0, -0.6, 0], scale: 1.55 },
  { src: MODEL_PATHS.undergrowth, position: [-5.5, 0, -5.8], rotation: [0, 1.0, 0], scale: 2.0 },
  { src: MODEL_PATHS.undergrowth, position: [5.1, 0, -6.4], rotation: [0, -1.2, 0], scale: 2.05 },
  { src: MODEL_PATHS.undergrowth, position: [-1.8, 0, -8.8], rotation: [0, 0.4, 0], scale: 1.45 },
  { src: MODEL_PATHS.undergrowth, position: [2.2, 0, -9.6], rotation: [0, -0.2, 0], scale: 1.55 },
];

const vines: AssetInstance[] = [
  { src: MODEL_PATHS.vines, position: [-3.8, 3.2, -2.4], rotation: [0, 0.25, 0], scale: [1.0, 1.22, 1.0] },
  { src: MODEL_PATHS.vines, position: [2.5, 3.5, -3.8], rotation: [0, -0.5, 0], scale: [0.95, 1.35, 0.95] },
  { src: MODEL_PATHS.vines, position: [-1.1, 3.9, -6.4], rotation: [0, 0.85, 0], scale: [1.2, 1.45, 1.2] },
  { src: MODEL_PATHS.vines, position: [5.1, 3.0, -8.2], rotation: [0, -0.65, 0], scale: [1.15, 1.4, 1.15] },
];

const allInstances: AssetInstance[] = [
  { src: MODEL_PATHS.floor, position: [0, 0, -6.3], scale: [1.15, 1, 1.15] },
  ...trunks,
  ...canopies,
  ...groundVegetation,
  ...vines,
];

function CameraRig() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { pointer, viewport } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const targetPositionX = useRef(0);
  const targetPositionY = useRef(0);

  useFrame((_, delta) => {
    if (!camera.current) {
      return;
    }

    // Enhanced parallax with smooth mouse tracking
    const maxYaw = THREE.MathUtils.degToRad(12);
    const maxPitch = THREE.MathUtils.degToRad(6);
    const maxPositionX = 0.8;
    const maxPositionY = 0.6;

    // Mouse-based parallax (both rotation and position shift)
    const targetYaw = THREE.MathUtils.clamp(-pointer.x * maxYaw, -maxYaw, maxYaw);
    const targetPitch = THREE.MathUtils.clamp(pointer.y * maxPitch, -maxPitch, maxPitch);
    targetPositionX.current = pointer.x * maxPositionX;
    targetPositionY.current = -pointer.y * maxPositionY;

    // Smooth damping for more natural movement
    yaw.current = THREE.MathUtils.damp(yaw.current, targetYaw, 3.8, delta);
    pitch.current = THREE.MathUtils.damp(pitch.current, targetPitch, 3.8, delta);

    const posX = THREE.MathUtils.damp(
      camera.current.position.x,
      targetPositionX.current,
      3.5,
      delta
    );
    const posY = THREE.MathUtils.damp(
      camera.current.position.y,
      1.68 + targetPositionY.current,
      3.5,
      delta
    );

    camera.current.position.set(posX, posY, 6.2);
    camera.current.rotation.order = "YXZ";
    camera.current.rotation.set(pitch.current, yaw.current, 0);
  });

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[0, 1.68, 6.2]}
      rotation={[0, 0, 0]}
      fov={50}
      near={0.1}
      far={48}
    />
  );
}

function RainforestAsset({ src, position, rotation = [0, 0, 0], scale = 1 }: AssetInstance) {
  const { scene } = useGLTF(src);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;

        // Improve materials for better realism
        if (child.material instanceof THREE.Material) {
          (child.material as any).envMapIntensity = 0.6;
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position}>
      <primitive object={model} rotation={rotation} scale={scale} />
    </group>
  );
}

function VolumetricSunlight() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const shafts = [
    { position: [-3.6, 4.4, -3.1], rotation: [0.06, -0.34, -0.54], scale: [1.15, 7.2, 1] },
    { position: [-1.2, 4.2, -5.3], rotation: [0.08, -0.24, -0.42], scale: [0.8, 6.5, 1] },
    { position: [1.6, 4.0, -6.6], rotation: [0.08, -0.16, -0.34], scale: [0.72, 6.2, 1] },
    { position: [4.0, 3.8, -8.4], rotation: [0.08, -0.1, -0.24], scale: [0.58, 5.6, 1] },
  ] as const;

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle responsive rotation to light shafts
    groupRef.current.rotation.y = pointer.x * 0.2;
  });

  return (
    <group ref={groupRef}>
      {shafts.map((shaft, index) => (
        <mesh
          key={index}
          position={shaft.position}
          rotation={shaft.rotation}
          scale={shaft.scale}
          renderOrder={1}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#ffe8ad"
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function RainforestEnvironment() {
  return (
    <group>
      {allInstances.map((instance, index) => (
        <RainforestAsset key={`${instance.src}-${index}`} {...instance} />
      ))}
      <VolumetricSunlight />
    </group>
  );
}

export default function JungleScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <color attach="background" args={["#07120d"]} />
        <fog attach="fog" args={["#4d6451", 4.8, 26]} />
        
        {/* Ambient & Environmental Lighting */}
        <ambientLight intensity={0.26} color="#5a7d66" />
        <hemisphereLight args={["#a8d5a0", "#0f1f18", 1.25]} />
        
        {/* Main Directional Light */}
        <directionalLight
          castShadow
          color="#ffd38c"
          intensity={4.8}
          position={[-5.2, 9.2, 3.8]}
          shadow-camera-far={38}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-bias={-0.0002}
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Secondary Fill Light for depth */}
        <pointLight
          color="#7fb378"
          intensity={0.8}
          position={[6, 5, 4]}
          distance={20}
          decay={2}
        />
        
        {/* Camera with Enhanced Parallax */}
        <CameraRig />
        
        <Suspense fallback={null}>
          <RainforestEnvironment />
          <Environment preset="forest" environmentIntensity={0.15} />
        </Suspense>
      </Canvas>
    </div>
  );
}

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
