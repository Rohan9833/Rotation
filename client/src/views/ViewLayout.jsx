// Shared full-screen frame for the 6 pages. Replace/extend per page as needed.
export default function ViewLayout({ title, order, bg, children }) {
  return (
    <div className={`fade-in flex min-h-[100dvh] flex-col items-center justify-center p-10 text-center text-white ${bg}`}>
      <p className="text-lg opacity-70">Cards {order}</p>
      <h1 className="mt-2 text-6xl font-bold">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}
