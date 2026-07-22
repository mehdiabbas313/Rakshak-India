const stats = [
  {
    number: "24×7",
    label: "Emergency Support",
  },
  {
    number: "112",
    label: "National Emergency Integration",
  },
  {
    number: "100+",
    label: "Cities Planned",
  },
  {
    number: "AI",
    label: "Powered Assistance",
  },
];

function Stats() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700 p-8 text-center"
          >
            <h2 className="text-4xl font-bold text-blue-400">
              {item.number}
            </h2>

            <p className="mt-3 text-slate-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;