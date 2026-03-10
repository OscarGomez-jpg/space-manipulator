import * as THREE from "three";
import { landmarkToWorld } from "./coordinates.js";
import {
  detectPinch,
  detectPinkyPinch,
  detectClosedHand,
  getHandOrientation,
} from "./gestures.js";
import { cursor } from "./cursor.js";
import { model } from "./model.js";

const ROTATION_SENSITIVITY = 0.5;
const GRAB_HOLD_DURATION = 500; // ms to hold pinch before switching to grab/move mode

const state = {
  selectedPoint: null,
  pinching: false,
  grabbing: false,
  grabbedPoint: null,
  rotating: false,
  initialHandPos: null,
  initialPointPos: null,
  initialModelRotation: new THREE.Euler(),
  pendingGrab: null,
  grabHoldStart: null,
  pinkyPinching: false,
};

function startRotation(handPos) {
  state.rotating = true;
  state.initialHandPos = handPos.clone();
  state.initialModelRotation.copy(model.group.rotation);
  cursor.setColor(0xff0000);
}

function updateRotation(handPos) {
  const delta = new THREE.Vector3().subVectors(handPos, state.initialHandPos);
  model.group.rotation.y =
    state.initialModelRotation.y + delta.x * ROTATION_SENSITIVITY;
  model.group.rotation.x =
    state.initialModelRotation.x - delta.y * ROTATION_SENSITIVITY;
}

function endRotation() {
  state.rotating = false;
  cursor.setColor(0x00ff00);
}

function startGrab(point, handPos) {
  state.grabbing = true;
  state.grabbedPoint = point;
  state.initialHandPos = handPos.clone();
  state.initialPointPos = point.mesh.position.clone();
  model.selectPoint(point);
}

function updateGrab(handPos) {
  const delta = new THREE.Vector3().subVectors(handPos, state.initialHandPos);
  const worldPos = new THREE.Vector3().copy(state.initialPointPos).add(delta);
  const localPos = model.worldToLocal(worldPos);
  state.grabbedPoint.mesh.position.copy(localPos);
  state.grabbedPoint.connections.forEach((lineObj) =>
    model.updateLineGeometry(lineObj),
  );
}

function endGrab() {
  model.setPointColor(state.grabbedPoint, model.POINT_COLOR);
  state.grabbing = false;
  state.grabbedPoint = null;
}

function handlePinchStart(cursorPos, handPos) {
  state.pinching = true;
  const nearest = model.getNearestPoint(cursorPos);

  if (nearest && state.selectedPoint && nearest !== state.selectedPoint) {
    // Connect two points
    model.connectPoints(state.selectedPoint, nearest);
    model.setPointColor(state.selectedPoint, model.POINT_COLOR);
    state.selectedPoint = null;
    model.resetAllPointColors();
  } else if (nearest && !state.selectedPoint) {
    // Start timing — short press selects, long press grabs
    state.pendingGrab = nearest;
    state.grabHoldStart = performance.now();
    model.highlightPoint(nearest);
  } else if (!nearest) {
    if (state.selectedPoint) {
      model.setPointColor(state.selectedPoint, model.POINT_COLOR);
      state.selectedPoint = null;
    }
    const localPos = model.worldToLocal(cursorPos);
    model.addPoint(localPos);
  }
}

function handleRelease() {
  if (state.grabbing) {
    endGrab();
  } else if (state.pendingGrab) {
    // Short press — select the point for connecting
    state.selectedPoint = state.pendingGrab;
    model.selectPoint(state.selectedPoint);
    state.pendingGrab = null;
    state.grabHoldStart = null;
  }
  state.pinching = false;
}

function updateHighlights(cursorPos) {
  if (
    state.grabbing ||
    state.selectedPoint ||
    state.rotating ||
    state.pendingGrab
  )
    return;
  model.resetAllPointColors();
  const nearest = model.getNearestPoint(cursorPos);
  if (nearest) model.highlightPoint(nearest);
}

export function processFrame(landmarks) {
  const indexWorld = landmarkToWorld(landmarks[8]);
  cursor.update(indexWorld);

  const cursorPos = cursor.position.clone();
  const isPinching = detectPinch(landmarks);
  const isPinkyPinching = detectPinkyPinch(landmarks);
  const isClosed = detectClosedHand(landmarks);
  const handPos = landmarkToWorld(landmarks[0]);

  // Delete gesture: pinky-thumb pinch near a point
  if (isPinkyPinching && !state.pinkyPinching) {
    state.pinkyPinching = true;
    const nearest = model.getNearestPoint(cursorPos);
    if (nearest) {
      if (state.selectedPoint === nearest) state.selectedPoint = null;
      if (state.grabbedPoint === nearest) {
        state.grabbing = false;
        state.grabbedPoint = null;
      }
      if (state.pendingGrab === nearest) {
        state.pendingGrab = null;
        state.grabHoldStart = null;
      }
      model.removePoint(nearest);
    }
  } else if (!isPinkyPinching) {
    state.pinkyPinching = false;
  }

  // Priority: Rotation (closed fist) > Grab > Select/Connect
  if (isClosed && !state.rotating && model.points.length > 0) {
    startRotation(handPos);
  } else if (state.rotating && isClosed) {
    updateRotation(handPos);
  } else if (state.rotating && !isClosed) {
    endRotation();
  } else if (state.grabbing && state.grabbedPoint && isPinching) {
    updateGrab(handPos);
  } else if (isPinching && !state.pinching && !state.rotating) {
    handlePinchStart(cursorPos, handPos);
  } else if (!isPinching && !isClosed) {
    handleRelease();
  }

  // Promote pending grab to actual grab after hold duration elapses
  if (state.pendingGrab && isPinching) {
    if (performance.now() - state.grabHoldStart >= GRAB_HOLD_DURATION) {
      startGrab(state.pendingGrab, handPos);
      state.pendingGrab = null;
      state.grabHoldStart = null;
    }
  }

  updateHighlights(cursorPos);
}
