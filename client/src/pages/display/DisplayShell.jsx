import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";

const WEBSITES = {
  UP: "https://digilateral.com",
  DOWN: "http://solaresppm.digilateral.com/",
  LEFT: "https://www.instagram.com/",
  RIGHT: "https://www.facebook.com/",

  ROTATION_90_180: "https://www.youtube.com/",
  ROTATION_180_270: "https://www.wikipedia.org/",
  ROTATION_270_360: "https://github.com/",
};

const REDIRECT_DELAY = 1500;

export default function DisplayShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const redirectTimeoutRef = useRef(null);

  // ==========================================
  // ON BROWSER REFRESH
  // ==========================================

  useEffect(() => {
    const navigationEntry =
      performance.getEntriesByType("navigation")[0];

    if (
      navigationEntry?.type === "reload" &&
      location.pathname !== "/display"
    ) {
      navigate("/display", { replace: true });
    }
  }, []);

  // ==========================================
  // SEQUENCE
  // ==========================================

  const go = (seq) => {
    // Ignore scanner events when user
    // is already on a slide.
    if (location.pathname !== "/display") {
      return;
    }

    if (!seq) return;

    navigate(`/display/${seq}`, {
      replace: true,
      state: {
        scanId: Date.now(),
      },
    });
  };

  // ==========================================
  // CARD ACTION
  // ==========================================

  const handleCardAction = (action) => {
    if (!action) {
      return;
    }

    console.log("DISPLAY RECEIVED CARD ACTION:", action);

    let url = "";
    let message = "";

    // ========================================
    // MOVEMENT
    // ========================================

    if (action.type === "MOVEMENT") {
      const direction = action.direction;

      if (direction === "LEFT") {
        url = WEBSITES.LEFT;
        message = "LEFT";
      } else if (direction === "RIGHT") {
        url = WEBSITES.RIGHT;
        message = "RIGHT";
      } else if (direction === "UP") {
        url = WEBSITES.UP;
        message = "UP";
      } else if (direction === "DOWN") {
        url = WEBSITES.DOWN;
        message = "DOWN";
      }
    }

    // ========================================
    // ROTATION
    // ========================================

    if (action.type === "ROTATION") {
      const range = action.range;

      if (range === "0-90") {
        console.log(
          "DISPLAY: 0-90 rotation - no website"
        );

        return;
      }

      if (range === "90-180") {
        url = WEBSITES.ROTATION_90_180;
      } else if (range === "180-270") {
        url = WEBSITES.ROTATION_180_270;
      } else if (range === "270-360") {
        url = WEBSITES.ROTATION_270_360;
      }

      if (action.degree !== undefined) {
        message = `ROTATED ${Math.round(
          action.degree
        )}°`;
      } else {
        message = `ROTATED ${range}`;
      }
    }

    // ========================================
    // INVALID ACTION
    // ========================================

    if (!url) {
      console.log(
        "DISPLAY: No URL for action",
        action
      );

      return;
    }

    // ========================================
    // PREVENT DUPLICATE REDIRECTS
    // ========================================

    if (redirectTimeoutRef.current) {
      return;
    }

    console.log(
      `DISPLAY REDIRECT IN ${REDIRECT_DELAY}ms:`,
      message,
      url
    );

    // ========================================
    // REDIRECT
    // ========================================

    redirectTimeoutRef.current = setTimeout(() => {
      window.location.href = url;

      redirectTimeoutRef.current = null;
    }, REDIRECT_DELAY);
  };

  // ==========================================
  // SOCKET
  // ==========================================

  const { connected, presence } = useSocket(
    "display",
    {
      onSequence: go,
      onCardAction: handleCardAction,
    }
  );

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(
          redirectTimeoutRef.current
        );

        redirectTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-neutral-950">
      <Outlet />

      <div className="fixed bottom-2 right-2 z-50 flex items-center gap-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white/60">
        <span
          className={
            connected
              ? "text-emerald-400"
              : "text-amber-400"
          }
        >
          {connected ? "●" : "○"}
        </span>

        <span>
          {presence.scanners} scanner
          {presence.scanners === 1
            ? ""
            : "s"}
        </span>

        <Link
          to="/?switch=1"
          className="underline"
        >
          Switch
        </Link>

        <button
          onClick={logout}
          className="underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}