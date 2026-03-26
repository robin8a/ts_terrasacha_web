import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAnnouncement } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyAnnouncementToPublic, type PublicAnnouncement } from '../lib/announcementMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import RelatedPodcastSection from '../components/podcast/RelatedPodcastSection';

const ComunicadoDetalle = () => {
  const { id } = useParams();
  const comunicadoId = id ?? '';
  const [comunicado, setComunicado] = useState<PublicAnnouncement | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const fetchDetail = async () => {
      setComunicado(undefined);
      try {
        if (!comunicadoId) {
          if (!cancelled) setComunicado(null);
          return;
        }

        const client = getGraphqlClient();
        const res: any = await client.graphql({
          query: getAnnouncement,
          variables: { id: comunicadoId },
          authMode: 'apiKey',
        });
        const item = res?.data?.getAnnouncement ?? null;
        if (!item) {
          if (!cancelled) setComunicado(null);
          return;
        }
        if (!isWithinPublicationWindow(item)) {
          if (!cancelled) setComunicado(null);
          return;
        }
        if (!cancelled) setComunicado(mapAmplifyAnnouncementToPublic(item));
      } catch {
        if (!cancelled) setComunicado(null);
      }
    };
    void fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [comunicadoId]);

  if (comunicado === undefined) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Comunicados</p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">Cargando...</h1>
          </div>
        </section>
      </main>
    );
  }

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

  const normalizedExcerpt = comunicado.excerpt.trim().replace(/\s+/g, ' ');
  const normalizedExcerptForCompare = normalizedExcerpt.replace(/[.\u2026]+$/g, '').trim();
  const normalizedFirstParagraph = (comunicado.body[0] ?? '').trim().replace(/\s+/g, ' ');
  const isExcerptDuplicatedInBody =
    normalizedExcerptForCompare.length > 0
      && normalizedFirstParagraph.length > 0
      && (
        normalizedFirstParagraph.toLowerCase() === normalizedExcerptForCompare.toLowerCase()
        || normalizedFirstParagraph.toLowerCase().startsWith(normalizedExcerptForCompare.toLowerCase())
      );
  const detailParagraphs = isExcerptDuplicatedInBody ? comunicado.body.slice(1) : comunicado.body;

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
              Comunicado oficial
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {comunicado.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-secondary-[bosques-nublados]">
              {comunicado.title}
            </h1>
            {normalizedExcerpt && (
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-secondary-bosques-nublados">
                {comunicado.excerpt}
              </p>
            )}

            <div className="mt-8 space-y-5 border-t border-gray-100 pt-8">
              {detailParagraphs.map((paragraph, index) => (
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
                  hola@terrasacha.com
                </p>
                <p>
                  <span className="font-semibold text-secondary-[bosques-nublados]">
                    Web:
                  </span>{' '}
                  www.terrasacha.com
                </p>
              </div>
            </div>

            <RelatedPodcastSection relationType="announcement" relatedId={comunicado.id} />
          </div>
        </article>
      </section>
    </main>
  );
};

export default ComunicadoDetalle;
