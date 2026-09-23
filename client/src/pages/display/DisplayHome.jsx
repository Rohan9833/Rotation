import { motion } from "motion/react";
import { useEffect, useState } from "react";

const cards = [
    {
        number: "1",
        label: "FIRST",
        rotate: -7,
    },
    {
        number: "2",
        label: "SECOND",
        rotate: 0,
    },
    {
        number: "3",
        label: "THIRD",
        rotate: 7,
    },
];

const shufflePaths = [
    [
        {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: -5,
            rotateZ: -7,
            scale: 1,
        },
        {
            x: -145,
            y: -42,
            z: 65,
            rotateX: 7,
            rotateY: -22,
            rotateZ: -26,
            scale: 1.02,
        },
        {
            x: 105,
            y: 48,
            z: -20,
            rotateX: -8,
            rotateY: 25,
            rotateZ: 20,
            scale: 0.92,
        },
        {
            x: 12,
            y: -3,
            z: 35,
            rotateX: 2,
            rotateY: -5,
            rotateZ: -3,
            scale: 1.04,
        },
        {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: -5,
            rotateZ: -7,
            scale: 1,
        },
    ],

    [
        {
            x: 0,
            y: 0,
            z: 15,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
        },
        {
            x: 125,
            y: 42,
            z: 75,
            rotateX: -7,
            rotateY: 25,
            rotateZ: 25,
            scale: 1.04,
        },
        {
            x: -115,
            y: -42,
            z: -30,
            rotateX: 8,
            rotateY: -27,
            rotateZ: -21,
            scale: 0.91,
        },
        {
            x: -8,
            y: 2,
            z: 40,
            rotateX: -2,
            rotateY: 5,
            rotateZ: 2,
            scale: 1.04,
        },
        {
            x: 0,
            y: 0,
            z: 15,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
        },
    ],

    [
        {
            x: 0,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 5,
            rotateZ: 7,
            scale: 1,
        },
        {
            x: 72,
            y: 52,
            z: -25,
            rotateX: 8,
            rotateY: 29,
            rotateZ: 28,
            scale: 0.91,
        },
        {
            x: -145,
            y: -32,
            z: 80,
            rotateX: -7,
            rotateY: -25,
            rotateZ: -23,
            scale: 1.02,
        },
        {
            x: 6,
            y: -2,
            z: 30,
            rotateX: 2,
            rotateY: 5,
            rotateZ: 3,
            scale: 1.04,
        },
        {
            x: 0,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 5,
            rotateZ: 7,
            scale: 1,
        },
    ],
];

const CARD_POSES = {
    idle: [
        {
            x: -68,
            y: 8,
            z: 0,
            rotateX: 0,
            rotateY: -3,
            rotateZ: -6,
            scale: 0.98,
        },
        {
            x: 0,
            y: 0,
            z: 10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
        },
        {
            x: 68,
            y: 8,
            z: 0,
            rotateX: 0,
            rotateY: 3,
            rotateZ: 6,
            scale: 0.98,
        },
    ],

    lift: [
        {
            x: -68,
            y: -12,
            z: 30,
            rotateX: -2,
            rotateY: -7,
            rotateZ: -7,
            scale: 1,
        },
        {
            x: 0,
            y: -18,
            z: 55,
            rotateX: 2,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.04,
        },
        {
            x: 68,
            y: -12,
            z: 30,
            rotateX: 2,
            rotateY: 7,
            rotateZ: 7,
            scale: 1,
        },
    ],

    settle: [
        {
            x: -62,
            y: 0,
            z: 15,
            rotateX: 0,
            rotateY: -2,
            rotateZ: -5,
            scale: 1,
        },
        {
            x: 0,
            y: -2,
            z: 20,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
        },
        {
            x: 62,
            y: 0,
            z: 15,
            rotateX: 0,
            rotateY: 2,
            rotateZ: 5,
            scale: 1,
        },
    ],

    lock: [
        {
            x: -63,
            y: 0,
            z: 10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: -2,
            scale: 1,
        },
        {
            x: 0,
            y: 0,
            z: 30,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.02,
        },
        {
            x: 63,
            y: 0,
            z: 10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 2,
            scale: 1,
        },
    ],

    recognize: [
        {
            x: -63,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 0,
            rotateZ: -1,
            scale: 1,
        },
        {
            x: 0,
            y: 0,
            z: 35,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.03,
        },
        {
            x: 63,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 1,
            scale: 1,
        },
    ],

    hold: [
        {
            x: -63,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 0,
            rotateZ: -1,
            scale: 1,
        },
        {
            x: 0,
            y: 0,
            z: 35,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.03,
        },
        {
            x: 63,
            y: 0,
            z: 5,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 1,
            scale: 1,
        },
    ],
};

