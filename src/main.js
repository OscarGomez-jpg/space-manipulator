import { scene, camera, renderer } from "./scene.js";
import { initHandTracking, detectHands } from "./handTracking.js";
import { processFrame } from "./interaction.js";
import { model } from "./model.js";

async function start() {
  await initHandTracking();
  requestAnimationFrame(loop);
}

function loop() {
  const results = detectHands();

  if (results.landmarks?.length > 0) {
    processFrame(results.landmarks[0]);
  }

  model.updateAllPointLabels();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

start();
