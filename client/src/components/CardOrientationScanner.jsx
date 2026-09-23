import { useEffect, useRef, useState } from "react";
import { ACTIONS, TOP_ID, BOTTOM_ID } from "../actions";

const STABLE_FRAMES = 5;
const LOST_FRAMES = 12;
const DETECT_INTERVAL = 80;
const MAX_WIDTH = 960;

export default function CardOrientationScanner({ onTrigger }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const triggeredRef = useRef("");
  const onTriggerRef = useRef(onTrigger);

  const [live, setLive] = useState("");
  const [active, setActive] = useState("");
  const [angle, setAngle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    if (!window.AR) {
      setError(
        "js-aruco2 not loaded. Check the <script> tags in index.html.",
      );
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
    let lastState = "";
    let stable = 0;
    let lost = 0;
    let cancelled = false;

    /*
     * Calculate marker rotation.
     *
     * We use corner 0 -> corner 1 as the
     * marker's top edge.
     */
    const getMarkerAngle = (corners) => {
      const p0 = corners[0];
      const p1 = corners[1];

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;

      let degrees = Math.atan2(dy, dx) * (180 / Math.PI);

      // Convert -180..180 into 0..360
      if (degrees < 0) {
        degrees += 360;
      }

      return degrees;
    };

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

      const scale = Math.min(
        1,
        MAX_WIDTH / video.videoWidth,
      );

      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);

      if (
        canvas.width !== w ||
        canvas.height !== h
      ) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.drawImage(
        video,
        0,
        0,
        w,
        h,
      );

      let top = null;
      let bottom = null;

      const markers = detector.detect(
        ctx.getImageData(
          0,
          0,
          w,
          h,
        ),
      );

      markers.forEach((m) => {
        if (
          m.id !== TOP_ID &&
          m.id !== BOTTOM_ID
        ) {
          return;
        }

        const c = m.corners;

        const center = {
          x:
            (c[0].x +
              c[1].x +
              c[2].x +
              c[3].x) /
            4,

          y:
            (c[0].y +
              c[1].y +
              c[2].y +
              c[3].y) /
            4,
        };

        const markerAngle =
          getMarkerAngle(c);

        if (m.id === TOP_ID) {
          top = {
            center,
            corners: c,
            angle: markerAngle,
          };
        } else {
          bottom = {
            center,
            corners: c,
            angle: markerAngle,
          };
        }

        // Draw marker outline
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 4;

        ctx.beginPath();

        c.forEach((p, i) => {
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        });

        ctx.closePath();
        ctx.stroke();

        // Draw marker center
        ctx.fillStyle = "#22c55e";

        ctx.beginPath();
        ctx.arc(
          center.x,
          center.y,
          6,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Draw marker angle
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";

        ctx.fillText(
          `${markerAngle.toFixed(1)}°`,
          center.x + 10,
          center.y,
        );
      });

      /*
       * ========================================
       * CARD ROTATION
       * ========================================
       *
       * The TOP marker gives us the card angle.
       */
      if (top) {
        const currentAngle =
          top.angle;

        setAngle((previous) => {
          if (
            previous !== null &&
            Math.abs(
              currentAngle - previous,
            ) < 0.5
          ) {
            return previous;
          }

          return currentAngle;
        });

        console.log(
          "Card rotation:",
          currentAngle.toFixed(2),
          "°",
        );
      }

      /*
       * ========================================
       * EXISTING ORIENTATION DETECTION
       * ========================================
       */

      let state = "";

      if (top && bottom) {
        // Top marker's printed DOWN edge
        const c = top.corners;

        const printedDown = {
          x: c[3].x - c[0].x,
          y: c[3].y - c[0].y,
        };

        // Direction from top marker to bottom marker
        const actual = {
          x:
            bottom.center.x -
            top.center.x,

          y:
            bottom.center.y -
            top.center.y,
        };

        const dot =
          printedDown.x *
            actual.x +
          printedDown.y *
            actual.y;

        state =
          dot > 0
            ? "normal"
            : "flipped";
      }

      setLive((previous) =>
        previous === state
          ? previous
          : state,
      );

      /*
       * No valid state
       */
      if (!state) {
        stable = 0;
        lastState = "";

        lost++;

        if (
          lost >= LOST_FRAMES
        ) {
          triggeredRef.current = "";
        }

        return;
      }

      lost = 0;

      /*
       * Stability check
       */
      if (state === lastState) {
        stable++;
      } else {
        lastState = state;
        stable = 1;
      }

      /*
       * Trigger only after stable detection
       */
      if (
        stable >= STABLE_FRAMES &&
        state !==
          triggeredRef.current
      ) {
        triggeredRef.current =
          state;

        setActive(state);

        onTriggerRef.current?.(
          state,
        );
      }
    };

    /*
     * ========================================
     * CAMERA
     * ========================================
     */

    (async () => {
      try {
        stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode:
                  "environment",

                width: {
                  ideal: 1280,
                },
              },
            },
          );

        if (cancelled) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop(),
            );

          return;
        }

        video.srcObject = stream;

        await video.play();

        raf =
          requestAnimationFrame(
            loop,
          );
      } catch (e) {
        setError(
          "Camera unavailable: " +
            e.message +
            " (camera needs https or localhost)",
        );
      }
    })();

    /*
     * Cleanup
     */
    return () => {
      cancelled = true;

      cancelAnimationFrame(raf);

      stream
        ?.getTracks()
        .forEach((track) =>
          track.stop(),
        );
    };
  }, []);

  const action = ACTIONS[active];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black text-white">
      {/* Camera */}
      <div className="relative flex-1 min-h-0">
        <video
          ref={videoRef}
          playsInline
          muted
          className="hidden"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* Status */}
        <div className="absolute left-3 top-3 rounded bg-black/70 px-3 py-2 text-sm">
          {error ||
            (live
              ? `Seeing: ${
                  live === "normal"
                    ? "Top → Bottom"
                    : "Bottom → Top"
                }`
              : "Place both card markers in view")}
        </div>

        {/* Rotation */}
        <div className="absolute right-3 top-3 rounded bg-black/70 px-4 py-3 text-right">
          <p className="text-xs text-neutral-400">
            Card Rotation
          </p>

          <p className="text-2xl font-semibold">
            {angle !== null
              ? `${angle.toFixed(1)}°`
              : "--"}
          </p>
        </div>
      </div>

      {/* Bottom action panel */}
      <div
        className={`p-6 text-center transition-colors ${
          action
            ? action.bg
            : "bg-neutral-800"
        }`}
      >
        {action ? (
          <>
            <p className="text-sm opacity-80">
              {action.detail}
            </p>

            <h2 className="mt-1 text-3xl font-semibold">
              {action.title}
            </h2>
          </>
        ) : (
          <p className="text-sm opacity-80">
            Waiting for card orientation...
          </p>
        )}
      </div>
    </div>
  );
}

