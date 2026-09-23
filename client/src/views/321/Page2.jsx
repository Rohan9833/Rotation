import ViewLayout from "../ViewLayout";

export default function Page2() {
  return (
    <ViewLayout
      title="Let's Connect"
      order="3 - 2 - 1"
      bg="bg-slate-800"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white/10 p-10 backdrop-blur-sm">
          <p className="text-lg text-white/70">
            Have a question or want to know more?
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-white/10 px-6 py-5 text-left">
              <p className="text-sm text-white/40">
                Email
              </p>

              <p className="mt-1 text-lg">
                hello@example.com
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-5 text-left">
              <p className="text-sm text-white/40">
                Phone
              </p>

              <p className="mt-1 text-lg">
                +91 98765 43210
              </p>
            </div>
          </div>

          <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-slate-800 transition hover:scale-105">
            Get in Touch
          </button>
        </div>

        <p className="mt-8 text-sm text-white/40">
          We look forward to connecting with you.
        </p>
      </div>
    </ViewLayout>
  );
}