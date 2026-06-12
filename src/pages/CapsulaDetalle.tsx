import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Status } from '../API';
import { GET_INFORMATIVE_CAPSULE } from '../graphql/capsulesVideoclips';
import { formatPublishedDateEs } from '../lib/adminHelpers';
import { getGraphqlClient } from '../lib/amplifySetup';
import {
  getContextTypeChipClasses,
  mapAmplifyCapsuleToPublic,
  type PublicCapsule,
} from '../lib/capsuleMapper';
import RelatedVideoclipSection from '../components/videoclip/RelatedVideoclipSection';
import { isWithinPublicationWindow } from '../lib/publicationWindow';

const CapsuleHeroCover = ({ capsule }: { capsule: PublicCapsule }) => {
  if (capsule.image) {
    return (
      <img
        src={capsule.image}
        alt={capsule.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#f5f2e7] via-white to-secondary-claro/25">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-[#44482c]/10 bg-white/90 text-secondary-[bosques-nublados] shadow-sm">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-secondary-[bosques-nublados]/70">
        {capsule.contextType}
      </span>
    </div>
  );
};

const CapsulaDetalle = () => {
  const { id } = useParams();
  const capsuleId = id ?? '';
  const [capsule, setCapsule] = useState<PublicCapsule | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      setCapsule(undefined);
      try {
        if (!capsuleId) {
          if (!cancelled) setCapsule(null);
          return;
        }

        const client = getGraphqlClient();
        const response: any = await client.graphql({
          query: GET_INFORMATIVE_CAPSULE,
          variables: { id: capsuleId },
          authMode: 'apiKey',
        });

        const item = response?.data?.getInformativeCapsule ?? null;
        if (!item || item.status !== Status.PUBLISHED || !isWithinPublicationWindow(item)) {
          if (!cancelled) setCapsule(null);
          return;
        }

        if (!cancelled) setCapsule(mapAmplifyCapsuleToPublic(item));
      } catch {
        if (!cancelled) setCapsule(null);
      }
    };

    void fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [capsuleId]);

  if (capsule === undefined) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Cargando cápsula...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!capsule) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-black text-secondary-[bosques-nublados]">Cápsula no encontrada</h1>
            <Link
              to="/capsulas-informativas"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Volver a cápsulas
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/capsulas-informativas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a cápsulas informativas
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-[4/3] min-h-[18rem] overflow-hidden sm:aspect-[16/10] sm:min-h-[20rem] lg:col-span-5 lg:aspect-auto lg:min-h-[28rem]">
              <CapsuleHeroCover capsule={capsule} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/10" />
              <div
                className={`absolute left-5 top-5 inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm ${getContextTypeChipClasses(capsule.contextType)}`}
              >
                {capsule.contextType}
              </div>
            </div>

            <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {capsule.category ?? 'Cápsula informativa'}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-4xl">
                {capsule.title}
              </h1>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {formatPublishedDateEs(capsule.publishedAt)}
              </p>
              <p className="mt-5 text-base leading-relaxed text-gray-700 sm:text-lg">{capsule.excerpt}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {capsule.institution ? (
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                    {capsule.institution}
                  </span>
                ) : null}
                {capsule.legalReference ? (
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                    {capsule.legalReference}
                  </span>
                ) : null}
                {capsule.attachmentUrls.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    {capsule.attachmentUrls.length}{' '}
                    {capsule.attachmentUrls.length === 1 ? 'documento adjunto' : 'documentos adjuntos'}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-gray-100 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                Contenido de la cápsula
              </h2>
              <div className="mt-6 space-y-5">
                {capsule.body.map((paragraph, index) => (
                  <p
                    key={`${capsule.id}-p-${index}`}
                    className="text-sm leading-relaxed text-gray-700 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#f5f2e7]/80 to-secondary-claro/15 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  Ficha de consulta
                </h2>
                <dl className="mt-4 space-y-3 text-sm text-gray-700">
                  <div>
                    <dt className="font-semibold text-secondary-[bosques-nublados]">Contexto</dt>
                    <dd>{capsule.contextType}</dd>
                  </div>
                  {capsule.legalReference ? (
                    <div>
                      <dt className="font-semibold text-secondary-[bosques-nublados]">Referencia legal</dt>
                      <dd>{capsule.legalReference}</dd>
                    </div>
                  ) : null}
                  {capsule.institution ? (
                    <div>
                      <dt className="font-semibold text-secondary-[bosques-nublados]">Institución</dt>
                      <dd>{capsule.institution}</dd>
                    </div>
                  ) : null}
                  {capsule.category ? (
                    <div>
                      <dt className="font-semibold text-secondary-[bosques-nublados]">Categoría</dt>
                      <dd>{capsule.category}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {capsule.attachmentUrls.length > 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                    Documentos
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {capsule.attachmentUrls.map((url, index) => (
                      <li key={`${capsule.id}-att-${index}`}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Ver documento {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <div className="border-t border-gray-100 px-6 pb-6 sm:px-8 lg:px-10 lg:pb-10">
            <RelatedVideoclipSection relationType="capsule" relatedId={capsuleId} />
          </div>
        </article>
      </section>
    </main>
  );
};

export default CapsulaDetalle;
