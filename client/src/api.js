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
      ...(body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (
      res.status === 401 &&
      !path.startsWith("/api/auth/login")
    ) {
      window.dispatchEvent(
        new Event("auth:expired")
      );
    }

    throw new Error(
      data.error || `Request failed (${res.status})`
    );
  }

  return data;
}