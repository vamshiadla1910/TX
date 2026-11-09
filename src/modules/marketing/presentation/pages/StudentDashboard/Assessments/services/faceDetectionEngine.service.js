/**
 * Real-Time Canvas Computer Vision Proctoring Engine
 * Analyzes webcam frames to detect:
 * 1. Single candidate in front of camera (with beards, glasses, any skin tone)
 * 2. Instant detection when any SECOND PERSON enters the frame (left, right, or behind)
 * 3. Immediate auto-pause when a second person is present, auto-resume when they leave
 * 4. Filters out background walls (off-white, cream, blue partitions), torso, and hands
 */

export function analyzeVideoFrameForFaces(videoEl, canvasEl) {
  if (!videoEl || !canvasEl || videoEl.readyState < 2 || videoEl.videoWidth === 0) {
    return null;
  }

  const W = 160;
  const H = 120;
  if (canvasEl.width !== W) canvasEl.width = W;
  if (canvasEl.height !== H) canvasEl.height = H;

  const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Draw current video frame onto analysis canvas
  ctx.drawImage(videoEl, 0, 0, W, H);
  const frameData = ctx.getImageData(0, 0, W, H).data;

  const numPixels = W * H;
  let totalY = 0;
  let sumSqY = 0;
  const lumaMap = new Float32Array(numPixels);
  const skinMask = new Uint8Array(numPixels);
  const facialMask = new Uint8Array(numPixels);

  // Pass 1: Pixel classification with Background Wall & Partition Rejection
  for (let i = 0, p = 0; i < frameData.length; i += 4, p++) {
    const r = frameData[i];
    const g = frameData[i + 1];
    const b = frameData[i + 2];

    // YCbCr color conversion
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * r - 0.081312 * b;

    lumaMap[p] = y;
    totalY += y;
    sumSqY += y * y;

    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    // Filter out common indoor backgrounds:
    // 1) Bright neutral off-white/cream/beige walls (high luminance + very low saturation)
    // 2) Blue/cyan office partitions or curtains (blue dominant over red and green)
    const isBackground =
      (y > 175 && sat <= 15) ||
      (b > r + 16 && b > g + 4);

    if (!isBackground) {
      // Human facial skin (broad spectrum of complexions, indoors / monitor lit)
      const isSkin =
        y >= 26 &&
        y <= 186 &&
        cb >= 80 &&
        cb <= 142 &&
        cr >= 124 &&
        cr <= 186 &&
        cr >= cb - 6 &&
        r >= g - 10 &&
        sat >= 5;

      // Facial features (dark beard, mustache, eyebrows, glasses frames, pupils)
      const isFacialFeature =
        y >= 10 &&
        y <= 112 &&
        r < 105 &&
        g < 95 &&
        b < 95 &&
        sat < 32;

      if (isSkin) skinMask[p] = 1;
      if (isFacialFeature) facialMask[p] = 1;
    }
  }

  const meanY = totalY / numPixels;
  const varianceY = Math.max(0, sumSqY / numPixels - meanY * meanY);
  const stdY = Math.sqrt(varianceY);

  // Camera lens covered, dark room, or pitch black
  if (meanY < 18 || stdY < 6) {
    return { count: 0, boxes: [], confidence: 0, reason: "Camera covered or too dark" };
  }

  // Pass 2: Spatial Partitioning (20 x 15 grid of 8x8 pixel cells)
  const GRID_W = 20;
  const GRID_H = 15;
  const CELL = 8;
  const cellFace = new Uint8Array(GRID_W * GRID_H);

  for (let gy = 0; gy < GRID_H; gy++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      let skinCount = 0;
      let facialCount = 0;
      let edgeSum = 0;

      for (let py = gy * CELL; py < (gy + 1) * CELL; py++) {
        for (let px = gx * CELL; px < (gx + 1) * CELL; px++) {
          const idx = py * W + px;
          if (skinMask[idx]) skinCount++;
          if (facialMask[idx]) facialCount++;

          if (px < W - 1 && py < H - 1) {
            const dx = Math.abs(lumaMap[idx] - lumaMap[idx + 1]);
            const dy = Math.abs(lumaMap[idx] - lumaMap[idx + W]);
            edgeSum += dx + dy;
          }
        }
      }

      const cellIdx = gy * GRID_W + gx;
      const avgEdge = edgeSum / (CELL * CELL);

      // Candidate head detection in rows 1 through 11 (head zone)
      if (gy >= 1 && gy <= 11) {
        if (
          skinCount >= 6 ||
          (facialCount >= 8 && avgEdge > 1.8) ||
          (skinCount >= 3 && avgEdge > 2.2)
        ) {
          cellFace[cellIdx] = 1;
        }
      }
    }
  }

  // Pass 3: 8-Connectivity BFS Connected-Component Blob Analysis
  const visited = new Uint8Array(GRID_W * GRID_H);
  const blobs = [];

  for (let gy = 1; gy <= 11; gy++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      const idx = gy * GRID_W + gx;
      if (!cellFace[idx] || visited[idx]) continue;

      let minGx = gx;
      let maxGx = gx;
      let minGy = gy;
      let maxGy = gy;
      let cellCount = 0;

      const queue = [idx];
      visited[idx] = 1;

      while (queue.length > 0) {
        const curr = queue.shift();
        const cy = Math.floor(curr / GRID_W);
        const cx = curr % GRID_W;
        cellCount++;

        if (cx < minGx) minGx = cx;
        if (cx > maxGx) maxGx = cx;
        if (cy < minGy) minGy = cy;
        if (cy > maxGy) maxGy = cy;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = cy + dy;
            const nx = cx + dx;
            if (nx >= 0 && nx < GRID_W && ny >= 1 && ny <= 11) {
              const nidx = ny * GRID_W + nx;
              if (cellFace[nidx] && !visited[nidx]) {
                visited[nidx] = 1;
                queue.push(nidx);
              }
            }
          }
        }
      }

      const blobW = maxGx - minGx + 1;
      const blobH = maxGy - minGy + 1;
      const aspectRatio = blobH / Math.max(1, blobW);

      if (cellCount >= 5 && aspectRatio >= 0.55 && aspectRatio <= 3.2) {
        blobs.push({
          x: minGx / GRID_W,
          y: minGy / GRID_H,
          width: blobW / GRID_W,
          height: blobH / GRID_H,
          centerX: (minGx + maxGx) / 2 / GRID_W,
          centerY: (minGy + maxGy) / 2 / GRID_H,
          cellCount,
          minGy,
          maxGy
        });
      }
    }
  }

  // If no face clusters detected in head zone
  if (blobs.length === 0) {
    return { count: 0, boxes: [], confidence: 0 };
  }

  // Sort candidate head blobs by size (largest first)
  blobs.sort((a, b) => b.cellCount - a.cellCount);

  // Identify Primary Candidate (must be located in central camera area)
  const primaryFace =
    blobs.find((b) => b.centerX >= 0.15 && b.centerX <= 0.85 && b.centerY <= 0.70) ||
    blobs[0];

  const detectedFaces = [primaryFace];

  // Detect Distinct Second Person
  blobs.forEach((candidate) => {
    if (candidate === primaryFace) return;

    // Disregard candidate's own neck or collar directly beneath the chin
    const isDirectlyBelow =
      candidate.centerY > primaryFace.centerY + primaryFace.height * 0.4 &&
      Math.abs(candidate.centerX - primaryFace.centerX) < 0.12;
    if (isDirectlyBelow) return;

    const horizontalDistance = Math.abs(candidate.centerX - primaryFace.centerX);
    const isHorizontallySeparated = horizontalDistance >= 0.15;
    const isBehindCandidate =
      horizontalDistance >= 0.11 && candidate.centerY < primaryFace.centerY;

    if ((isHorizontallySeparated || isBehindCandidate) && candidate.cellCount >= 5) {
      detectedFaces.push(candidate);
    }
  });

  const count = detectedFaces.length;
  let confidence = 96;
  if (count === 1) {
    confidence = Math.min(99, Math.max(95, Math.round(92 + detectedFaces[0].cellCount * 0.3)));
  } else if (count > 1) {
    confidence = 96;
  }

  return {
    count,
    boxes: detectedFaces,
    confidence
  };
}
