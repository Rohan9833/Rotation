import ViewLayout from "../ViewLayout";

export default function Page1() {
  return (
    <ViewLayout
      title="Video"
      order="2 - 3 - 1"
      bg="bg-rose-600"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xl text-white/80">
          Watch our featured story
        </p>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-black/20 shadow-2xl">
          <div className="relative flex aspect-video items-center justify-center">
            {/* Video thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 via-black/20 to-black/60" />

            {/* Play button */}
            <button
              className="relative grid h-24 w-24 place-items-center rounded-full bg-white text-rose-600 shadow-xl transition hover:scale-110"
              aria-label="Play video"
            >
              <svg
                className="ml-1 h-10 w-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <div className="absolute bottom-5 left-6">
              <p className="text-sm text-white/60">
                FEATURED VIDEO
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Discover Our Story
              </h2>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-white/50">
          Swipe to explore more
        </p>
      </div>
    </ViewLayout>
  );
}