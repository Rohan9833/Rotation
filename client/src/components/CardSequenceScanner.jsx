import { useEffect, useRef, useState } from "react";
import { ACTIONS, MARKER_IDS } from "../actions";

const STABLE_FRAMES = 5;
const LOST_FRAMES = 12;
const DETECT_INTERVAL = 80;
const MAX_WIDTH = 960;

// Rotation reference
const REFERENCE_ANGLE = 45;

// Movement threshold
const MOVEMENT_THRESHOLD = 40;

// Redirect delay
const REDIRECT_DELAY = 1500;

// ==========================================
// WEBSITES
// ==========================================

const WEBSITES = {
  UP: "https://digilateral.com",
  DOWN: "http://solaresppm.digilateral.com/",

  LEFT: "https://www.instagram.com/",
  RIGHT: "https://www.facebook.com/",

  // 0-90 intentionally has NO website

  ROTATION_90_180: "https://www.youtube.com/",
  ROTATION_180_270: "https://www.wikipedia.org/",
  ROTATION_270_360: "https://github.com/",
};

export default function CardRotationScanner({ onTrigger }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ==========================================
  // MODE
  // ==========================================

  const [mode, setMode] = useState("ROTATE");

  const modeRef = useRef("ROTATE");

  // ==========================================
  // ROTATION STATE
  // ==========================================

  const triggeredRef = useRef("");
  const onTriggerRef = useRef(onTrigger);

  // ==========================================
  // PREVIOUS CENTER
  // ==========================================

  const previousCenterRef = useRef(null);

  // ==========================================
  // STARTING POSITION
  // ==========================================

  const startXRef = useRef(null);
  const startYRef = useRef(null);

  // ==========================================
  // MOVEMENT TRIGGER STATE
  // ==========================================

  const movementTriggeredRef = useRef("");

  // ==========================================
  // ROTATION WEBSITE STATE
  // ==========================================

  const rotationTriggeredRef = useRef("");

  // ==========================================
  // REDIRECT STATE
  // ==========================================

  const redirectTimeoutRef = useRef(null);
  const redirectLockedRef = useRef(false);

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
  // OPEN WEBSITE
  // ==========================================

  const openWebsite = (url) => {
    if (!url) {
      return;
    }

    const win = window.open(url, "cardTargetTab");

    if (!win) {
      console.log("Popup blocked by browser");

      setError("Popup blocked. Allow popups for this site.");
    }
  };

  // ==========================================
  // SHOW REDIRECT POPUP
  // ==========================================

  const showRedirect = (message, url) => {
    if (!url) {
      return;
    }

    // Prevent another redirect while
    // current 1.5 second redirect is pending
    if (redirectLockedRef.current) {
      return;
    }

    redirectLockedRef.current = true;

    setRedirectMessage(message);
    setRedirectVisible(true);

    console.log("REDIRECT IN 1.5 SECONDS:", message);

    redirectTimeoutRef.current = setTimeout(() => {
      setRedirectVisible(false);

      openWebsite(url);

      // Unlock after redirect
      redirectLockedRef.current = false;
      redirectTimeoutRef.current = null;
    }, REDIRECT_DELAY);
  };

  // ==========================================
  // UPDATE CALLBACK
  // ==========================================

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  // ==========================================
  // CHANGE MODE
  // ==========================================

  const changeMode = (newMode) => {
    modeRef.current = newMode;
    setMode(newMode);

    // Cancel pending redirect
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);

      redirectTimeoutRef.current = null;
    }

    redirectLockedRef.current = false;

    setRedirectVisible(false);
    setRedirectMessage("");

    // Reset movement
    movementTriggeredRef.current = "";

    // Reset rotation
    rotationTriggeredRef.current = "";
    triggeredRef.current = "";

    // Reset starting position
    startXRef.current = null;
    startYRef.current = null;

    // Reset previous center
    previousCenterRef.current = null;

    // Reset UI
    setActive("");
    setLive("");

    console.log("MODE CHANGED:", newMode);
  };

  // ==========================================
  // MAIN EFFECT
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

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    let raf;
    let stream;

    let last = 0;

    // Rotation stability
    let lastState = "";
    let stable = 0;

    // Marker lost counter
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

          // Reset movement
          movementTriggeredRef.current = "";

          // Reset starting position
          startXRef.current = null;

          startYRef.current = null;

          previousCenterRef.current = null;

          // Reset rotation stability
          lastState = "";
          stable = 0;
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
      // CARD CENTER
      // ==========================================

      const centerX = (marker1.center.x + marker2.center.x) / 2;

      const centerY = (marker1.center.y + marker2.center.y) / 2;

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
      // SAVE STARTING X/Y
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

      let rotation = rawDeg - REFERENCE_ANGLE;

      rotation = ((rotation % 360) + 360) % 360;

      setAngle(rotation);

      // ==========================================
      // ROTATION RANGE
      // ==========================================

      let rotationRange = "";

      if (rotation >= 0 && rotation < 90) {
        rotationRange = "0-90";
      } else if (rotation >= 90 && rotation < 180) {
        rotationRange = "90-180";
      } else if (rotation >= 180 && rotation < 270) {
        rotationRange = "180-270";
      } else {
        rotationRange = "270-360";
      }

      // ==========================================
      // ROTATION STABILITY
      // ==========================================

      const state = String(Math.round(rotation / 90) * 90);

      if (state === lastState) {
        stable++;
      } else {
        lastState = state;
        stable = 1;
      }

      // ==========================================
      // ROTATE MODE
      // ==========================================

      if (modeRef.current === "ROTATE") {
        setLive(rotationRange);

        // ========================================
        // ACTIVE ROTATION ACTION
        // ========================================

        const bucket = (Math.round(rotation / 90) * 90) % 360;

        if (stable >= STABLE_FRAMES && state !== triggeredRef.current) {
          triggeredRef.current = state;

          setActive(String(bucket));

          onTriggerRef.current?.({
            type: "ROTATION",
            degree: rotation,
            bucket,
          });
        }

        // ========================================
        // FIRST ROTATION DETECTION
        // ========================================

        if (rotationTriggeredRef.current === "") {
          if (stable >= STABLE_FRAMES) {
            rotationTriggeredRef.current = rotationRange;

            console.log("INITIAL ROTATION:", rotationRange);
          }
        }

        // ========================================
        // ROTATION RANGE CHANGED
        // ========================================
        else if (
          stable >= STABLE_FRAMES &&
          rotationRange !== rotationTriggeredRef.current &&
          !redirectLockedRef.current
        ) {
          rotationTriggeredRef.current = rotationRange;

          console.log("ROTATION CHANGED:", rotationRange);

          onTriggerRef.current?.({
            type: "ROTATION",
            degree: rotation,
            range: rotationRange,
          });

          // ======================================
          // 0-90
          // ======================================

          if (rotationRange === "0-90") {
            console.log("0-90: No website");
          }

          // ======================================
          // 90-180
          // ======================================
          else if (rotationRange === "90-180") {
            showRedirect(
              `ROTATED ${Math.round(rotation)}°`,
              WEBSITES.ROTATION_90_180,
            );
          }

          // ======================================
          // 180-270
          // ======================================
          else if (rotationRange === "180-270") {
            showRedirect(
              `ROTATED ${Math.round(rotation)}°`,
              WEBSITES.ROTATION_180_270,
            );
          }

          // ======================================
          // 270-360
          // ======================================
          else if (rotationRange === "270-360") {
            showRedirect(
              `ROTATED ${Math.round(rotation)}°`,
              WEBSITES.ROTATION_270_360,
            );
          }
        }
      }

      // ==========================================
      // SWIPE MODE
      // ==========================================

      if (modeRef.current === "SWIPE") {
        setLive("Swipe Mode");

        // ========================================
        // LEFT
        // ========================================

        if (xDifference < -MOVEMENT_THRESHOLD) {
          if (movementTriggeredRef.current !== "LEFT") {
            movementTriggeredRef.current = "LEFT";

            onTriggerRef.current?.({
              type: "MOVEMENT",
              direction: "LEFT",
              startX: startXRef.current,
              currentX: centerX,
              difference: xDifference,
            });

            showRedirect("LEFT", WEBSITES.LEFT);
          }
        }

        // ========================================
        // RIGHT
        // ========================================
        else if (xDifference > MOVEMENT_THRESHOLD) {
          if (movementTriggeredRef.current !== "RIGHT") {
            movementTriggeredRef.current = "RIGHT";

            onTriggerRef.current?.({
              type: "MOVEMENT",
              direction: "RIGHT",
              startX: startXRef.current,
              currentX: centerX,
              difference: xDifference,
            });

            showRedirect("RIGHT", WEBSITES.RIGHT);
          }
        }

        // ========================================
        // UP
        // ========================================
        else if (yDifference < -MOVEMENT_THRESHOLD) {
          if (movementTriggeredRef.current !== "UP") {
            movementTriggeredRef.current = "UP";

            onTriggerRef.current?.({
              type: "MOVEMENT",
              direction: "UP",
              startY: startYRef.current,
              currentY: centerY,
              difference: yDifference,
            });

            showRedirect("UP", WEBSITES.UP);
          }
        }

        // ========================================
        // DOWN
        // ========================================
        else if (yDifference > MOVEMENT_THRESHOLD) {
          if (movementTriggeredRef.current !== "DOWN") {
            movementTriggeredRef.current = "DOWN";

            onTriggerRef.current?.({
              type: "MOVEMENT",
              direction: "DOWN",
              startY: startYRef.current,
              currentY: centerY,
              difference: yDifference,
            });

            showRedirect("DOWN", WEBSITES.DOWN);
          }
        }

        // ========================================
        // RETURN TO START
        // ========================================

        if (
          Math.abs(xDifference) < MOVEMENT_THRESHOLD / 2 &&
          Math.abs(yDifference) < MOVEMENT_THRESHOLD / 2
        ) {
          movementTriggeredRef.current = "";
        }
      }

      // ==========================================
      // SAVE CURRENT CENTER
      // ==========================================

      previousCenterRef.current = {
        x: centerX,
        y: centerY,
      };
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

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const action = ACTIONS[active];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black text-white">
      {/* CAMERA */}

      <div className="relative flex-1 min-h-0">
        <video ref={videoRef} playsInline muted className="hidden" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* ========================================
            REDIRECT POPUP
        ======================================== */}

        {redirectVisible && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-6 w-full max-w-sm rounded-2xl bg-white px-8 py-8 text-center text-black shadow-2xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                {mode === "ROTATE" ? "↻" : "→"}
              </div>

              <p className="text-3xl font-bold">{redirectMessage}</p>

              <p className="mt-3 text-sm text-neutral-500">Redirecting...</p>

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