const statusText = {
    idle: "Arrange the cards to begin",
    lift: "Preparing the cards",
    shuffle: "Finding the sequence",
    settle: "Aligning the cards",
    lock: "Sequence detected",
    recognize: "Sequence recognized",
    hold: "Your experience is ready",
};

export default function DisplayHome() {
    const [phase, setPhase] = useState("idle");

    useEffect(() => {
        let timers = [];

        const runSequence = () => {
            timers.forEach(clearTimeout);
            timers = [];

            setPhase("idle");

            timers.push(
                setTimeout(() => {
                    setPhase("lift");
                }, 900)
            );

            timers.push(
                setTimeout(() => {
                    setPhase("shuffle");
                }, 1600)
            );

            timers.push(
                setTimeout(() => {
                    setPhase("settle");
                }, 5100)
            );

            timers.push(
                setTimeout(() => {
                    setPhase("lock");
                }, 6200)
            );

            timers.push(
                setTimeout(() => {
                    setPhase("recognize");
                }, 7100)
            );

            timers.push(
                setTimeout(() => {
                    setPhase("hold");
                }, 8500)
            );

            timers.push(
                setTimeout(() => {
                    runSequence();
                }, 10500)
            );
        };

        runSequence();

        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    const stepIndex = {
        idle: 0,
        lift: 0,
        shuffle: 0,
        settle: 1,
        lock: 1,
        recognize: 2,
        hold: 2,
    }[phase];

    return (
        <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050505] text-white">
            {/* ========================================================= */}
            {/* BACKGROUND                                               */}
            {/* ========================================================= */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Main ambient glow */}

                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.04, 0.09, 0.04],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 blur-[170px]"
                />

                {/* Left glow */}

                <motion.div
                    animate={{
                        x: [-100, 100, -100],
                        y: [40, -50, 40],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute left-[5%] top-[20%] h-[320px] w-[320px] rounded-full bg-violet-500/[0.045] blur-[140px]"
                />

                {/* Right glow */}

                <motion.div
                    animate={{
                        x: [100, -100, 100],
                        y: [-40, 70, -40],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-[8%] right-[5%] h-[300px] w-[300px] rounded-full bg-blue-500/[0.04] blur-[130px]"
                />

                {/* Grid (static) */}

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* ========================================================= */}
            {/* FLOATING PARTICLES (reduced)                             */}
            {/* ========================================================= */}

            {[...Array(8)].map((_, index) => {
                const positions = [
                    ["10%", "16%"],
                    ["87%", "14%"],
                    ["7%", "62%"],
                    ["93%", "68%"],
                    ["18%", "83%"],
                    ["82%", "84%"],
                    ["14%", "40%"],
                    ["88%", "43%"],
                ];

                return (
                    <motion.span
                        key={index}
                        className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/20"
                        style={{
                            left: positions[index][0],
                            top: positions[index][1],
                        }}
                        animate={{
                            y: [-10, 10, -10],
                            opacity: [0.08, 0.45, 0.08],
                            scale: [0.8, 1.4, 0.8],
                        }}
                        transition={{
                            duration: 3 + (index % 4),
                            delay: index * 0.15,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}

            {/* ========================================================= */}
            {/* MAIN CONTENT                                             */}
            {/* ========================================================= */}

            <motion.main
                initial={{
                    opacity: 0,
                    y: 30,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="relative z-10 flex w-full flex-col items-center px-6 pb-20 pt-10 text-center"
            >
                {/* ===================================================== */}
                {/* STORY LABEL                                           */}
                {/* ===================================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.15,
                        duration: 0.5,
                    }}
                    className="mb-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-xl"
                >
                    <motion.span
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.9, 1.15, 0.9],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />

                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                        Interactive experience
                    </span>
                </motion.div>

                {/* ===================================================== */}
                {/* CARD STORY AREA                                       */}
                {/* ===================================================== */}

                <motion.section
                    initial={{
                        opacity: 0,
                        scale: 0.88,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        delay: 0.2,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative h-[320px] w-full max-w-[700px]"
                    style={{
                        perspective: "1200px",
                        perspectiveOrigin: "50% 48%",
                    }}
                >
                    {/* Large glow */}

                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.04, 0.13, 0.04],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute left-1/2 top-1/2 h-52 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]"
                    />

                    {/* ================================================= */}
                    {/* SHUFFLE PARTICLES (only during shuffle)           */}
                    {/* ================================================= */}

                    {phase === "shuffle" &&
                        [...Array(10)].map((_, index) => {
                            const angle = (index / 10) * Math.PI * 2;

                            return (
                                <motion.span
                                    key={index}
                                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/40"
                                    animate={{
                                        x: [
                                            0,
                                            Math.cos(angle) * 125,
                                            Math.cos(angle) * 40,
                                            0,
                                        ],
                                        y: [
                                            0,
                                            Math.sin(angle) * 80,
                                            Math.sin(angle) * 25,
                                            0,
                                        ],
                                        opacity: [0, 0.75, 0.15, 0],
                                        scale: [0.4, 1.4, 0.7, 0.4],
                                    }}
                                    transition={{
                                        duration: 3.8,
                                        delay: 0.8 + index * 0.08,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                />
                            );
                        })}

                    {/* ================================================= */}
                    {/* FLOOR SHADOW                                       */}
                    {/* ================================================= */}

                    <motion.div
                        animate={{
                            scaleX: [1, 1.12, 1],
                            opacity: [0.18, 0.3, 0.18],
                        }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-8 left-1/2 h-10 w-72 -translate-x-1/2 rounded-full bg-black blur-2xl"
                    />

                    {/* ================================================= */}
                    {/* CARDS                                              */}
                    {/* ================================================= */}

                    <div className="absolute inset-0 flex items-center justify-center">
                        {cards.map((card, index) => {
                            const path = shufflePaths[index];
                            const pose = CARD_POSES[phase] || CARD_POSES.idle;
                            const target = pose[index];

                            const isShuffle = phase === "shuffle";

                            const animation = isShuffle
                                ? {
                                    x: path.map((item) => item.x),
                                    y: path.map((item) => item.y),
                                    z: path.map((item) => item.z),
                                    rotateX: path.map((item) => item.rotateX),
                                    rotateY: path.map((item) => item.rotateY),
                                    rotateZ: path.map((item) => item.rotateZ),
                                    scale: path.map((item) => item.scale),
                                }
                                : {
                                    x: target.x,
                                    y: target.y,
                                    z: target.z,
                                    rotateX: target.rotateX,
                                    rotateY: target.rotateY,
                                    rotateZ: target.rotateZ,
                                    scale: target.scale,
                                };

                            return (
                                <motion.div
                                    key={card.number}
                                    className="absolute"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        willChange: "transform",
                                        zIndex:
                                            phase === "shuffle"
                                                ? index
                                                : index === 1
                                                    ? 30
                                                    : 20,
                                    }}
                                    animate={animation}
                                    transition={
                                        isShuffle
                                            ? {
                                                duration: 3.5,
                                                times: [0, 0.22, 0.5, 0.78, 1],
                                                delay: index * 0.12,
                                                ease: [0.16, 1, 0.3, 1],
                                            }
                                            : {
                                                type: "spring",
                                                stiffness: 170,
                                                damping: 20,
                                                mass: 0.8,
                                            }
                                    }
                                >
                                    {/* Card shadow */}

                                    <motion.div
                                        className="absolute left-1/2 top-1/2 h-[150px] w-[95px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-black/80 blur-[18px]"
                                        animate={{
                                            scale: isShuffle
                                                ? path.map((item) => 0.82 + item.z / 700)
                                                : 0.82 + target.z / 700,
                                            opacity: isShuffle
                                                ? path.map((item) =>
                                                    Math.max(0.18, 0.48 - item.z / 350)
                                                )
                                                : Math.max(0.18, 0.48 - target.z / 350),
                                            y: isShuffle
                                                ? path.map((item) => 22 - item.z / 8)
                                                : 22 - target.z / 8,
                                        }}
                                        transition={
                                            isShuffle
                                                ? {
                                                    duration: 3.5,
                                                    times: [0, 0.22, 0.5, 0.78, 1],
                                                    delay: index * 0.12,
                                                    ease: [0.16, 1, 0.3, 1],
                                                }
                                                : {
                                                    type: "spring",
                                                    stiffness: 170,
                                                    damping: 20,
                                                    mass: 0.8,
                                                }
                                        }
                                    />

                                    {/* Physical card */}

                                    <div
                                        className="relative h-[178px] w-[116px] overflow-hidden rounded-[22px] border border-white/15 bg-gradient-to-br from-white/[0.16] via-white/[0.07] to-white/[0.025] p-3 shadow-[0_35px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
                                        style={{
                                            transformStyle: "preserve-3d",
                                            backfaceVisibility: "hidden",
                                        }}
                                    >
                                        {/* Physical edge */}

                                        <div
                                            className="pointer-events-none absolute inset-0 rounded-[22px] border border-white/10"
                                            style={{
                                                transform: "translateZ(-3px)",
                                                background:
                                                    "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                                            }}
                                        />

                                        <div
                                            className="pointer-events-none absolute bottom-[-4px] left-[5px] right-[5px] h-2 rounded-full bg-black/50 blur-[4px]"
                                            style={{
                                                transform: "translateZ(-5px)",
                                            }}
                                        />

                                        {/* Inner glow */}

                                        <motion.div
                                            animate={{
                                                opacity: [0.02, 0.09, 0.02],
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                delay: index * 0.3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-0 bg-white"
                                        />

                                        {/* Shine */}

                                        <motion.div
                                            animate={{
                                                x: ["-180%", "180%"],
                                                opacity: [0, 0.35, 0],
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                                repeatDelay: 4.5,
                                                delay: index * 0.7,
                                                ease: "easeInOut",
                                            }}
                                            className="pointer-events-none absolute -inset-y-10 left-[-20%] w-[25%] rotate-[22deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"
                                        />

                                        {/* Card border corners */}

                                        <div className="absolute inset-3">
                                            <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l border-t border-white/20" />

                                            <span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r border-t border-white/20" />

                                            <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b border-l border-white/20" />

                                            <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b border-r border-white/20" />
                                        </div>

                                        {/* Card header */}

                                        <div
                                            className="relative z-10 flex items-center justify-between"
                                            style={{
                                                transform: "translateZ(10px)",
                                            }}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-white/35" />

                                            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/25">
                                                {card.label}
                                            </span>
                                        </div>

                                        {/* Number */}

                                        <motion.div
                                            animate={{
                                                opacity: phase === "recognize" ? 1 : 0.96,
                                            }}
                                            transition={{
                                                duration: 0.45,
                                            }}
                                            className="relative z-10 flex h-full items-center justify-center pb-1 text-7xl font-semibold tracking-[-0.08em] text-white/90"
                                            style={{
                                                transform: "translateZ(12px)",
                                            }}
                                        >
                                            {card.number}
                                        </motion.div>

                                        {/* Bottom card detail */}

                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <div className="h-1 w-8 rounded-full bg-white/10" />

                                            <div className="h-1 w-3 rounded-full bg-white/10" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ================================================= */}
                    {/* SEQUENCE LINE                                     */}
                    {/* ================================================= */}

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{
                            scaleX:
                                phase === "lock" ||
                                    phase === "recognize" ||
                                    phase === "hold"
                                    ? 1
                                    : 0,
                        }}
                        transition={{
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute left-1/2 top-1/2 h-px w-48 origin-left -translate-x-1/2 bg-white/30"
                    />
                </motion.section>

                {/* ===================================================== */}
                {/* STORY TITLE                                           */}
                {/* ===================================================== */}

                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.35,
                        duration: 0.6,
                    }}
                    className="mt-2 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl"
                >
                    Create your sequence
                </motion.h1>

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.5,
                        duration: 0.6,
                    }}
                    className="mt-4 max-w-lg text-lg leading-relaxed text-white/40"
                >
                    Arrange the cards in the order you want.
                    <br />
                    The system recognizes the sequence and
                    <br />
                    reveals the experience automatically.
                </motion.p>

                {/* ===================================================== */}
                {/* STORY STEPS                                           */}
                {/* ===================================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.65,
                        duration: 0.6,
                    }}
                    className="mt-10 flex items-center gap-3"
                >
                    {/* STEP 1 */}

                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{
                                scale: stepIndex === 0 ? 1.12 : 1,
                                opacity: stepIndex === 0 ? 1 : 0.45,
                            }}
                            transition={{ duration: 0.5 }}
                            className={`
                grid h-9 w-9 place-items-center rounded-xl
                border text-xs font-semibold transition-all duration-500
                ${stepIndex >= 0
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-white/10 bg-white/[0.05] text-white/30"
                                }
              `}
                        >
                            01
                        </motion.div>

                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
                            Arrange
                        </span>
                    </div>

                    {/* Connector */}

                    <motion.div
                        animate={{
                            opacity: [0.2, 0.7, 0.2],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                        }}
                        className="h-px w-8 bg-white/20"
                    />

                    {/* STEP 2 */}

                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{
                                scale: stepIndex === 1 ? 1.12 : 1,
                                opacity: stepIndex === 1 ? 1 : 0.45,
                            }}
                            transition={{ duration: 0.5 }}
                            className={`
                grid h-9 w-9 place-items-center rounded-xl
                border text-xs font-semibold transition-all duration-500
                ${stepIndex >= 1
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-white/10 bg-white/[0.05] text-white/30"
                                }
              `}
                        >
                            02
                        </motion.div>

                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
                            Recognize
                        </span>
                    </div>

                    {/* Connector */}

                    <motion.div
                        animate={{
                            opacity: [0.2, 0.7, 0.2],
                        }}
                        transition={{
                            duration: 1.8,
                            delay: 0.4,
                            repeat: Infinity,
                        }}
                        className="h-px w-8 bg-white/20"
                    />

                    {/* STEP 3 */}

                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{
                                scale: stepIndex === 2 ? 1.12 : 1,
                                opacity: stepIndex === 2 ? 1 : 0.45,
                            }}
                            transition={{ duration: 0.5 }}
                            className={`
                grid h-9 w-9 place-items-center rounded-xl
                border text-xs font-semibold transition-all duration-500
                ${stepIndex >= 2
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-white/10 bg-white/[0.05] text-white/30"
                                }
              `}
                        >
                            03
                        </motion.div>

                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
                            Reveal
                        </span>
                    </div>
                </motion.div>

                {/* ===================================================== */}
                {/* RECOGNITION RESULT                                    */}
                {/* ===================================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                        scale: 0.96,
                    }}
                    animate={{
                        opacity: [0.55, 1, 0.55],
                        y: 0,
                        scale: [0.98, 1, 0.98],
                    }}
                    transition={{
                        opacity: {
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                        scale: {
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                        y: {
                            delay: 0.8,
                            duration: 0.6,
                        },
                    }}
                    className="mt-8 flex items-center gap-3 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-5 py-3 backdrop-blur-xl"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <motion.span
                            animate={{
                                scale: [1, 2, 1],
                                opacity: [0.7, 0, 0.7],
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-full bg-emerald-400"
                        />

                        <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-sm font-medium text-white/55">
                        {statusText[phase]}
                    </span>
                </motion.div>
            </motion.main>

            {/* ========================================================= */}
            {/* BOTTOM STORY                                           */}
            {/* ========================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 1.1,
                    duration: 0.8,
                }}
                className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3 text-center"
            >
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                    Your cards
                </span>

                <span className="text-white/15">→</span>

                <span className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                    Your sequence
                </span>

                <span className="text-white/15">→</span>

                <span className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                    Your experience
                </span>
            </motion.div>
        </div>
    );
}