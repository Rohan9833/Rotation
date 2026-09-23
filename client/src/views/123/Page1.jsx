import ViewLayout from "../ViewLayout";

export default function Page1() {
  return (
    <ViewLayout
      title="Welcome"
      order="1 - 2 - 3"
      bg="bg-emerald-600"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-xl text-white/80">
          Welcome to the first experience.
        </p>

        <div className="mt-10 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <p className="text-lg text-white/70">
            This is page 1 of 2
          </p>

          <p className="mt-3 text-3xl font-semibold">
            Swipe to continue
          </p>
        </div>
      </div>
    </ViewLayout>
  );
}