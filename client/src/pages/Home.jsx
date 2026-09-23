import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MODES = { display: "/display", scan: "/scan" };

const icon = "h-6 w-6";
const OPTIONS = [
  {
    mode: "display",
    title: "Display",
    desc: "iPad or screen that shows the pages",
    icon: (
      <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    mode: "scan",
    title: "Scanner",
    desc: "Phone that scans the cards",
    icon: (
      <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // each device remembers its mode (iPad = display, phone = scan)
  const saved = localStorage.getItem("mode");
  if (MODES[saved] && !params.has("switch")) return <Navigate to={MODES[saved]} replace />;

  const choose = (mode) => {
    localStorage.setItem("mode", mode);
    navigate(MODES[mode]);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-neutral-950 p-6 text-white">
      {/* soft background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* user */}
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 text-lg font-semibold uppercase">
            {user.username[0]}
          </div>
          <div className="leading-tight">
            <p className="text-xs text-neutral-400">Signed in as</p>
            <p className="font-medium">{user.username}</p>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">Set up this device</h1>
        <p className="mt-2 text-neutral-400">Pick a role. This device will remember it.</p>

        {/* options */}
        <div className="mt-8 space-y-3">
          {OPTIONS.map((o) => (
            <button
              key={o.mode}
              onClick={() => choose(o.mode)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur transition hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-indigo-300 transition group-hover:bg-indigo-500 group-hover:text-white">
                {o.icon}
              </span>
              <span className="flex-1">
                <span className="block text-lg font-medium">{o.title}</span>
                <span className="block text-sm text-neutral-400">{o.desc}</span>
              </span>
              <svg className="h-5 w-5 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-8 text-sm text-neutral-500 transition hover:text-white"
        >
          Log out
        </button>
      </div>
    </div>
  );
}