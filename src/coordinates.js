import * as THREE from "three";

const WORLD_SCALE = 7;

export function landmarkToWorld(landmark) {
  const aspect = window.innerWidth / window.innerHeight;
  return new THREE.Vector3(
    -(landmark.x - 0.5) * aspect * WORLD_SCALE,
    -(landmark.y - 0.5) * WORLD_SCALE,
    -landmark.z * WORLD_SCALE,
  );
}
