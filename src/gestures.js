import * as THREE from "three";
import { landmarkToWorld } from "./coordinates.js";

const PINCH_THRESHOLD = 0.05;
const CLOSED_HAND_THRESHOLD = 1.5; // World-space distance for fingertip-to-palm
const FINGERTIP_INDICES = [4, 8, 12, 16, 20];

export function detectPinch(landmarks) {
  const indexTip = landmarks[8];
  const thumbTip = landmarks[4];
  const distance = Math.hypot(
    indexTip.x - thumbTip.x,
    indexTip.y - thumbTip.y,
    indexTip.z - thumbTip.z,
  );
  return distance < PINCH_THRESHOLD;
}

export function detectPinkyPinch(landmarks) {
  const pinkyTip = landmarks[20];
  const thumbTip = landmarks[4];
  const distance = Math.hypot(
    pinkyTip.x - thumbTip.x,
    pinkyTip.y - thumbTip.y,
    pinkyTip.z - thumbTip.z,
  );
  return distance < PINCH_THRESHOLD;
}

export function detectClosedHand(landmarks) {
  const palm = landmarkToWorld(landmarks[0]);
  return FINGERTIP_INDICES.every((tipIdx) => {
    const tip = landmarkToWorld(landmarks[tipIdx]);
    return palm.distanceTo(tip) <= CLOSED_HAND_THRESHOLD;
  });
}

export function getHandOrientation(landmarks) {
  const wrist = new THREE.Vector3(
    landmarks[0].x,
    landmarks[0].y,
    landmarks[0].z,
  );
  const indexBase = new THREE.Vector3(
    landmarks[5].x,
    landmarks[5].y,
    landmarks[5].z,
  );
  const pinkyBase = new THREE.Vector3(
    landmarks[17].x,
    landmarks[17].y,
    landmarks[17].z,
  );

  const v1 = new THREE.Vector3().subVectors(indexBase, wrist);
  const v2 = new THREE.Vector3().subVectors(pinkyBase, wrist);
  const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

  return { normal, center: wrist };
}
