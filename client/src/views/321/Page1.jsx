import ViewLayout from "../ViewLayout";

export default function Page1() {
  return (
    <ViewLayout
      title="Contact Us"
      order="3 - 2 - 1"
      bg="bg-slate-600"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xl text-white/80">
          We'd love to hear from you
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">✉</div>

            <h3 className="mt-5 text-xl font-semibold">
              Email
            </h3>

            <p className="mt-3 text-sm text-white/60">
              hello@example.com
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">☎</div>

            <h3 className="mt-5 text-xl font-semibold">
              Phone
            </h3>

            <p className="mt-3 text-sm text-white/60">
              +91 98765 43210
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="text-4xl">⌖</div>

            <h3 className="mt-5 text-xl font-semibold">
              Location
            </h3>

            <p className="mt-3 text-sm text-white/60">
              Mumbai, India
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-white/50">
          Swipe to send us a message
        </p>
      </div>
    </ViewLayout>
  );
}