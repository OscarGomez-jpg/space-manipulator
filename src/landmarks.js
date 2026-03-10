/**
 * MediaPipe Hand Landmark indices.
 *
 * Reference diagram:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
 *
 *                  8   12  16  20
 *                  |   |   |   |
 *                  7   11  15  19
 *              4   |   |   |   |
 *              |   6   10  14  18
 *              3   |   |   |   |
 *              |   5---9--13--17
 *              2       |
 *               \      |
 *                1     |
 *                 \    |
 *                  0---+  (wrist)
 */

export const LM = {
  // Wrist
  WRIST: 0,

  // Thumb
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,

  // Index finger
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,

  // Middle finger
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,

  // Ring finger
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,

  // Pinky finger
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

// All five fingertip indices, useful for closed-hand detection
export const FINGERTIP_INDICES = [
  LM.THUMB_TIP,
  LM.INDEX_TIP,
  LM.MIDDLE_TIP,
  LM.RING_TIP,
  LM.PINKY_TIP,
];
