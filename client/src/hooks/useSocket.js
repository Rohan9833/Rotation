import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// role: "display" (iPad) | "scanner" (phone)
export function useSocket(role, handlers = {}) {
  const [connected, setConnected] = useState(false);
  const [presence, setPresence] = useState({ displays: 0, scanners: 0 });
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const opts = { auth: { token: localStorage.getItem("token"), role } };
    const url = import.meta.env.VITE_API_URL;
    const socket = url ? io(url, opts) : io(opts);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (e) => {
      setConnected(false);
      if (e.message === "unauthorized") window.dispatchEvent(new Event("auth:expired"));
    });
    socket.on("presence", setPresence);
    socket.on("sequence", (d) => handlersRef.current.onSequence?.(d.sequence));
    socket.on("state", (d) => handlersRef.current.onState?.(d.sequence));

    return () => socket.disconnect();
  }, [role]);

  return { connected, presence };
}
