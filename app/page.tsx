import JungleScene from "./components/JungleScene";

const projectStats = [
  { value: "12+", label: "Launches" },
  { value: "5", label: "Core stacks" },
  { value: "24h", label: "Prototype rhythm" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#102219] text-[#f7f1df]">
      <section className="relative isolate min-h-screen px-6 py-6 sm:px-10 lg:px-14">
        <JungleScene />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,13,9,0.86)_0%,rgba(8,20,14,0.66)_38%,rgba(8,20,14,0.24)_68%,rgba(8,20,14,0.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-[linear-gradient(0deg,rgba(5,12,8,0.76),rgba(5,12,8,0))]" />

        <nav className="relative z-10 flex items-center justify-between text-sm font-medium">
          <a href="#" className="tracking-[0.18em] text-[#f7f1df] uppercase">
          </a>
          <div className="hidden items-center gap-8 text-[#d9dfc8] sm:flex">
            <a href="#work" className="transition hover:text-white">
            </a>
            <a href="#studio" className="transition hover:text-white">
            </a>
            <a href="mailto:hello@example.com" className="transition hover:text-white">
            </a>
          </div>
        </nav>

        <div className="relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-12 pt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,1.18fr)] lg:pt-0">
          <div className="max-w-3xl">
            <p className="mb-5 max-w-max border-l-2 border-[#f2b66d] pl-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#d6e1b8]">
            </p>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] text-[#fff8df] drop-shadow-[0_8px_34px_rgba(0,0,0,0.72)] sm:text-7xl lg:text-8xl">
              ANUSHKA VERMA
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7dfc8] drop-shadow-[0_5px_20px_rgba(0,0,0,0.72)] sm:text-xl">
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            </div>
          </div>

          <div className="pointer-events-none relative min-h-[360px] lg:min-h-[640px]" />
        </div>

        <div className="relative z-10 -mt-8 grid gap-3 pb-3 sm:grid-cols-3 lg:max-w-xl">
          {projectStats.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-white/20 pt-4"
            >
              <div className="text-3xl font-semibold text-[#f2b66d]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-[#d7dfc8]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="work"
        className="relative z-10 bg-[#17231d] px-6 py-16 text-[#f7f1df] sm:px-10 lg:px-14"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1fr]">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Selected explorations
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {["Spatial dashboards", "Product launches"].map((title) => (
              <article key={title} className="border-t border-white/20 pt-5">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#d7dcc9]">
                  Interface systems shaped around clarity, motion restraint,
                  and production-ready frontend craft.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
