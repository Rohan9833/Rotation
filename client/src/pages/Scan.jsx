import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import CardSequenceScanner from "../components/CardSequenceScanner";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { api } from "../api";

export default function Scan() {
  const { logout } = useAuth();
  const { connected, presence } = useSocket("scanner");
  const [sent, setSent] = useState(null); // { ok, text }

  const send = useCallback(async (sequence) => {
    try {
      const { displays } = await api("/api/scan", { method: "POST", body: { sequence } });
      setSent({ ok: displays > 0, text: displays > 0 ? `Sent ${sequence}` : `Sent ${sequence}, but no display is connected` });
    } catch (e) {
      setSent({ ok: false, text: e.message });
    }
  }, []);

  return (
    <div className="relative">
      <CardSequenceScanner onTrigger={send} />

      <div className="absolute left-3 top-12 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-black/60 px-3 py-1 text-xs text-white">
        <span className={connected && presence.displays ? "text-emerald-400" : "text-amber-400"}>
          {!connected ? "Offline" : presence.displays ? "Display connected" : "No display connected"}
        </span>
        {sent && <span className={sent.ok ? "text-white" : "text-amber-400"}>{sent.text}</span>}
        <Link to="/?switch=1" className="underline opacity-70">Switch</Link>
        <button onClick={logout} className="underline opacity-70">Logout</button>
      </div>
    </div>
  );
}
