const STATS = [
  { value: "9.600+", label: "Lorem ipsum" },
  { value: "202.000+", label: "Lorem ipsum dolor sit" },
  { value: "1.200+", label: "Lorem ipsum dolor" },
] as const;

export function Stats() {
  return (
    <section
      aria-label="Estadísticas de la plataforma"
      className="mx-auto max-w-[1640px] px-4 py-10 sm:px-6 lg:px-7"
    >
      <ul className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {STATS.map((stat) => (
          <li key={stat.label}>
            <b className="block font-sans text-4xl font-semibold leading-none text-neutral-900 sm:text-5xl">
              {stat.value}
            </b>
            <span className="mt-2 block text-[14.5px] text-neutral-600">
              {stat.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
