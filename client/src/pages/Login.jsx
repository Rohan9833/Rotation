import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ScanLine,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      await login(username, password);

      navigate(
        location.state?.from?.pathname || "/",
        { replace: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050505] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[120px]"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top / bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#050505_85%)]" />

      {/* =========================================================
          MAIN
      ========================================================= */}

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-10">

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[420px]"
        >

          {/* =====================================================
              BRAND
          ===================================================== */}

          <div className="mb-7 text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.4,
              }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <ScanLine
                size={26}
                strokeWidth={1.7}
                className="text-white/90"
              />
            </motion.div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* =====================================================
              CARD
          ===================================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7">

            {/* Card shine */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Small corner decoration */}
            <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t border-white/10" />

            {/* ===================================================
                FORM
            =================================================== */}

            <form onSubmit={submit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Username
                </label>

                <div className="group relative">

                  <UserRound
                    size={18}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-white/70"
                  />

                  <input
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.09]
                      bg-black/30
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/20
                      transition-all
                      duration-200
                      focus:border-white/25
                      focus:bg-black/45
                      focus:ring-4
                      focus:ring-white/[0.035]
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Password
                </label>

                <div className="group relative">

                  <LockKeyhole
                    size={18}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-white/70"
                  />

                  <input
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.09]
                      bg-black/30
                      pl-11
                      pr-12
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/20
                      transition-all
                      duration-200
                      focus:border-white/25
                      focus:bg-black/45
                      focus:ring-4
                      focus:ring-white/[0.035]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-white/30
                      transition
                      hover:bg-white/[0.06]
                      hover:text-white/70
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  className="rounded-xl border border-red-500/15 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={
                  busy ||
                  !username ||
                  !password
                }
                whileHover={
                  !busy &&
                    username &&
                    password
                    ? {
                      scale: 1.01,
                    }
                    : {}
                }
                whileTap={
                  !busy &&
                    username &&
                    password
                    ? {
                      scale: 0.985,
                    }
                    : {}
                }
                className="
                  group
                  relative
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-xl
                  bg-white
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-200
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >

                {/* Button shine */}
                {!busy && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}

                <span className="relative">
                  {busy
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                {!busy && (
                  <ArrowRight
                    size={17}
                    className="relative transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}

                {busy && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                )}
              </motion.button>
            </form>

            {/* ===================================================
                FOOTER
            =================================================== */}

            <div className="mt-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.06]" />

              <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                Secure access
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

          </div>

          {/* Bottom text */}
          <p className="mt-6 text-center text-[11px] text-white/20">
            Card Recognition System
          </p>

        </motion.div>
      </div>
    </div>
  );
}