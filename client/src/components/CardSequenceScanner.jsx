import { useEffect, useRef, useState } from "react";
import { ACTIONS, MARKER_IDS } from "../actions";

const STABLE_FRAMES = 6;
const LOST_FRAMES = 12;
const DETECT_INTERVAL = 80;
const MAX_WIDTH = 960;

// Rotation reference
const REFERENCE_ANGLE = 45;

// Number of recent readings used to smooth rotation
const ROTATION_SMOOTHING_FRAMES = 7;

// ==========================================
// SWIPE / GESTURE DETECTION
// ==========================================

// Minimum total movement before a swipe
// can be considered
const MOVEMENT_THRESHOLD = 80;

// Number of position samples used to
// smooth the card position (reduces ArUco
// jitter without making the swipe feel laggy)
const MOVEMENT_SMOOTHING_FRAMES = 4;

// How many consecutive frames the direction
// must remain consistent before triggering
const MOVEMENT_STABLE_FRAMES = 3;

// Distance from start position at which the
// gesture is considered "returned" and the
// detector re-arms
const MOVEMENT_RESET_THRESHOLD = 35;

// Popup delay
const REDIRECT_DELAY = 1500;

export default function CardRotationScanner({ onTrigger }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ==========================================
  // MODE
  // ==========================================

  const [mode, setMode] = useState("ROTATE");
  const modeRef = useRef("ROTATE");

  // ==========================================
  // CALLBACK
  // ==========================================

  const onTriggerRef = useRef(onTrigger);

  // ==========================================
  // ROTATION STATE
  // ==========================================

  const triggeredRef = useRef("");
  const rotationTriggeredRef = useRef("");

  // Recent rotation readings.
  const rotationSamplesRef = useRef([]);

  // ==========================================
  // MOVEMENT STATE
  // ==========================================

  // Smoothed card position history
  const positionSamplesRef = useRef([]);

  // Smoothed starting position (baseline)
  const startXRef = useRef(null);
  const startYRef = useRef(null);

  // Direction stability tracking
  const directionStreakRef = useRef("");
  const directionStreakCountRef = useRef(0);

  // Locked after a swipe fires, until the card
  // returns near the baseline.
  const movementLockedRef = useRef(false);

  // ==========================================
  // POPUP STATE
  // ==========================================

  const popupTimeoutRef = useRef(null);
  const popupLockedRef = useRef(false);

  const [redirectMessage, setRedirectMessage] = useState("");
  const [redirectVisible, setRedirectVisible] = useState(false);

  // ==========================================
  // UI STATE
  // ==========================================

  const [live, setLive] = useState("");
  const [active, setActive] = useState("");

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  const [angle, setAngle] = useState(null);

  const [error, setError] = useState("");

  // ==========================================
  // UPDATE CALLBACK
  // ==========================================

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  // ==========================================
  // SHOW ACTION POPUP
  // ==========================================

  const showRedirect = (message) => {
    if (!message) {
      return;
    }

    if (popupLockedRef.current) {
      return;
    }

    popupLockedRef.current = true;

    setRedirectMessage(message);
    setRedirectVisible(true);

    console.log("ACTION SENT TO DISPLAY:", message);

    popupTimeoutRef.current = setTimeout(() => {
      setRedirectVisible(false);
      popupLockedRef.current = false;
      popupTimeoutRef.current = null;
    }, REDIRECT_DELAY);
  };

  // ==========================================
  // CHANGE MODE
  // ==========================================

  const changeMode = (newMode) => {
    modeRef.current = newMode;
    setMode(newMode);

    // Cancel popup
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    popupLockedRef.current = false;

    setRedirectVisible(false);
    setRedirectMessage("");

    // Reset movement
    positionSamplesRef.current = [];
    startXRef.current = null;
    startYRef.current = null;

    directionStreakRef.current = "";
    directionStreakCountRef.current = 0;

    movementLockedRef.current = false;

    // Reset rotation
    rotationTriggeredRef.current = "";
    triggeredRef.current = "";

    rotationSamplesRef.current = [];

    // Reset UI
    setActive("");
    setLive("");
    setAngle(null);
    setDx(0);
    setDy(0);

    console.log("MODE CHANGED:", newMode);
  };

  // ==========================================
  // MAIN CAMERA / DETECTION EFFECT
  // ==========================================

  useEffect(() => {
    if (!window.AR) {
      setError("js-aruco2 not loaded. Check the <script> tags in index.html.");

      return;
    }

    const detector = new window.AR.Detector({
      dictionaryName: "ARUCO",
    });

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    let raf;
    let stream;
    let last = 0;

    // ==========================================
    // ROTATION STABILITY
    // ==========================================

    let lastState = "";
    let stable = 0;

    // ==========================================
    // MARKER LOST COUNTER
    // ==========================================

    let lost = 0;

    let cancelled = false;

    // ==========================================
    // MAIN DETECTION LOOP
    // ==========================================

    const loop = (t) => {
      raf = requestAnimationFrame(loop);

      if (
        t - last < DETECT_INTERVAL ||
        video.readyState < 2 ||
        !video.videoWidth
      ) {
        return;
      }

      last = t;

      // ==========================================
      // CAMERA SIZE
      // ==========================================

      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);

      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // ==========================================
      // DRAW CAMERA
      // ==========================================

      ctx.drawImage(video, 0, 0, w, h);

      // ==========================================
      // DETECT MARKERS
      // ==========================================

      const found = new Map();

      const markers = detector.detect(ctx.getImageData(0, 0, w, h));

      markers.forEach((marker) => {
        if (!MARKER_IDS.includes(marker.id) || found.has(marker.id)) {
          return;
        }

        const corners = marker.corners;

        const center = {
          x: (corners[0].x + corners[1].x + corners[2].x + corners[3].x) / 4,

          y: (corners[0].y + corners[1].y + corners[2].y + corners[3].y) / 4,
        };

        found.set(marker.id, {
          center,
          corners,
        });

        // ========================================
        // DRAW MARKER
        // ========================================

        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 4;

        ctx.beginPath();

        corners.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "#22c55e";

        ctx.beginPath();

        ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);

        ctx.fill();
      });

      // ==========================================
      // BOTH MARKERS REQUIRED
      // ==========================================

      if (found.size !== MARKER_IDS.length) {
        lost++;

        setLive("");

        if (lost >= LOST_FRAMES) {
          // Reset rotation
          triggeredRef.current = "";
          rotationTriggeredRef.current = "";

          rotationSamplesRef.current = [];

          // Reset movement gesture state
          positionSamplesRef.current = [];

          startXRef.current = null;
          startYRef.current = null;

          directionStreakRef.current = "";
          directionStreakCountRef.current = 0;

          movementLockedRef.current = false;

          // Reset rotation stability
          lastState = "";
          stable = 0;

          // Reset displayed rotation
          setAngle(null);
          setDx(0);
          setDy(0);
        }

        return;
      }

      lost = 0;

      // ==========================================
      // GET MARKERS
      // ==========================================

      const marker1 = found.get(MARKER_IDS[0]);
      const marker2 = found.get(MARKER_IDS[1]);

      // ==========================================
      // RAW CARD CENTER
      // ==========================================

      const rawCenterX = (marker1.center.x + marker2.center.x) / 2;

      const rawCenterY = (marker1.center.y + marker2.center.y) / 2;

      // ==========================================
      // POSITION SMOOTHING
      // ==========================================
      //
      // Light smoothing only — enough to remove
      // ArUco jitter without making swipe feel laggy.

      const posSamples = positionSamplesRef.current;

      posSamples.push({
        x: rawCenterX,
        y: rawCenterY,
      });

      if (posSamples.length > MOVEMENT_SMOOTHING_FRAMES) {
        posSamples.shift();
      }

      const centerX =
        posSamples.reduce((sum, s) => sum + s.x, 0) / posSamples.length;

      const centerY =
        posSamples.reduce((sum, s) => sum + s.y, 0) / posSamples.length;

      setX(centerX);
      setY(centerY);

      // ==========================================
      // DRAW CARD CENTER
      // ==========================================

      ctx.fillStyle = "#ef4444";

      ctx.beginPath();

      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);

      ctx.fill();

      // ==========================================
      // SAVE STARTING X/Y (SMOOTHED)
      // ==========================================

      if (startXRef.current === null) {
        startXRef.current = centerX;
      }

      if (startYRef.current === null) {
        startYRef.current = centerY;
      }

      // ==========================================
      // CALCULATE X/Y DIFFERENCE
      // ==========================================

      const xDifference = centerX - startXRef.current;

      const yDifference = centerY - startYRef.current;

      setDx(xDifference);
      setDy(yDifference);

      // ==========================================
      // ROTATION
      // ==========================================

      const rawDeg =
        (Math.atan2(
          marker2.center.y - marker1.center.y,
          marker2.center.x - marker1.center.x,
        ) *
          180) /
        Math.PI;

      // ==========================================
      // NORMALIZE ROTATION
      // ==========================================

      let rotation = rawDeg - REFERENCE_ANGLE;

      rotation = ((rotation % 360) + 360) % 360;

      // ==========================================
      // ROTATION SMOOTHING
      // ==========================================

      const samples = rotationSamplesRef.current;

      samples.push(rotation);

      if (samples.length > ROTATION_SMOOTHING_FRAMES) {
        samples.shift();
      }

      const sinSum = samples.reduce(
        (sum, value) => sum + Math.sin((value * Math.PI) / 180),
        0,
      );

      const cosSum = samples.reduce(
        (sum, value) => sum + Math.cos((value * Math.PI) / 180),
        0,
      );

      let smoothedRotation = (Math.atan2(sinSum, cosSum) * 180) / Math.PI;

      smoothedRotation = ((smoothedRotation % 360) + 360) % 360;

      setAngle(smoothedRotation);

      // ==========================================
      // ROTATION RANGE
      // ==========================================

      let rotationRange = "";

      if (smoothedRotation >= 0 && smoothedRotation < 90) {
        rotationRange = "0-90";
      } else if (smoothedRotation >= 90 && smoothedRotation < 180) {
        rotationRange = "90-180";
      } else if (smoothedRotation >= 180 && smoothedRotation < 270) {
        rotationRange = "180-270";
      } else {
        rotationRange = "270-360";
      }

      // ==========================================
      // RANGE STABILITY
      // ==========================================

      if (rotationRange === lastState) {
        stable++;
      } else {
        lastState = rotationRange;
        stable = 1;
      }

      // ==========================================
      // ROTATE MODE (UNCHANGED)
      // ==========================================

      if (modeRef.current === "ROTATE") {
        setLive(rotationRange);

        if (stable >= STABLE_FRAMES) {
          // ======================================
          // FIRST DETECTION — STORE ONLY
          // ======================================

          if (rotationTriggeredRef.current === "") {
            rotationTriggeredRef.current = rotationRange;

            console.log(
              "INITIAL ROTATION STORED:",
              rotationRange,
              `${smoothedRotation.toFixed(1)}°`,
            );

            setActive(
              rotationRange === "0-90"
                ? "0"
                : rotationRange === "90-180"
                  ? "90"
                  : rotationRange === "180-270"
                    ? "180"
                    : "270",
            );
          }

          // ======================================
          // ROTATION CHANGED
          // ======================================

          else if (rotationRange !== rotationTriggeredRef.current) {
            if (!popupLockedRef.current) {
              const previousRange = rotationTriggeredRef.current;

              rotationTriggeredRef.current = rotationRange;

              let bucket = 0;

              if (rotationRange === "0-90") {
                bucket = 0;
              } else if (rotationRange === "90-180") {
                bucket = 90;
              } else if (rotationRange === "180-270") {
                bucket = 180;
              } else if (rotationRange === "270-360") {
                bucket = 270;
              }

              const rotationAction = {
                type: "ROTATION",
                degree: Number(smoothedRotation.toFixed(2)),
                range: rotationRange,
                bucket,
                previousRange,
              };

              console.log(
                "ROTATION CHANGED:",
                previousRange,
                "→",
                rotationRange,
                `${smoothedRotation.toFixed(1)}°`,
              );

              setActive(
                rotationRange === "0-90"
                  ? "0"
                  : rotationRange === "90-180"
                    ? "90"
                    : rotationRange === "180-270"
                      ? "180"
                      : "270",
              );

              onTriggerRef.current?.(rotationAction);

              // ====================================
              // POPUP MESSAGE
              // ====================================
              //
              // 0-90 gets a distinct label so we can
              // see it firing. The display side is
              // responsible for mapping 0-90 to a
              // real website.

              if (rotationRange === "0-90") {
                showRedirect("0-90 → FIRST SITE");
              } else {
                showRedirect(`ROTATED ${Math.round(smoothedRotation)}°`);
              }
            }
          }
        }
      }

      // ==========================================
      // SWIPE MODE — DOMINANT AXIS DETECTOR
      // ==========================================

      if (modeRef.current === "SWIPE") {
        setLive("Swipe Mode");

        const absX = Math.abs(xDifference);
        const absY = Math.abs(yDifference);

        // ========================================
        // RESET / UNLOCK
        // ========================================

        if (
          absX < MOVEMENT_RESET_THRESHOLD &&
          absY < MOVEMENT_RESET_THRESHOLD
        ) {
          if (movementLockedRef.current) {
            console.log("SWIPE: returned to start, unlocked");
          }

          movementLockedRef.current = false;

          directionStreakRef.current = "";
          directionStreakCountRef.current = 0;
        }

        // ========================================
        // DETERMINE CANDIDATE DIRECTION
        // ========================================

        let candidate = "";

        if (absX > MOVEMENT_THRESHOLD || absY > MOVEMENT_THRESHOLD) {
          if (absX > absY) {
            candidate = xDifference < 0 ? "LEFT" : "RIGHT";
          } else {
            candidate = yDifference < 0 ? "UP" : "DOWN";
          }
        }

        // ========================================
        // TRACK DIRECTIONAL STABILITY
        // ========================================

        if (candidate === "") {
          directionStreakRef.current = "";
          directionStreakCountRef.current = 0;
        } else if (candidate === directionStreakRef.current) {
          directionStreakCountRef.current += 1;
        } else {
          directionStreakRef.current = candidate;
          directionStreakCountRef.current = 1;
        }

        // ========================================
        // FIRE SWIPE
        // ========================================

        if (
          !movementLockedRef.current &&
          !popupLockedRef.current &&
          candidate !== "" &&
          directionStreakCountRef.current >= MOVEMENT_STABLE_FRAMES
        ) {
          movementLockedRef.current = true;

          const action = {
            type: "MOVEMENT",
            direction: candidate,
            startX: startXRef.current,
            startY: startYRef.current,
            currentX: centerX,
            currentY: centerY,
            differenceX: xDifference,
            differenceY: yDifference,
          };

          console.log(
            "SWIPE DETECTED:",
            candidate,
            `ΔX=${xDifference.toFixed(1)}`,
            `ΔY=${yDifference.toFixed(1)}`,
          );

          onTriggerRef.current?.(action);

          showRedirect(candidate);

          directionStreakRef.current = "";
          directionStreakCountRef.current = 0;
        }
      }
    };

    // ==========================================
    // START CAMERA
    // ==========================================

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",

            width: {
              ideal: 1280,
            },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());

          return;
        }

        video.srcObject = stream;

        await video.play();

        raf = requestAnimationFrame(loop);
      } catch (e) {
        setError(
          "Camera unavailable: " +
            e.message +
            " (camera needs https or localhost)",
        );
      }
    })();

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      cancelled = true;

      cancelAnimationFrame(raf);

      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }

      rotationSamplesRef.current = [];

      positionSamplesRef.current = [];

      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const action = ACTIONS[active];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black text-white">
      {/* ========================================
          CAMERA
      ======================================== */}

      <div className="relative flex-1 min-h-0">
        <video ref={videoRef} playsInline muted className="hidden" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* ========================================
            ACTION POPUP
        ======================================== */}

        {redirectVisible && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-6 w-full max-w-sm rounded-2xl bg-white px-8 py-8 text-center text-black shadow-2xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                {mode === "ROTATE" ? "↻" : "→"}
              </div>

              <p className="text-3xl font-bold">{redirectMessage}</p>

              <p className="mt-3 text-sm text-neutral-500">
                Sending to display...
              </p>

              <div className="mx-auto mt-5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full w-full origin-left animate-[redirectProgress_1.5s_linear] rounded-full bg-black" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================
            MODE TOGGLE
        ======================================== */}

        <div className="absolute left-1/2 top-4 z-[100] -translate-x-1/2">
          <div className="flex rounded-full border border-white/20 bg-black/90 p-1 shadow-lg">
            <button
              type="button"
              onClick={() => changeMode("ROTATE")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                mode === "ROTATE"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Rotate
            </button>

            <button
              type="button"
              onClick={() => changeMode("SWIPE")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                mode === "SWIPE"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Swipe
            </button>
          </div>
        </div>

        {/* ========================================
            STATUS
        ======================================== */}

        <div className="absolute left-3 top-20 z-50 rounded bg-black/80 px-4 py-2 text-sm">
          {error ||
            (mode === "ROTATE"
              ? live
                ? `Rotation: ${live}`
                : "Place both markers in view"
              : "Swipe Mode")}
        </div>

        {/* ========================================
            ROTATION
        ======================================== */}

        <div className="absolute right-3 top-20 z-50 rounded bg-black/80 px-5 py-4">
          <p className="text-xs text-neutral-400">ROTATION</p>

          <p className="text-3xl font-bold">
            {angle !== null ? `${angle.toFixed(1)}°` : "--"}
          </p>
        </div>

        {/* ========================================
            CARD POSITION
        ======================================== */}

        <div className="absolute bottom-3 left-3 z-50 rounded bg-black/90 px-5 py-4">
          <p className="mb-2 text-xs font-semibold text-neutral-400">
            CARD POSITION
          </p>

          <div className="text-xl font-bold">
            X: <span className="text-green-400">{x.toFixed(0)}</span>
          </div>

          <div className="text-xl font-bold">
            Y: <span className="text-blue-400">{y.toFixed(0)}</span>
          </div>
        </div>

        {/* ========================================
            MOVEMENT
        ======================================== */}

        <div className="absolute bottom-3 right-3 z-50 rounded bg-black/90 px-5 py-4">
          <p className="mb-2 text-xs font-semibold text-neutral-400">
            MOVEMENT
          </p>

          <div className="text-xl font-bold">
            ΔX:{" "}
            <span className="text-green-400">
              {dx >= 0 ? "+" : ""}
              {dx.toFixed(1)}
            </span>
          </div>

          <div className="text-xl font-bold">
            ΔY:{" "}
            <span className="text-blue-400">
              {dy >= 0 ? "+" : ""}
              {dy.toFixed(1)}
            </span>
          </div>

          <p className="mt-1 text-xs text-neutral-400">
            Start X:{" "}
            {startXRef.current !== null ? startXRef.current.toFixed(0) : "--"}
          </p>

          <p className="text-xs text-neutral-400">
            Start Y:{" "}
            {startYRef.current !== null ? startYRef.current.toFixed(0) : "--"}
          </p>
        </div>
      </div>

      {/* ==========================================
          ACTION
      ========================================== */}

      <div
        className={`p-6 text-center ${action ? action.bg : "bg-neutral-800"}`}
      >
        {action ? (
          <>
            <p className="text-sm opacity-80">{action.detail}</p>

            <h2 className="mt-1 text-3xl font-semibold">{action.title}</h2>
          </>
        ) : (
          <p className="text-sm opacity-80">
            {mode === "ROTATE"
              ? "Waiting for rotation..."
              : "Waiting for swipe..."}
          </p>
        )}
      </div>

      {/* ==========================================
          PROGRESS ANIMATION
      ========================================== */}

      <style>
        {`
          @keyframes redirectProgress {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </div>
  );
}