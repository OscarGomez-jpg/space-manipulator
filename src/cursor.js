import * as THREE from "three";
import { scene } from "./scene.js";

const SMOOTHING_FACTOR = 0.2;

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.2),
  new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  }),
);
scene.add(mesh);

const smoothPos = new THREE.Vector3();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export const cursor = {
  get position() {
    return mesh.position;
  },

  update(targetPos) {
    smoothPos.x = lerp(smoothPos.x, targetPos.x, SMOOTHING_FACTOR);
    smoothPos.y = lerp(smoothPos.y, targetPos.y, SMOOTHING_FACTOR);
    smoothPos.z = lerp(smoothPos.z, targetPos.z, SMOOTHING_FACTOR);
    mesh.position.copy(smoothPos);
  },

  setColor(hex) {
    mesh.material.color.set(hex);
  },
};
