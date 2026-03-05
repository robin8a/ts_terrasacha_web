import { Link } from 'react-router-dom';

const TrainingSection = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-secondary-claro/15 overflow-hidden">
      {/* Elementos decorativos suaves de fondo */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-secondary-pradera/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary-[amarillo-tierra] text-secondary-[bosques-nublados] px-4 py-2 rounded-full text-sm font-semibold border border-secondary-[amarillo-tierra]/80 mb-6 group hover:bg-secondary-[amarillo-tierra]/90 hover:scale-105 transition-all duration-300">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="uppercase tracking-wide font-primary">Formación Continua</span>
            </div>

            {/* Título */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight font-primary">
              <span className="text-gray-900">Aprende</span>{' '}
              <span className="text-secondary-[amarillo-tierra]">con Nosotros</span>
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-700 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed font-primary">
              Cursos <span className="font-semibold text-secondary-[amarillo-tierra]">gratuitos</span> para el desarrollo sostenible
            </p>
          </div>

          {/* Card principal */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 mb-8 border border-secondary-claro/40 group hover:shadow-2xl transition-all duration-500 animate-fade-in-up delay-200">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr,0.9fr] gap-8 md:gap-10 items-center">
              {/* Columna izquierda: CTA */}
              <div className="text-center md:text-left">
              {/* Badge de estado */}
              <div className="flex items-center justify-center gap-2 bg-secondary-[amarillo-tierra] text-secondary-[bosques-nublados] px-5 py-2.5 rounded-full font-bold text-sm sm:text-base uppercase tracking-wide shadow-lg mb-6 inline-flex group hover:scale-105 transition-transform duration-300">
                <div className="w-2 h-2 bg-secondary-pradera rounded-full animate-pulse"></div>
                <span>INSCRIPCIONES ABIERTAS</span>
              </div>

              {/* Botón principal */}
              <div className="mb-4">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSecFBs5h69bQGxmwEvLU57B7bjSN6qWrmtQ3xlQwiPe5Otnug/viewform?usp=header"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block group"
                >
                  <button className="relative w-full sm:w-auto bg-gradient-to-r from-secondary-[amarillo-tierra] via-secondary-pradera to-secondary-[amarillo-tierra] text-secondary-[bosques-nublados] px-10 py-5 sm:px-12 sm:py-6 rounded-xl font-bold text-lg sm:text-xl hover:shadow-2xl transition-all duration-500 uppercase tracking-wide font-primary overflow-hidden group transform hover:scale-105">
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Contenido */}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>INSCRIPCIONES ABIERTAS</span>
                      <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </a>
              </div>

                {/* Texto descriptivo */}
                <p className="text-gray-700 text-base sm:text-lg font-semibold font-primary">
                  Cursos de formación gratuitos para comunidades de Meta y Arauca.
                </p>
              </div>

              {/* Columna derecha: bullets de información */}
              <div className="space-y-4 md:space-y-5 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-secondary-[bosques-nublados] font-primary">
                  ¿Qué encontrarás en la Ruta de Formación?
                </h3>
                <ul className="space-y-3 text-sm sm:text-base text-gray-700 font-primary">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-secondary-pradera" />
                    <p>
                      Módulos sobre <span className="font-semibold">tecnologías emergentes</span> y biotecnología aplicada a la reforestación.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <p>
                      Herramientas para la <span className="font-semibold">protección de cuencas de agua y suelos</span> en los Llanos Orientales.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
                    <p>
                      Acompañamiento a comunidades en procesos de <span className="font-semibold">formación y apropiación territorial</span>.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botón secundario */}
          <div className="text-center animate-fade-in-up delay-400">
            <Link to="/ruta-de-formacion" className="inline-block group">
              <div className="bg-[#f6f0d0]/95 px-6 py-4 sm:px-8 sm:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-secondary-[amarillo-tierra]/60 hover:border-secondary-pradera/70 group transform hover:scale-105">
                <span className="flex items-center justify-center gap-3 text-secondary-[bosques-nublados] group-hover:text-primary font-semibold text-base sm:text-lg font-primary transition-colors">
                  <svg className="w-5 h-5 text-secondary-pradera group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Conoce más sobre los cursos en nuestra "Ruta de Formación"</span>
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;


