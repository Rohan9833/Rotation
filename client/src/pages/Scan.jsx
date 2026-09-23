import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import CardSequenceScanner from "../components/CardSequenceScanner";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { api } from "../api";

export default function Scan() {
  const { logout } = useAuth();

  const { connected, presence } = useSocket("scanner");

  const [sent, setSent] = useState(null);
  // { ok, text }

  // ==========================================
  // SCANNER TRIGGER
  // ==========================================

  const handleTrigger = useCallback(async (data) => {
    try {
      // ========================================
      // SEQUENCE
      // ========================================

      if (typeof data === "string") {
        const { displays } = await api("/api/scan", {
          method: "POST",
          body: {
            sequence: data,
          },
        });

        setSent({
          ok: displays > 0,
          text:
            displays > 0
              ? `Sent ${data}`
              : `Sent ${data}, but no display is connected`,
        });

        return;
      }

      // ========================================
      // ROTATION / MOVEMENT
      // ========================================

      if (data && typeof data === "object") {
        const { displays } = await api("/api/scan/action", {
          method: "POST",
          body: data,
        });

        let text = "Action sent";

        if (data.type === "MOVEMENT") {
          text = `Sent ${data.direction}`;
        }

        if (data.type === "ROTATION") {
          text = data.range
            ? `Sent rotation ${data.range}`
            : "Sent rotation";
        }

        if (displays === 0) {
          text += ", but no display is connected";
        }

        setSent({
          ok: displays > 0,
          text,
        });

        return;
      }

      setSent({
        ok: false,
        text: "Invalid scanner action",
      });
    } catch (e) {
      setSent({
        ok: false,
        text: e.message,
      });
    }
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-black">
      {/* ==========================================
          CARD SCANNER
      ========================================== */}

      <CardSequenceScanner onTrigger={handleTrigger} />

      {/* ==========================================
          STATUS
      ========================================== */}

      <div className="absolute left-3 top-12 z-[100] flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-black/60 px-3 py-1 text-xs text-white">
        <span
          className={
            connected && presence.displays
              ? "text-emerald-400"
              : "text-amber-400"
          }
        >
          {!connected
            ? "Offline"
            : presence.displays
              ? "Display connected"
              : "No display connected"}
        </span>

        {sent && (
          <span
            className={
              sent.ok
                ? "text-white"
                : "text-amber-400"
            }
          >
            {sent.text}
          </span>
        )}

        <Link
          to="/?switch=1"
          className="underline opacity-70"
        >
          Switch
        </Link>

        <button
          onClick={logout}
          className="underline opacity-70"
        >
          Logout
        </button>
      </div>
    </div>
  );
}