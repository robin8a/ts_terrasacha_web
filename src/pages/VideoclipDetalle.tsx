import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Status } from '../API';
import VideoclipMediaPlayer from '../components/videoclip/VideoclipMediaPlayer';
import { educationalVideoclipBySlug } from '../graphql/queries';
import { formatPublishedDateEs } from '../lib/adminHelpers';
import { getGraphqlClient } from '../lib/amplifySetup';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { mapAmplifyVideoclipToPublic, type PublicVideoclip } from '../lib/videoclipMapper';

const VideoclipDetalle = () => {
  const { slug } = useParams();
  const videoclipSlug = slug ?? '';
  const [videoclip, setVideoclip] = useState<PublicVideoclip | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      setVideoclip(undefined);
      try {
        if (!videoclipSlug) {
          if (!cancelled) setVideoclip(null);
          return;
        }

        const client = getGraphqlClient();
        const response: any = await client.graphql({
          query: educationalVideoclipBySlug,
          variables: {
            slug: videoclipSlug,
            filter: { status: { eq: Status.PUBLISHED } },
            limit: 1,
          },
          authMode: 'apiKey',
        });

        const item = response?.data?.educationalVideoclipBySlug?.items?.[0] ?? null;
        if (!item || !isWithinPublicationWindow(item)) {
          if (!cancelled) setVideoclip(null);
          return;
        }

        const mapped = mapAmplifyVideoclipToPublic(item);
        if (!cancelled) setVideoclip(mapped ?? null);
      } catch {
        if (!cancelled) setVideoclip(null);
      }
    };

    void fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [videoclipSlug]);

  if (videoclip === undefined) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Cargando videoclip...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!videoclip) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-black text-secondary-[bosques-nublados]">Videoclip no encontrado</h1>
            <Link
              to="/videoclips-educativos"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Volver a videoclips
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
          to="/videoclips-educativos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a videoclips educativos
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-3xl">
              <VideoclipMediaPlayer videoclip={videoclip} />
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Videoclip educativo</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black text-secondary-[bosques-nublados]">
                {videoclip.title}
              </h1>
              <p className="mt-3 text-sm text-gray-500">{formatPublishedDateEs(videoclip.publishedAt)}</p>
              {videoclip.topicCategory ? (
                <span className="mt-4 inline-flex rounded-full border border-secondary-pradera/30 bg-secondary-pradera/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  {videoclip.topicCategory}
                </span>
              ) : null}
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-gray-700">{videoclip.summary}</p>

            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default VideoclipDetalle;
