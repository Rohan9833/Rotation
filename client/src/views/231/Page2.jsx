import ViewLayout from "../ViewLayout";

export default function Page2() {
  return (
    <ViewLayout
      title="Behind the Story"
      order="2 - 3 - 1"
      bg="bg-rose-800"
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white/10 p-7 text-left backdrop-blur-sm">
            <div className="text-4xl font-bold">
              01
            </div>

            <h3 className="mt-5 text-2xl font-semibold">
              The Idea
            </h3>

            <p className="mt-3 text-white/60">
              Every great experience begins with a simple idea.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-7 text-left backdrop-blur-sm">
            <div className="text-4xl font-bold">
              02
            </div>

            <h3 className="mt-5 text-2xl font-semibold">
              The Journey
            </h3>

            <p className="mt-3 text-white/60">
              See how the idea becomes a real experience.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-7 text-left backdrop-blur-sm">
            <div className="text-4xl font-bold">
              03
            </div>

            <h3 className="mt-5 text-2xl font-semibold">
              The Result
            </h3>

            <p className="mt-3 text-white/60">
              A finished experience built for people.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <p className="text-lg text-white/70">
            Want to know more?
          </p>

          <button className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-rose-800 transition hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </ViewLayout>
  );
}