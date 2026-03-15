import { Link, useParams } from 'react-router-dom';
import { getComunicadoById } from '../data/comunicados';

const ComunicadoDetalle = () => {
  const { id } = useParams();
  const comunicadoId = Number(id);
  const comunicado = Number.isNaN(comunicadoId)
    ? undefined
    : getComunicadoById(comunicadoId);

  if (!comunicado) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Comunicados
            </p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">
              Comunicado no encontrado
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              El comunicado solicitado no existe o fue movido.
            </p>
            <Link
              to="/comunicados"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Volver a comunicados
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="font-primary bg-gray-50 min-h-screen py-16">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/comunicados"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a comunicados
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="relative h-80 sm:h-96 overflow-hidden">
            <img
              src={comunicado.image}
              alt={comunicado.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/85 via-secondary-[bosques-nublados]/25 to-transparent" />
            <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
              Comunicado #{comunicado.number}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {comunicado.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-secondary-[bosques-nublados]">
              {comunicado.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-700">
              {comunicado.excerpt}
            </p>

            {comunicado.highlights && comunicado.highlights.length > 0 && (
              <div className="mt-8 rounded-2xl border border-secondary-[amarillo-tierra]/40 bg-secondary-[amarillo-tierra]/10 p-5 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  Puntos clave
                </h2>
                <ul className="mt-4 space-y-3">
                  {comunicado.highlights.map((highlight, index) => (
                    <li
                      key={`${comunicado.id}-highlight-${index}`}
                      className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-gray-700"
                    >
                      <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 space-y-5 border-t border-gray-100 pt-8">
              {comunicado.body.map((paragraph, index) => (
                <p
                  key={`${comunicado.id}-paragraph-${index}`}
                  className="text-sm sm:text-base leading-relaxed text-gray-700"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-secondary-claro/10 p-5 sm:p-6">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                Contacto
              </h2>
              <div className="mt-4 space-y-2 text-sm sm:text-base text-gray-700">
                <p>
                  <span className="font-semibold text-secondary-[bosques-nublados]">
                    Email:
                  </span>{' '}
                  {comunicado.contactEmail}
                </p>
                <p>
                  <span className="font-semibold text-secondary-[bosques-nublados]">
                    Web:
                  </span>{' '}
                  {comunicado.contactWeb}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default ComunicadoDetalle;
