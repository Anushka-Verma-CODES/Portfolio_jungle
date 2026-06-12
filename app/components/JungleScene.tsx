"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type TreeSpec = {
  position: [number, number, number];
  height: number;
  radius: number;
  canopy: number;
  lean: number;
};

type PlantSpec = {
  position: [number, number, number];
  scale: number;
  rotation: number;
  color: string;
};

const treeSpecs: TreeSpec[] = [
  { position: [-5.4, 0, -2.4], height: 9.8, radius: 0.46, canopy: 2.3, lean: -0.12 },
  { position: [4.7, 0, -2.1], height: 10.8, radius: 0.52, canopy: 2.6, lean: 0.08 },
  { position: [-3.2, 0, -5.4], height: 8.2, radius: 0.32, canopy: 2.1, lean: 0.1 },
  { position: [2.6, 0, -6.2], height: 9.4, radius: 0.36, canopy: 2.4, lean: -0.08 },
  { position: [-6.8, 0, -8.2], height: 11.4, radius: 0.44, canopy: 3.0, lean: 0.05 },
  { position: [6.4, 0, -8.8], height: 10.2, radius: 0.4, canopy: 2.8, lean: -0.05 },
  { position: [-1.2, 0, -10.5], height: 7.6, radius: 0.25, canopy: 2.0, lean: 0.03 },
  { position: [1.8, 0, -12.3], height: 8.6, radius: 0.3, canopy: 2.2, lean: -0.04 },
];

function seededNoise(index: number) {
  return Math.sin(index * 12.9898) * 43758.5453 % 1;
}

function CameraRig() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!camera.current) {
      return;
    }

    const time = clock.getElapsedTime();
    const nextX = THREE.MathUtils.damp(
      camera.current.position.x,
      pointer.x * 0.42,
      3,
      delta,
    );
    const nextY = THREE.MathUtils.damp(
      camera.current.position.y,
      1.82 + pointer.y * 0.18 + Math.sin(time * 0.35) * 0.025,
      3,
      delta,
    );
    camera.current.position.set(nextX, nextY, 7.1);
    camera.current.lookAt(pointer.x * 0.28, 1.55 + pointer.y * 0.1, -5.8);
  });

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[0, 1.82, 7.1]}
      fov={47}
      near={0.1}
      far={45}
    />
  );
}

function LeafCluster({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
    </mesh>
  );
}

function BroadLeaf({ color = "#2d7b45" }: { color?: string }) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.35, 18, 10]} />
      <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

function JungleTree({ position, height, radius, canopy, lean }: TreeSpec) {
  const trunkTop = height * 0.5;

  return (
    <group position={position} rotation={[0, 0, lean]}>
      <mesh castShadow receiveShadow position={[0, height * 0.5, 0]}>
        <cylinderGeometry args={[radius * 0.62, radius, height, 18, 8]} />
        <meshStandardMaterial color="#5a3927" roughness={0.88} />
      </mesh>

      <mesh castShadow receiveShadow position={[radius * 0.34, height * 0.36, radius * 0.16]} rotation={[0.08, 0.2, 0.08]}>
        <cylinderGeometry args={[radius * 0.08, radius * 0.14, height * 0.9, 10, 4]} />
        <meshStandardMaterial color="#6b452f" roughness={0.9} />
      </mesh>

      <LeafCluster
        position={[-0.48, trunkTop + 2.25, -0.2]}
        scale={[canopy * 0.88, canopy * 0.48, canopy * 0.68]}
        color="#174b32"
      />
      <LeafCluster
        position={[0.55, trunkTop + 2.05, 0.16]}
        scale={[canopy * 0.72, canopy * 0.44, canopy * 0.62]}
        color="#236b3e"
      />
      <LeafCluster
        position={[0.1, trunkTop + 2.75, -0.55]}
        scale={[canopy * 0.75, canopy * 0.54, canopy * 0.72]}
        color="#2f7d45"
      />
    </group>
  );
}

