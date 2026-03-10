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

Download the MediaPipe model from their documentation page or by using the following link:
<https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task>

Once downloaded, place it in the `models` folder.

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

## Structural design

- `model.js` controls the whole state of the points. How to add them, what color
they will have and their position.
- `gestures.js` controls what landmarks will be detected by the program.
- `interactions.js` is where the model gets interacted by the gestures.
- `cursor.js` controls the green dot that is used to know where the user is placing the points.
- `landmarks.js` is a config file that has the dots recognized by the model with a user
friendly name that can be recognized by the programmer.
- `corrdinates.js` translates the local positions of the model to the positions of the
mesh in THREE.js.
- `main.js` has the main loop where each frame is updated and processed.
- `scene.js` has the globla configuration of the canvas where the system runs.
- `handTracking.js` has the recognition API configuration from google's MediaPipe.
