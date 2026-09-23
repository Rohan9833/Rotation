import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";

export default function DisplayShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // On browser refresh, return to Display Home
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

  // Scan is allowed ONLY on Display Home
  const go = (seq) => {
    // Ignore scanner events when user is already on a slide
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

  const { connected, presence } = useSocket("display", {
    onSequence: go,
  });

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
          {presence.scanners === 1 ? "" : "s"}
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