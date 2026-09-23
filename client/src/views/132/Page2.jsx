import ViewLayout from "../ViewLayout";

export default function Page2() {
  return (
    <ViewLayout
      title="Featured Product"
      order="1 - 3 - 2"
      bg="bg-sky-800"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] bg-white/10 p-10 backdrop-blur-sm">
          <div className="grid grid-cols-2 items-center gap-12 text-left">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                Featured
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Smart Experience
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-white/70">
                A powerful and simple solution designed to make
                everyday experiences faster, easier, and more engaging.
              </p>

              <button className="mt-8 rounded-full bg-white px-7 py-3 font-semibold text-sky-800 transition hover:scale-105">
                Explore Product
              </button>
            </div>

            <div className="flex h-64 items-center justify-center rounded-3xl bg-white/10">
              <span className="text-8xl">🚀</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-white/50">
          Page 2 of 2
        </p>
      </div>
    </ViewLayout>
  );
}