function Fern({ position, scale, rotation, color }: PlantSpec) {
  const leaves = [-0.72, -0.36, 0, 0.36, 0.72];

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {leaves.map((x, index) => (
        <group
          key={x}
          position={[x * 0.24, 0.32 + index * 0.025, 0]}
          rotation={[0.35, 0, x * -0.7]}
        >
          <BroadLeaf color={color} />
        </group>
      ))}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.5, 8]} />
        <meshStandardMaterial color="#466b32" roughness={0.85} />
      </mesh>
    </group>
  );
}

function GroundFoliage() {
  const plants = useMemo<PlantSpec[]>(() => {
    return Array.from({ length: 52 }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const depth = -1.4 - (index % 26) * 0.47;
      const spread = 1.5 + Math.abs(depth) * 0.35;
      const noise = seededNoise(index);

      return {
        position: [
          side * (1.05 + spread * (0.42 + Math.abs(noise) * 0.6)),
          0.04,
          depth + seededNoise(index + 9) * 0.28,
        ],
        scale: 0.55 + Math.abs(seededNoise(index + 4)) * 0.8,
        rotation: seededNoise(index + 12) * Math.PI,
        color: index % 3 === 0 ? "#225d39" : index % 3 === 1 ? "#327948" : "#476f2f",
      };
    });
  }, []);

  return (
    <group>
      {plants.map((plant, index) => (
        <Fern key={`${plant.position.join("-")}-${index}`} {...plant} />
      ))}
    </group>
  );
}

function LightRays() {
  const rays = [
    { position: [-2.5, 4.8, -3.8], rotation: [0.1, -0.35, -0.48], scale: [0.95, 6.8, 1] },
    { position: [0.4, 4.55, -5.2], rotation: [0.08, -0.2, -0.34], scale: [0.72, 6.2, 1] },
    { position: [2.8, 4.25, -6.5], rotation: [0.1, -0.1, -0.25], scale: [0.58, 5.7, 1] },
  ] as const;

  return (
    <group>
      {rays.map((ray, index) => (
        <mesh
          key={index}
          position={ray.position}
          rotation={ray.rotation}
          scale={ray.scale}
          renderOrder={1}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#ffe7a7"
            transparent
            opacity={0.13}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function JungleEnvironment() {
  const canopy = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!canopy.current) {
      return;
    }

    canopy.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.18) * 0.012;
  });

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -5.6]}>
        <planeGeometry args={[22, 30, 32, 32]} />
        <meshStandardMaterial color="#1f3427" roughness={1} />
      </mesh>

      {treeSpecs.map((tree) => (
        <JungleTree key={tree.position.join("-")} {...tree} />
      ))}

      <group ref={canopy}>
        <LeafCluster position={[-3.8, 7.0, -4.2]} scale={[3.1, 1.15, 1.7]} color="#123c2a" />
        <LeafCluster position={[3.8, 7.3, -4.6]} scale={[3.4, 1.2, 1.85]} color="#174a31" />
        <LeafCluster position={[0.1, 7.9, -7.2]} scale={[4.6, 1.55, 2.25]} color="#1d5b35" />
        <LeafCluster position={[-4.6, 6.7, -9.2]} scale={[3.7, 1.35, 2.0]} color="#113624" />
        <LeafCluster position={[4.8, 6.95, -9.6]} scale={[3.9, 1.3, 2.1]} color="#1d5534" />
      </group>

      <GroundFoliage />
      <LightRays />
    </group>
  );
}

export default function JungleScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#102219"]} />
        <fog attach="fog" args={["#627561", 6.2, 22]} />
        <ambientLight intensity={0.32} color="#6a8b73" />
        <hemisphereLight args={["#a7c8a3", "#18251b", 1.6]} />
        <directionalLight
          castShadow
          color="#ffe0a0"
          intensity={3.2}
          position={[-4.6, 8.8, 3.6]}
          shadow-camera-far={32}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-mapSize={[2048, 2048]}
        />
        <CameraRig />
        <JungleEnvironment />
        <Environment preset="forest" environmentIntensity={0.18} />
      </Canvas>
    </div>
  );
}
