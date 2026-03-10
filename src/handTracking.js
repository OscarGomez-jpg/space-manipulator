import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const VISION_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_PATH = "models/hand_landmarker.task";

let handLandmarker;
const video = document.getElementById("webcam");

export async function initHandTracking() {
  const vision = await FilesetResolver.forVisionTasks(VISION_WASM_URL);
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate: "GPU" },
    runningMode: "VIDEO",
    numHands: 2,
  });

  await startCamera();
}

function startCamera() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", resolve);
      })
      .catch(reject);
  });
}

export function detectHands() {
  return handLandmarker.detectForVideo(video, performance.now());
}
