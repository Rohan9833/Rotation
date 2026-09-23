import {
  Link,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

import { VIEWS } from "../../views";

const SEQUENCES = ["123", "132", "213", "231", "312", "321"];

export default function SequencePage() {
  const { seq } = useParams();
  const location = useLocation();

  /*
   * seq = REAL sequence received from scanner
   *
   * previewSeq = sequence currently being previewed
   * from hamburger menu
   */

  const [previewSeq, setPreviewSeq] = useState(seq);

  const [activePage, setActivePage] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * Real scanned sequence changes
   *
   * Every scan should start from Page 1.
   */

  useEffect(() => {
    setPreviewSeq(seq);
    setActivePage(0);
  }, [seq, location.state?.scanId]);

  /*
   * Pages for currently previewed sequence
   */

  const pages = VIEWS[previewSeq];

  /*
   * Reset preview to Page 1 whenever
   * user selects another sequence from menu.
   */

  useEffect(() => {
    setActivePage(0);
  }, [previewSeq]);

  if (!VIEWS[seq]) {
    return <Navigate to="/display" replace />;
  }

  if (!pages) {
    return null;
  }

  /*
   * Go to specific page
   */

  const goToPage = (index) => {
    if (index < 0 || index >= pages.length) return;

    setActivePage(index);
  };

  /*
   * Preview another sequence from sidebar.
   *
   * IMPORTANT:
   * This does NOT change `seq`.
   * Therefore scanner sequence remains untouched.
   *
   * NOTE:
   * We intentionally do NOT close the sidebar here,
   * so the user can continue exploring and still
   * use the Continue button to return to the
   * real scanned sequence.
   */

  const handlePreviewSequence = (sequence) => {
    setPreviewSeq(sequence);
  };

  /*
   * Continue button.
   *
   * Return to the REAL scanned sequence.
   */

  const handleContinue = () => {
    if (previewSeq !== seq) {
      setPreviewSeq(seq);
      setActivePage(0);
    }

    setMenuOpen(false);
  };

  /*
   * Keyboard support for development
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        goToPage(activePage + 1);
      }

      if (event.key === "ArrowLeft") {
        goToPage(activePage - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePage]);

  /*
   * If user clicks the real scanned sequence,
   * show its first page.
   */

  const isPreviewingOtherSequence = previewSeq !== seq;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">

      {/* ===================================================== */}
      {/* CONTENT / SWIPE AREA                                  */}
      {/* ===================================================== */}

      <div className="relative h-full w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(event, info) => {
            const distance = info.offset.x;
            const velocity = info.velocity.x;

            const swipe =
              Math.abs(distance) > 70 ||
              Math.abs(velocity) > 450;

            if (!swipe) return;

            // Swipe LEFT → next
            if (distance < 0 || velocity < -450) {
              goToPage(activePage + 1);
              return;
            }

            // Swipe RIGHT → previous
            if (distance > 0 || velocity > 450) {
              goToPage(activePage - 1);
            }
          }}
          style={{ touchAction: "pan-y" }}
        >
          {pages.map((Page, index) => {
            const offset = (index - activePage) * 100;
            const isActive = index === activePage;

            return (
              <motion.div
                key={`${previewSeq}-${index}`}
                initial={false}
                animate={{
                  x: `${offset}%`,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  x: {
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: {
                    duration: 0.12,
                  },
                }}
                className="absolute inset-0 h-full w-full"
                style={{
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <Page />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ===================================================== */}
      {/* HAMBURGER BUTTON                                      */}
      {/* ===================================================== */}

      <motion.button
        type="button"
        onClick={() => setMenuOpen(true)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="absolute left-5 top-5 z-[60] grid h-12 w-12 place-items-center rounded-2xl bg-black/40 text-white shadow-lg backdrop-blur-xl transition duration-200 hover:bg-black/60"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </motion.button>

      {/* ===================================================== */}
      {/* CURRENT SEQUENCE                                      */}
      {/* ===================================================== */}

      <div className="absolute right-5 top-5 z-50 rounded-full bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
        {previewSeq}
      </div>

      {/* ===================================================== */}
      {/* PAGE INDICATORS                                       */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2.5 backdrop-blur-xl">
          {pages.map((_, index) => (
            <motion.span
              key={index}
              layout
              className="block h-2 rounded-full"
              animate={{
                width: index === activePage ? 28 : 7,
                opacity: index === activePage ? 1 : 0.35,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              style={{
                background: "white",
              }}
            />
          ))}
        </div>
      </div>

      {/* ===================================================== */}
      {/* PREVIOUS BUTTON                                       */}
      {/* ===================================================== */}

      {activePage > 0 && (
        <button
          type="button"
          onClick={() => goToPage(activePage - 1)}
          className="absolute left-5 top-1/2 z-50 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50 active:scale-95"
          aria-label="Previous page"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* ===================================================== */}
      {/* NEXT BUTTON                                           */}
      {/* ===================================================== */}

      {activePage < pages.length - 1 && (
        <button
          type="button"
          onClick={() => goToPage(activePage + 1)}
          className="absolute right-5 top-1/2 z-50 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50 active:scale-95"
          aria-label="Next page"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* ===================================================== */}
      {/* SIDEBAR OVERLAY + SIDEBAR                             */}
      {/* ===================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-[3px]"
              onClick={() => setMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              }}
              className={`absolute left-0 top-0 z-[80] h-full bg-[#111111] text-white shadow-2xl transition-[width] duration-300 ease-out ${
                isPreviewingOtherSequence
                  ? "w-[260px] max-w-[76vw]"
                  : "w-[290px] max-w-[82vw]"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              {/* ================================================= */}
              {/* SIDEBAR HEADER                                    */}
              {/* ================================================= */}

              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                      Navigation
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Sequences
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
                    aria-label="Close menu"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                {/* ================================================= */}
                {/* HOME BUTTON                                       */}
                {/* ================================================= */}

                <Link
                  to="/display"
                  onClick={() => setMenuOpen(false)}
                  className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 10 9-7 9 7" />
                    <path d="M5 9v11h14V9" />
                    <path d="M9 20v-6h6v6" />
                  </svg>

                  <span>Home</span>
                </Link>
              </div>

              {/* ================================================= */}
              {/* SIDEBAR CONTENT                                   */}
              {/* ================================================= */}

              <div className="flex h-[calc(100%-145px)] flex-col overflow-y-auto px-4 py-4">
                <p className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
                  Card combinations
                </p>

                <div className="space-y-2">
                  {SEQUENCES.map((sequence) => {
                    const isActive = sequence === seq;
                    const isPreview = sequence === previewSeq;

                    return (
                      <button
                        key={sequence}
                        type="button"
                        onClick={() =>
                          handlePreviewSequence(sequence)
                        }
                        className={`group w-full rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.98] ${
                          isPreview
                            ? "border-white/20 bg-white/10"
                            : "border-transparent bg-white/[0.04] hover:bg-white/[0.08]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Sequence number */}

                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold tracking-wider ${
                                isPreview
                                  ? "bg-white text-black"
                                  : "bg-white/10 text-white/80"
                              }`}
                            >
                              {sequence}
                            </div>

                            <div>
                              <p className="font-medium">
                                {sequence[0]} → {sequence[1]} →{" "}
                                {sequence[2]}
                              </p>

                              <p className="mt-0.5 text-xs text-white/40">
                                2 pages
                              </p>
                            </div>
                          </div>

                          {/* Active indicator */}

                          {isActive && (
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ================================================= */}
              {/* CONTINUE BUTTON                                   */}
              {/* ================================================= */}

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#111111] p-4">
                {isPreviewingOtherSequence && (
                  <p className="mb-3 text-center text-xs text-white/40">
                    Previewing {previewSeq}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                >
                  Continue

                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M5 12h14"
                      strokeLinecap="round"
                    />

                    <path
                      d="M13 6l6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}