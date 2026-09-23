import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// role: "display" (iPad) | "scanner" (phone)
export function useSocket(role, handlers = {}) {
  const [connected, setConnected] = useState(false);

  const [presence, setPresence] = useState({
    displays: 0,
    scanners: 0,
  });

  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const opts = {
      auth: {
        token,
        role,
      },

      // Use WebSocket directly.
      // This avoids the failing polling requests
      // through the ngrok tunnel.
      transports: ["websocket"],
    };

    const url = import.meta.env.VITE_API_URL;

    const socket = url
      ? io(url, opts)
      : io(opts);

    // ==========================================
    // CONNECT
    // ==========================================

    socket.on("connect", () => {
      console.log(
        `Socket connected (${role}):`,
        socket.id
      );

      setConnected(true);
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected (${role}):`,
        reason
      );

      setConnected(false);
    });

    // ==========================================
    // CONNECTION ERROR
    // ==========================================

    socket.on("connect_error", (error) => {
      console.error(
        `Socket connection error (${role}):`,
        error.message
      );

      setConnected(false);

      if (error.message === "unauthorized") {
        window.dispatchEvent(
          new Event("auth:expired")
        );
      }
    });

    // ==========================================
    // PRESENCE
    // ==========================================

    socket.on("presence", (data) => {
      console.log(
        `Socket presence (${role}):`,
        data
      );

      setPresence(data);
    });

    // ==========================================
    // SEQUENCE
    // ==========================================

    socket.on("sequence", (data) => {
      console.log(
        "Socket sequence:",
        data
      );

      handlersRef.current.onSequence?.(
        data.sequence
      );
    });

    // ==========================================
    // STATE
    // ==========================================

    socket.on("state", (data) => {
      console.log(
        "Socket state:",
        data
      );

      handlersRef.current.onState?.(
        data.sequence
      );
    });

    // ==========================================
    // CARD ACTION
    // ==========================================

    socket.on("cardAction", (action) => {
      console.log(
        "Socket card action:",
        action
      );

      handlersRef.current.onCardAction?.(
        action
      );
    });

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      console.log(
        `Closing socket (${role})`
      );

      socket.disconnect();
    };
  }, [role]);

  return {
    connected,
    presence,
  };
}