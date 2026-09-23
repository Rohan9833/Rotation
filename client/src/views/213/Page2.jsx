import ViewLayout from "../ViewLayout";

export default function Page2() {
  return (
    <ViewLayout
      title="Redeem Your Offer"
      order="2 - 1 - 3"
      bg="bg-amber-800"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white/10 p-10 backdrop-blur-sm">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/50">
            Your Offer
          </p>

          <div className="mt-6 rounded-2xl bg-white px-8 py-6 text-center text-amber-800">
            <p className="text-sm font-medium">
              OFFER CODE
            </p>

            <p className="mt-2 text-5xl font-bold tracking-widest">
              SAVE20
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-bold">20%</p>
              <p className="mt-1 text-sm text-white/60">
                Discount
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-bold">1</p>
              <p className="mt-1 text-sm text-white/60">
                Use
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-bold">∞</p>
              <p className="mt-1 text-sm text-white/60">
                Excitement
              </p>
            </div>
          </div>

          <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-amber-800 transition hover:scale-105">
            Redeem Now
          </button>
        </div>

        <p className="mt-8 text-sm text-white/50">
          Present this offer at checkout
        </p>
      </div>
    </ViewLayout>
  );
}