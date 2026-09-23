import ViewLayout from "../ViewLayout";

const gallery = [
  {
    number: "01",
    title: "The Beginning",
    description: "Where every idea starts.",
  },
  {
    number: "02",
    title: "The Process",
    description: "Turning ideas into experiences.",
  },
  {
    number: "03",
    title: "The Experience",
    description: "Designed to make an impact.",
  },
  {
    number: "04",
    title: "The Future",
    description: "Always moving forward.",
  },
];

export default function Page2() {
  return (
    <ViewLayout
      title="Explore More"
      order="3 - 1 - 2"
      bg="bg-violet-800"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-5">
          {gallery.map((item) => (
            <div
              key={item.number}
              className="rounded-3xl bg-white/10 p-7 text-left backdrop-blur-sm transition duration-300 hover:bg-white/15"
            >
              <span className="text-sm font-semibold tracking-[0.2em] text-white/40">
                {item.number}
              </span>

              <h3 className="mt-4 text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white/10 p-7 backdrop-blur-sm">
          <p className="text-lg text-white/70">
            More moments. More stories. More to explore.
          </p>

          <button className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-violet-800 transition hover:scale-105">
            View Full Gallery
          </button>
        </div>
      </div>
    </ViewLayout>
  );
}