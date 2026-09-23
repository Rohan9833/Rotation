import ViewLayout from "../ViewLayout";

export default function Page2() {
  return (
    <ViewLayout
      title="Explore"
      order="1 - 2 - 3"
      bg="bg-emerald-700"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-xl text-white/80">
          You are now on the second page.
        </p>

        <div className="mt-10 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <p className="text-lg text-white/70">
            This is page 2 of 2
          </p>

          <p className="mt-3 text-3xl font-semibold">
            End of this experience
          </p>
        </div>
      </div>
    </ViewLayout>
  );
}