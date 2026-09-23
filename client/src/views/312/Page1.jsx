import ViewLayout from "../ViewLayout";

const images = [
  {
    title: "Experience",
    icon: "✦",
  },
  {
    title: "Innovation",
    icon: "◈",
  },
  {
    title: "Design",
    icon: "✧",
  },
];

export default function Page1() {
  return (
    <ViewLayout
      title="Gallery"
      order="3 - 1 - 2"
      bg="bg-violet-600"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xl text-white/80">
          Explore our visual collection
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6">
          {images.map((item) => (
            <div
              key={item.title}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-sm transition duration-300 hover:scale-[1.03]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />

              <div className="relative text-center">
                <div className="text-7xl transition duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-2xl font-semibold">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-white/50">
          Swipe to view the full gallery
        </p>
      </div>
    </ViewLayout>
  );
}