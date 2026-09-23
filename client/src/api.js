const BASE = import.meta.env.VITE_API_URL || "";

console.log("[API BASE]", BASE);

export async function api(
  path,
  { method = "GET", body } = {}
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",

      // Bypass ngrok's free-tier browser warning
      // page, which otherwise breaks CORS.
      "ngrok-skip-browser-warning": "true",

      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Only treat 401 as "session expired" for
    // authenticated business requests — NOT for
    // the login endpoint or the session-restore
    // endpoint itself.
    if (
      res.status === 401 &&
      !path.startsWith("/api/auth/login") &&
      !path.startsWith("/api/auth/me")
    ) {
      window.dispatchEvent(new Event("auth:expired"));
    }

    throw new Error(
      data.error || `Request failed (${res.status})`
    );
  }

  return data;
}