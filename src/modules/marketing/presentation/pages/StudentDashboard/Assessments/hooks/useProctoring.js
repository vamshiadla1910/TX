import { useState, useRef, useEffect, useCallback } from "react";
import { analyzeVideoFrameForFaces } from "../services/faceDetectionEngine.service";

/**
 * useProctoring Hook
 * Manages webcam lifecycle, proctoring face detection,
 * microphone audio monitoring, bounding box overlay, and anti-cheat tab-switching.
 */
export function useProctoring(isExamActive) {
  // Proctoring States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Face Detection Status: 'single' | 'none' | 'multiple'
  const [faceDetectionState, setFaceDetectionState] = useState("single");
  const [faceConfidence, setFaceConfidence] = useState(98);
  const [simulatedMode, setSimulatedMode] = useState("live");
  const [warningMessage, setWarningMessage] = useState("");
  const [tabSwitches, setTabSwitches] = useState(0);

  // Hardware / Canvas Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);
  const historyRef = useRef(["single", "single", "single"]);

  // Force single candidate reset callback (allows instant recovery if false-positive occurs)
  const forceSingleCandidateResume = useCallback(() => {
    historyRef.current = ["single", "single", "single", "single", "single"];
    setFaceDetectionState("single");
    setFaceConfidence(98);
    setWarningMessage("");
  }, []);

  // Stop Webcam & Microphone completely (turns off hardware camera LED)
  const stopCameraAndMic = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
    }
    setCameraActive(false);
    setCameraStarting(false);
    setMicActive(false);
    setAudioLevel(0);
  }, []);

  // Helper to attach stream to <video> element reliably
  const attachStreamToVideo = useCallback(async (stream) => {
    if (!videoRef.current || !stream) return;
    if (videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
    try {
      await videoRef.current.play();
    } catch (playErr) {
      console.warn("Video play warning:", playErr);
    }
  }, []);

  // Setup Webcam & Audio Monitoring
  const startCameraAndMic = useCallback(async () => {
    setCameraStarting(true);
    setCameraError("");

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam API not available in this browser.");
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      let stream = null;
      let hasAudio = true;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: true
        });
      } catch {
        hasAudio = false;
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false
        });
      }

      streamRef.current = stream;
      setMicActive(hasAudio);
      setCameraActive(true);
      setCameraStarting(false);
      setCameraError("");

      await attachStreamToVideo(stream);

      // Setup Audio Analyser if audio track exists
      if (hasAudio && stream.getAudioTracks().length > 0) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateAudioMeter = () => {
              if (!streamRef.current) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.max(15, avg * 1.5)));
              animFrameRef.current = requestAnimationFrame(updateAudioMeter);
            };
            updateAudioMeter();
          }
        } catch (audioErr) {
          console.warn("Audio meter init issue:", audioErr);
        }
      }
    } catch (err) {
      console.warn("Media stream init error:", err);
      setCameraActive(false);
      setCameraStarting(false);
      setCameraError(err.message || "Camera access denied. Click Retry to allow webcam.");
    }
  }, [attachStreamToVideo]);

  // Start camera when isExamActive is true, stop when leaving
  useEffect(() => {
    if (isExamActive) {
      startCameraAndMic();
    } else {
      stopCameraAndMic();
    }

    return () => {
      stopCameraAndMic();
    };
  }, [isExamActive, startCameraAndMic, stopCameraAndMic]);

  // Re-attach video stream if needed
  useEffect(() => {
    if (isExamActive && cameraActive && streamRef.current && videoRef.current) {
      attachStreamToVideo(streamRef.current);
    }
  }, [cameraActive, isExamActive, attachStreamToVideo]);

  // Anti-cheat: Tab switch / Window blur detection
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const next = prev + 1;
          setWarningMessage(`⚠️ Tab switch detected! Proctored incident #${next}. Please remain focused on exam.`);
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isExamActive]);

  // Draw tracking brackets on overlay canvas
  const drawFaceOverlay = useCallback((boxes, status) => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const W = overlay.width || 300;
    const H = overlay.height || 200;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    if (!boxes || boxes.length === 0) return;

    const strokeColor = status === "single" ? "#22c55e" : "#ef4444";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;

    boxes.forEach((box) => {
      const mirroredX = 1 - (box.x + box.width);
      const rx = Math.max(12, mirroredX * W);
      const ry = Math.max(12, box.y * H);
      const rw = Math.min(W - rx - 12, box.width * W);
      const rh = Math.min(H - ry - 12, box.height * H);
      const corner = 14;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(rx, ry + corner);
      ctx.lineTo(rx, ry);
      ctx.lineTo(rx + corner, ry);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(rx + rw - corner, ry);
      ctx.lineTo(rx + rw, ry);
      ctx.lineTo(rx + rw, ry + corner);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(rx, ry + rh - corner);
      ctx.lineTo(rx, ry + rh);
      ctx.lineTo(rx + corner, ry + rh);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(rx + rw - corner, ry + rh);
      ctx.lineTo(rx + rw, ry + rh);
      ctx.lineTo(rx + rw, ry + rh - corner);
      ctx.stroke();
    });
  }, []);

  // Real-time Face Detection Loop
  useEffect(() => {
    if (!isExamActive) return;

    let nativeDetector = null;
    let nativeSupported = false;

    if (typeof window !== "undefined" && "FaceDetector" in window) {
      try {
        nativeDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 4 });
        nativeSupported = true;
      } catch {
        nativeSupported = false;
      }
    }

    const detectionInterval = setInterval(async () => {
      if (!isExamActive) return;

      // Manual test simulation mode
      if (simulatedMode !== "live") {
        setFaceDetectionState(simulatedMode);
        if (simulatedMode === "none") {
          setFaceConfidence(0);
          drawFaceOverlay([], "none");
          setWarningMessage("⚠️ Proctored Alert: No face detected in frame! Please look at the camera.");
        } else if (simulatedMode === "multiple") {
          setFaceConfidence(94);
          drawFaceOverlay(
            [
              { x: 0.12, y: 0.2, width: 0.3, height: 0.55 },
              { x: 0.56, y: 0.22, width: 0.3, height: 0.55 }
            ],
            "multiple"
          );
          setWarningMessage("⚠️ Proctored Alert: Multiple faces detected! Only the registered student is permitted.");
        } else {
          setFaceConfidence(98);
          drawFaceOverlay([{ x: 0.32, y: 0.18, width: 0.36, height: 0.62 }], "single");
          setWarningMessage("");
        }
        return;
      }

      // Live camera detection using dedicated Computer Vision proctoring engine
      if (!cameraActive || !videoRef.current || videoRef.current.readyState < 2) {
        return;
      }

      let detectedCount = null;
      let detectedBoxes = [];
      let confidence = 96;

      // 1. Run our dedicated Canvas CV engine (handles wall rejection, glasses, beards, and 2nd person)
      if (canvasRef.current) {
        const cvResult = analyzeVideoFrameForFaces(videoRef.current, canvasRef.current);
        if (cvResult) {
          detectedCount = cvResult.count;
          detectedBoxes = cvResult.boxes || [];
          confidence = cvResult.confidence || 96;
        }
      }

      // 2. If browser native detector detects multiple faces, take note as well
      if (nativeSupported && nativeDetector) {
        try {
          const nativeFaces = await nativeDetector.detect(videoRef.current);
          if (nativeFaces && nativeFaces.length >= 2) {
            detectedCount = Math.max(detectedCount || 0, nativeFaces.length);
          } else if (nativeFaces && nativeFaces.length === 1 && (detectedCount === null || detectedCount === 0)) {
            detectedCount = 1;
          }
        } catch {
          nativeSupported = false;
        }
      }

      if (detectedCount === null) return;

      const stateSample = detectedCount === 0 ? "none" : detectedCount >= 2 ? "multiple" : "single";
      historyRef.current = [...historyRef.current.slice(-2), stateSample];

      let multipleCount = 0;
      let noneCount = 0;
      historyRef.current.forEach((s) => {
        if (s === "multiple") multipleCount++;
        else if (s === "none") noneCount++;
      });

      // Quick trigger: If 2 or more of the last 3 samples detect multiple faces, IMMEDIATELY pause and throw warning!
      // Quick resume: As soon as stateSample is single or none, transition back to single so student isn't blocked!
      let smoothedState = "single";
      if (multipleCount >= 2) {
        smoothedState = "multiple";
      } else if (noneCount >= 3) {
        smoothedState = "none";
      } else {
        smoothedState = "single";
      }

      setFaceDetectionState(smoothedState);
      setFaceConfidence(smoothedState === "none" ? 0 : confidence);
      drawFaceOverlay(detectedBoxes, smoothedState);

      if (smoothedState === "none") {
        setWarningMessage("⚠️ Proctored Alert: No face detected in camera frame! Please stay in front of the webcam.");
      } else if (smoothedState === "multiple") {
        setWarningMessage("⚠️ Proctored Alert: Multiple faces detected in frame! Only one candidate is allowed.");
      } else {
        setWarningMessage("");
      }
    }, 300);

    return () => clearInterval(detectionInterval);
  }, [simulatedMode, cameraActive, drawFaceOverlay, isExamActive]);

  return {
    cameraActive,
    cameraStarting,
    cameraError,
    micActive,
    audioLevel,
    faceDetectionState,
    faceConfidence,
    simulatedMode,
    setSimulatedMode,
    warningMessage,
    setWarningMessage,
    tabSwitches,
    videoRef,
    canvasRef,
    overlayCanvasRef,
    startCameraAndMic,
    stopCameraAndMic,
    forceSingleCandidateResume
  };
}
