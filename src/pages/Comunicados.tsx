import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { comunicados } from '../data/comunicados';

const Comunicados = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const featured = comunicados[0];
  const remaining = comunicados.slice(1);

  const handleCarouselNavigation = (direction: 'previous' | 'next') => {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = carouselRef.current.clientWidth * 0.85;
    const left = direction === 'next' ? scrollAmount : -scrollAmount;

    carouselRef.current.scrollBy({
      left,
      behavior: 'smooth',
    });
  };

  return (
    <main className="font-primary bg-gray-50 min-h-screen py-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#e8d79a] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(68,72,44,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(132,155,80,0.2),transparent_22%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-secondary-claro/25 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
                Comunicados Oficiales
              </div>

              <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Comunicados
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Consulta los comunicados oficiales del proyecto Terrasacha, con
                información institucional, avances estratégicos y mensajes clave
                sobre innovación sostenible, ciencia y desarrollo territorial.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
                  Contenido institucional validado
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-claro" />
                  Consulta por comunicado individual
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#44482c]/12 bg-white/35 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">
                  Panorama
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">
                      {comunicados.length}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Comunicados
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">1</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Destacado
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/45 p-4">
                  <p className="text-sm leading-relaxed text-[#44482c]/90">
                    La sección reúne piezas oficiales con un enfoque más sobrio,
                    documental y orientado a divulgación pública.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">COMUNICADO</span>{' '}
              <span className="text-primary">DESTACADO</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-gray-600">
              Información oficial priorizada para facilitar la lectura,
              fortalecer la jerarquía del contenido y mejorar el acceso a cada
              comunicado institucional.
            </p>
          </div>

          {featured && (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <Link
                to={`/comunicados/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="relative h-80 overflow-hidden lg:col-span-7 lg:h-full min-h-[24rem]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/85 via-secondary-[bosques-nublados]/30 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                    Comunicado #{featured.number}
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10 bg-gradient-to-br from-white via-white to-secondary-claro/10">
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {featured.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl sm:text-3xl lg:text-[2rem] font-black leading-tight text-secondary-[bosques-nublados] transition-colors group-hover:text-primary">
                    {featured.title}
                  </h3>
                  <p className="mt-5 text-sm sm:text-base leading-relaxed text-gray-600">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {featured.body[0]}
                    </p>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    Leer comunicado
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          )}

          <div className="mt-10 sm:mt-12">
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
                  <span className="text-secondary-[bosques-nublados]">MÁS</span>{' '}
                  <span className="text-primary">COMUNICADOS</span>
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600">
                  Navega el resto de comunicados oficiales en un formato más
                  práctico y continuo.
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleCarouselNavigation('previous')}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary-[bosques-nublados] shadow-sm transition-all hover:border-primary hover:text-primary"
                  aria-label="Ver comunicados anteriores"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleCarouselNavigation('next')}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary-[bosques-nublados] shadow-sm transition-all hover:border-primary hover:text-primary"
                  aria-label="Ver comunicados siguientes"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            >
              {remaining.map((comunicado) => (
                <Link
                  key={comunicado.id}
                  to={`/comunicados/${comunicado.id}`}
                  className="group min-w-[290px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={comunicado.image}
                      alt={comunicado.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/10 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-[bosques-nublados]">
                      #{comunicado.number}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                      {comunicado.eyebrow}
                    </p>
                    <h4 className="mt-3 text-lg sm:text-xl font-black leading-snug text-secondary-[bosques-nublados] transition-colors group-hover:text-primary">
                      {comunicado.title}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-4">
                      {comunicado.excerpt}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      Leer comunicado
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Comunicados;

