// components/ThreeDBox.jsx
import React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Helper: Create edges for a box (excluding the top)
const OpenTopBoxEdges = () => {
  const thickness = 0.02; // thin edge lines
  const edges = [];

  const w = 3;
  const h = 2;
  const d = 1.5;

  const points = {
    ftl: [-w / 2, h / 2, d / 2], // front top left
    fbl: [-w / 2, -h / 2, d / 2],
    ftr: [w / 2, h / 2, d / 2],
    fbr: [w / 2, -h / 2, d / 2],

    btl: [-w / 2, h / 2, -d / 2],
    bbl: [-w / 2, -h / 2, -d / 2],
    btr: [w / 2, h / 2, -d / 2],
    bbr: [w / 2, -h / 2, -d / 2],
  };

const lines = [
  // Bottom square
  [points.fbl, points.fbr],
  [points.fbr, points.bbr],
  [points.bbr, points.bbl],
  [points.bbl, points.fbl],

  // Vertical edges
  [points.fbl, points.ftl],
  [points.fbr, points.ftr],
  [points.bbl, points.btl],
  [points.bbr, points.btr],

  // Top frame (4 sides now)
  [points.ftl, points.ftr],
  [points.ftr, points.btr],
  [points.btr, points.btl],
  [points.btl, points.ftl],

  // Optional: bottom diagonals for structure look
  [points.fbl, points.bbr],
  [points.fbr, points.bbl],
];


  return (
    <>
      {lines.map(([start, end], i) => {
        const pos = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ];
        const length = Math.sqrt(
          (end[0] - start[0]) ** 2 +
            (end[1] - start[1]) ** 2 +
            (end[2] - start[2]) ** 2
        );
        const dir = [
          (end[0] - start[0]) / length,
          (end[1] - start[1]) / length,
          (end[2] - start[2]) / length,
        ];

       const quaternion = new THREE.Quaternion();
const from = new THREE.Vector3(0, 1, 0); // Y-axis
const to = new THREE.Vector3(...dir); // Your direction vector
quaternion.setFromUnitVectors(from, to);


        return (
         <mesh key={i} position={pos} quaternion={quaternion}>
  <cylinderGeometry args={[thickness, thickness, length, 6]} />
  <meshBasicMaterial color="white" />
</mesh>

        );
      })}
    </>
  );
};

const ThreeDBox = () => {
  return (
    <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />
      <OpenTopBoxEdges />
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  );
};

export default ThreeDBox;


