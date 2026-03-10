# Space Manipulator

A hand-tracking 3D modeler that lets you create and manipulate wireframe models using your webcam and hand gestures. Built with [Three.js](https://threejs.org/) and [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker).

## Hand Gestures

| Gesture | Action |
|---|---|
| **Index + Thumb pinch** (quick) in empty space | Spawn a new point |
| **Index + Thumb pinch** (quick) on a point | Select it for connecting |
| **Index + Thumb pinch** on a second selected point | Connect the two points with a cylinder edge |
| **Index + Thumb pinch** (hold 500 ms) on a point | Grab and move the point |
| **Pinky + Thumb pinch** near a point | Delete the point and its connections |
| **Closed fist** | Rotate the entire model |

## Getting Started

```bash
npm install
npm run dev
```

Requires a webcam. The browser will prompt for camera access on first load.

## Project Structure

```
src/
├── main.js          # Entry point — init and render loop
├── scene.js         # Three.js scene, camera, renderer, lights, resize
├── coordinates.js   # Landmark-to-world coordinate conversion
├── cursor.js        # 3D cursor with position smoothing
├── model.js         # Points, cylinder edges, connections, snapping
├── handTracking.js  # MediaPipe init, camera stream, per-frame detection
├── gestures.js      # Gesture detection (pinch, pinky pinch, closed hand)
└── interaction.js   # State machine mapping gestures to model actions
models/
└── hand_landmarker.task   # MediaPipe hand landmark model
```

## Tech Stack

- **Three.js** — 3D rendering
- **MediaPipe Tasks Vision** — real-time hand landmark detection
- **Vite** — dev server and bundler
