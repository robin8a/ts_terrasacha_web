type VideoclipsHeroProps = {
  totalCount: number;
  highlightedCount: number;
};

const VideoclipsHero = ({ totalCount, highlightedCount }: VideoclipsHeroProps) => (
  <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#e8d79a] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(68,72,44,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(132,155,80,0.2),transparent_22%)]" />
    <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-secondary-claro/25 blur-3xl" />

    <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
          Aprende en minutos
        </div>

        <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
          Videoclips Educativos
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
          Contenido educativo breve sobre sostenibilidad, territorio y ciencia aplicada.
          Reproducción integrada: no necesitas salir del sitio para aprender.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
            Videos en la plataforma
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-secondary-claro" />
            Formato horizontal 16:9
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-secondary-pradera" />
            Territorio y sostenibilidad
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-[#44482c]/12 bg-white/35 p-5 backdrop-blur-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">Panorama</p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
              <p className="text-2xl font-black text-[#e8d79a]">{totalCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">Videoclips</p>
            </div>
            <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
              <p className="text-2xl font-black text-[#e8d79a]">{highlightedCount}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">Destacados</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/45 p-4">
            <p className="text-sm leading-relaxed text-[#44482c]/90">
              Producidos por el equipo TerraSacha para comunicar ciencia con impacto educativo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VideoclipsHero;
