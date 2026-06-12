import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "models", "rainforest");

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }
};

const barkMaterial = new THREE.MeshStandardMaterial({
  color: "#4d3428",
  roughness: 0.96,
  metalness: 0.02,
});

const darkBarkMaterial = new THREE.MeshStandardMaterial({
  color: "#2f211b",
  roughness: 1,
});

const leafMaterials = [
  new THREE.MeshStandardMaterial({
    color: "#163f2b",
    roughness: 0.88,
    metalness: 0.01,
    side: THREE.DoubleSide,
  }),
  new THREE.MeshStandardMaterial({
    color: "#235f38",
    roughness: 0.84,
    metalness: 0.01,
    side: THREE.DoubleSide,
  }),
  new THREE.MeshStandardMaterial({
    color: "#3b7a37",
    roughness: 0.9,
    metalness: 0.01,
    side: THREE.DoubleSide,
  }),
];

const vineMaterial = new THREE.MeshStandardMaterial({
  color: "#334322",
  roughness: 0.92,
  metalness: 0.01,
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#1f2f21",
  roughness: 1,
  metalness: 0,
});

function makeLeaf(width, height, material) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height * 0.5);
  shape.bezierCurveTo(width * 0.55, height * 0.22, width * 0.48, -height * 0.34, 0, -height * 0.5);
  shape.bezierCurveTo(-width * 0.48, -height * 0.34, -width * 0.55, height * 0.22, 0, height * 0.5);

  const geometry = new THREE.ShapeGeometry(shape, 12);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeRainforestTrunk() {
  const group = new THREE.Group();
  group.name = "rainforest-trunk";

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.72, 8.8, 24, 12),
    barkMaterial,
  );
  trunk.position.y = 4.4;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 8.4, 0.055),
      i % 2 ? darkBarkMaterial : barkMaterial,
    );
    strip.position.set(Math.cos(angle) * 0.52, 4.35, Math.sin(angle) * 0.52);
    strip.rotation.y = -angle;
    strip.rotation.z = Math.sin(i * 1.7) * 0.04;
    strip.castShadow = true;
    strip.receiveShadow = true;
    group.add(strip);
  }

  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2 + 0.2;
    const buttress = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 1.8, 1.3),
      darkBarkMaterial,
    );
    buttress.position.set(Math.cos(angle) * 0.46, 0.88, Math.sin(angle) * 0.46);
    buttress.rotation.y = -angle;
    buttress.rotation.x = -0.18;
    buttress.castShadow = true;
    buttress.receiveShadow = true;
    group.add(buttress);
  }

  return group;
}

function makeCanopyCluster() {
  const group = new THREE.Group();
  group.name = "layered-canopy";

  for (let i = 0; i < 28; i += 1) {
    const leaf = makeLeaf(
      0.72 + (i % 4) * 0.1,
      1.65 + (i % 5) * 0.16,
      leafMaterials[i % leafMaterials.length],
    );
    const ring = i / 28;
    const angle = ring * Math.PI * 2;
    leaf.position.set(Math.cos(angle) * (1.2 + (i % 5) * 0.23), Math.sin(i) * 0.28, Math.sin(angle) * 0.72);
    leaf.rotation.set(0.35 + (i % 3) * 0.18, angle + Math.PI * 0.5, -0.45 + ring * 0.8);
    leaf.scale.setScalar(1.2 + (i % 4) * 0.2);
    group.add(leaf);
  }

  return group;
}

