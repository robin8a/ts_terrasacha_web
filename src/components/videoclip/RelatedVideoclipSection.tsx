import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Status } from '../../API';
import { LIST_EDUCATIONAL_VIDEOCLIPS } from '../../graphql/capsulesVideoclips';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { isWithinPublicationWindow } from '../../lib/publicationWindow';
import {
  mapAmplifyVideoclipToPublic,
  videoclipMatchesRelation,
  type PublicVideoclip,
  type VideoclipRelationType,
} from '../../lib/videoclipMapper';

type RelatedVideoclipSectionProps = {
  relationType: VideoclipRelationType;
  relatedId: string;
};

const RelatedVideoclipSection = ({ relationType, relatedId }: RelatedVideoclipSectionProps) => {
  const [videoclips, setVideoclips] = useState<PublicVideoclip[] | null>(null);
  const [hasLinkedButUnavailable, setHasLinkedButUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchRelatedVideoclips = async () => {
      if (!relatedId) {
        if (!cancelled) setVideoclips([]);
        return;
      }

      try {
        const client = getGraphqlClient();
        const collected: unknown[] = [];
        let nextToken: string | null = null;

        do {
          const response: any = await client.graphql({
            query: LIST_EDUCATIONAL_VIDEOCLIPS,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = response?.data?.listEducationalVideoclips?.items ?? [];
          collected.push(...items);
          nextToken = response?.data?.listEducationalVideoclips?.nextToken ?? null;
        } while (nextToken);

        const relatedCandidates = collected
          .map(mapAmplifyVideoclipToPublic)
          .filter((item): item is PublicVideoclip => item !== null)
          .filter((item) => videoclipMatchesRelation(item, relationType, relatedId));

        const relatedVideoclips = relatedCandidates
          .filter((item) => {
            const source = collected.find((raw) => String((raw as { id?: string })?.id ?? '') === item.id);
            if (!source || !isWithinPublicationWindow(source as { publishedAt?: string | null })) return false;
            return true;
          })
          .sort((a, b) => {
            const highlightDiff = Number(b.highlight) - Number(a.highlight);
            if (highlightDiff !== 0) return highlightDiff;
            const aTime = new Date(a.publishedAt ?? 0).getTime();
            const bTime = new Date(b.publishedAt ?? 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) {
          setVideoclips(relatedVideoclips);
          setHasLinkedButUnavailable(relatedCandidates.length > 0 && relatedVideoclips.length === 0);
        }
      } catch {
        if (!cancelled) {
          setVideoclips([]);
          setHasLinkedButUnavailable(false);
        }
      }
    };

    void fetchRelatedVideoclips();

    return () => {
      cancelled = true;
    };
  }, [relatedId, relationType]);

  if (videoclips === null) {
    return null;
  }

  if (videoclips.length === 0 && !hasLinkedButUnavailable) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
        <span className="text-secondary-[bosques-nublados]">VIDEOCLIP</span>{' '}
        <span className="text-primary">RELACIONADO</span>
      </h2>

      {videoclips.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {videoclips.map((videoclip) => (
            <article
              key={videoclip.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-secondary-[bosques-nublados]">
                <img
                  src={videoclip.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md">
                    <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex min-h-[9.5rem] flex-1 flex-col p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {videoclip.topicCategory ?? 'Videoclip educativo'}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-secondary-[bosques-nublados] [overflow-wrap:anywhere]">
                    {videoclip.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {videoclip.summary}
                  </p>
                  <Link
                    to={`/videoclips-educativos/${videoclip.slug}`}
                    className="mt-auto inline-flex w-fit rounded-full border border-primary px-4 py-2 pt-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Ver videoclip
                  </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-secondary-claro/40 bg-secondary-claro/10 px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
            Hay un videoclip vinculado a esta publicación.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            El videoclip relacionado aún no está publicado o disponible. Mientras tanto, puedes explorar otros
            videoclips educativos.
          </p>
          <Link
            to="/videoclips-educativos"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Ir a videoclips
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedVideoclipSection;
