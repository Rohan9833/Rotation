import ViewLayout from "../ViewLayout";

export default function Page1() {
  return (
    <ViewLayout
      title="Special Offers"
      order="2 - 1 - 3"
      bg="bg-amber-600"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xl text-white/80">
          Exclusive offers available for you
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white/10 p-8 text-left backdrop-blur-sm">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              LIMITED TIME
            </span>

            <h2 className="mt-6 text-4xl font-bold">
              20% OFF
            </h2>

            <p className="mt-3 text-lg text-white/70">
              Save 20% on your next purchase.
            </p>

            <p className="mt-6 text-sm text-white/50">
              Offer available for a limited time.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 text-left backdrop-blur-sm">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              BONUS
            </span>

            <h2 className="mt-6 text-4xl font-bold">
              FREE GIFT
            </h2>

            <p className="mt-3 text-lg text-white/70">
              Get a complimentary gift with your purchase.
            </p>

            <p className="mt-6 text-sm text-white/50">
              While supplies last.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-white/50">
          Swipe to see how to redeem
        </p>
      </div>
    </ViewLayout>
  );
}