function makeFern() {
  const group = new THREE.Group();
  group.name = "rainforest-fern";

  for (let frond = 0; frond < 9; frond += 1) {
    const frondGroup = new THREE.Group();
    const angle = (frond / 9) * Math.PI * 2;
    frondGroup.rotation.set(0.15, angle, -0.28 + (frond % 3) * 0.14);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.025, 1.35, 8),
      vineMaterial,
    );
    stem.position.set(0, 0.48, 0.42);
    stem.rotation.x = Math.PI * 0.5;
    stem.castShadow = true;
    frondGroup.add(stem);

    for (let leafIndex = 0; leafIndex < 8; leafIndex += 1) {
      const left = makeLeaf(0.16, 0.42, leafMaterials[(frond + leafIndex) % leafMaterials.length]);
      const right = makeLeaf(0.16, 0.42, leafMaterials[(frond + leafIndex + 1) % leafMaterials.length]);
      const z = 0.16 + leafIndex * 0.13;
      const y = 0.13 + leafIndex * 0.045;

      left.position.set(-0.13, y, z);
      right.position.set(0.13, y, z);
      left.rotation.set(0.95, 0.24, 0.75);
      right.rotation.set(0.95, -0.24, -0.75);
      frondGroup.add(left, right);
    }

    group.add(frondGroup);
  }

  return group;
}

function makeVines() {
  const group = new THREE.Group();
  group.name = "hanging-vines";

  for (let i = 0; i < 7; i += 1) {
    const x = -1.7 + i * 0.55;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 3.4, 0),
      new THREE.Vector3(x + Math.sin(i) * 0.16, 2.4, 0.12),
      new THREE.Vector3(x + Math.cos(i * 1.4) * 0.24, 1.25, -0.08),
      new THREE.Vector3(x + Math.sin(i * 2.1) * 0.12, 0.3, 0.05),
    ]);
    const vine = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.025 + (i % 3) * 0.006, 8), vineMaterial);
    vine.castShadow = true;
    vine.receiveShadow = true;
    group.add(vine);
  }

  return group;
}

function makeUndergrowth() {
  const group = new THREE.Group();
  group.name = "ground-vegetation-cluster";

  for (let i = 0; i < 18; i += 1) {
    const leaf = makeLeaf(
      0.34 + (i % 4) * 0.08,
      0.9 + (i % 5) * 0.12,
      leafMaterials[i % leafMaterials.length],
    );
    const angle = (i / 18) * Math.PI * 2;
    leaf.position.set(Math.cos(angle) * (0.22 + (i % 5) * 0.07), 0.28 + (i % 3) * 0.035, Math.sin(angle) * 0.24);
    leaf.rotation.set(0.78 + (i % 3) * 0.16, angle, -0.45 + (i % 5) * 0.22);
    group.add(leaf);
  }

  return group;
}

function makeForestFloor() {
  const group = new THREE.Group();
  group.name = "rainforest-floor";

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 28, 20, 20), floorMaterial);
  floor.rotation.x = -Math.PI * 0.5;
  floor.receiveShadow = true;
  group.add(floor);

  for (let i = 0; i < 34; i += 1) {
    const leaf = makeLeaf(0.18 + (i % 3) * 0.06, 0.45 + (i % 4) * 0.07, leafMaterials[i % leafMaterials.length]);
    leaf.position.set(-9 + (i % 11) * 1.7, 0.025, -12 + Math.floor(i / 11) * 4.2 + (i % 2) * 0.8);
    leaf.rotation.set(-Math.PI * 0.5, i * 0.8, 0);
    leaf.scale.setScalar(0.75 + (i % 4) * 0.18);
    group.add(leaf);
  }

  return group;
}

async function exportGlb(name, scene) {
  const exporter = new GLTFExporter();
  const arrayBuffer = await exporter.parseAsync(scene, { binary: true });
  await writeFile(join(outputDir, `${name}.glb`), Buffer.from(arrayBuffer));
}

await mkdir(outputDir, { recursive: true });
await exportGlb("rainforest-trunk", makeRainforestTrunk());
await exportGlb("canopy-cluster", makeCanopyCluster());
await exportGlb("fern", makeFern());
await exportGlb("vines", makeVines());
await exportGlb("undergrowth", makeUndergrowth());
await exportGlb("forest-floor", makeForestFloor());
