import ViewLayout from "../ViewLayout";

export default function Page1() {
  return (
    <ViewLayout
      title="Products"
      order="1 - 3 - 2"
      bg="bg-sky-600"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xl text-white/80">
          Discover what we have to offer
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-5 text-2xl font-semibold">
              Fast
            </h3>
            <p className="mt-2 text-white/70">
              Built for speed and simplicity.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">✨</div>
            <h3 className="mt-5 text-2xl font-semibold">
              Modern
            </h3>
            <p className="mt-2 text-white/70">
              A clean experience designed for everyone.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">🛡️</div>
            <h3 className="mt-5 text-2xl font-semibold">
              Reliable
            </h3>
            <p className="mt-2 text-white/70">
              Designed with quality and reliability in mind.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-white/50">
          Swipe to explore more
        </p>
      </div>
    </ViewLayout>
  );
}