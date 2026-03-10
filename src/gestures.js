import * as THREE from "three";
import { landmarkToWorld } from "./coordinates.js";
import { LM, FINGERTIP_INDICES } from "./landmarks.js";

const PINCH_THRESHOLD = 0.05;
const CLOSED_HAND_THRESHOLD = 1.25; // World-space distance for fingertip-to-palm

/*
 * This function detects a pinch gesture by measuring the distance between the index fingertip and thumb tip.
 */
export function detectPinch(landmarks) {
  const indexTip = landmarks[LM.INDEX_TIP];
  const thumbTip = landmarks[LM.THUMB_TIP];
  const distance = Math.hypot(
    indexTip.x - thumbTip.x,
    indexTip.y - thumbTip.y,
    indexTip.z - thumbTip.z,
  );
  return distance < PINCH_THRESHOLD;
}

/*
 * Detects a middle-finger + thumb pinch, used as the delete gesture.
 * Keeping the index finger extended prevents this from conflicting with
 * the closed-fist rotation gesture.
 */
export function detectMiddlePinch(landmarks) {
  const middleTip = landmarks[LM.MIDDLE_TIP];
  const thumbTip = landmarks[LM.THUMB_TIP];
  const distance = Math.hypot(
    middleTip.x - thumbTip.x,
    middleTip.y - thumbTip.y,
    middleTip.z - thumbTip.z,
  );
  return distance < PINCH_THRESHOLD;
}

export function detectClosedHand(landmarks) {
  const palm = landmarkToWorld(landmarks[LM.WRIST]);
  return FINGERTIP_INDICES.every((tipIdx) => {
    const tip = landmarkToWorld(landmarks[tipIdx]);
    return palm.distanceTo(tip) <= CLOSED_HAND_THRESHOLD;
  });
}

export function getHandOrientation(landmarks) {
  const wrist = new THREE.Vector3(
    landmarks[LM.WRIST].x,
    landmarks[LM.WRIST].y,
    landmarks[LM.WRIST].z,
  );
  const indexBase = new THREE.Vector3(
    landmarks[LM.INDEX_MCP].x,
    landmarks[LM.INDEX_MCP].y,
    landmarks[LM.INDEX_MCP].z,
  );
  const pinkyBase = new THREE.Vector3(
    landmarks[LM.PINKY_MCP].x,
    landmarks[LM.PINKY_MCP].y,
    landmarks[LM.PINKY_MCP].z,
  );

  const v1 = new THREE.Vector3().subVectors(indexBase, wrist);
  const v2 = new THREE.Vector3().subVectors(pinkyBase, wrist);
  const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

  return { normal, center: wrist };
}
