import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGraphqlClient } from '../../lib/amplifySetup';
import {
  mapAmplifyPodcastToPublic,
  podcastMatchesRelation,
  type PodcastRelationType,
  type PublicPodcast,
} from '../../lib/podcastMapper';
import { isWithinPublicationWindow } from '../../lib/publicationWindow';

const LIST_RELATED_PODCASTS = /* GraphQL */ `
  query ListRelatedPodcasts($filter: ModelPodcastEpisodeFilterInput, $limit: Int, $nextToken: String) {
    listPodcastEpisodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        slug
        description
        audioUrl
        externalPlayerUrl
        coverImageUrl
        relatedNewsIds
        relatedAnnouncementIds
        relatedResearchIds
        status
        publishedAt
        createdAt
        highlight
      }
      nextToken
    }
  }
`;

type RelatedPodcastSectionProps = {
  relationType: PodcastRelationType;
  relatedId: string;
};

const RelatedPodcastSection = ({ relationType, relatedId }: RelatedPodcastSectionProps) => {
  const [podcasts, setPodcasts] = useState<PublicPodcast[] | null>(null);
  const [hasLinkedButUnavailable, setHasLinkedButUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchRelatedPodcasts = async () => {
      if (!relatedId) {
        if (!cancelled) setPodcasts([]);
        return;
      }

      try {
        const client = getGraphqlClient();
        const collected: any[] = [];
        let nextToken: string | null = null;

        do {
          const response: any = await client.graphql({
            query: LIST_RELATED_PODCASTS,
            variables: {
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = response?.data?.listPodcastEpisodes?.items ?? [];
          collected.push(...items);
          nextToken = response?.data?.listPodcastEpisodes?.nextToken ?? null;
        } while (nextToken);

        const relatedCandidates = collected
          .map(mapAmplifyPodcastToPublic)
          .filter((podcast) => podcastMatchesRelation(podcast, relationType, relatedId));

        const relatedPodcasts = relatedCandidates
          .filter((item) => {
            const source = collected.find((raw) => String(raw?.id ?? '') === item.id);
            const status = String(source?.status ?? '').toUpperCase();
            if (status !== 'PUBLISHED') return false;
            if (!source || !isWithinPublicationWindow(source)) return false;

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
          setPodcasts(relatedPodcasts);
          setHasLinkedButUnavailable(relatedCandidates.length > 0 && relatedPodcasts.length === 0);
        }
      } catch {
        if (!cancelled) {
          setPodcasts([]);
          setHasLinkedButUnavailable(false);
        }
      }
    };

    void fetchRelatedPodcasts();

    return () => {
      cancelled = true;
    };
  }, [relatedId, relationType]);

  if (podcasts === null) {
    return null;
  }

  if (podcasts.length === 0 && !hasLinkedButUnavailable) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
        <span className="text-secondary-[bosques-nublados]">PODCAST</span>{' '}
        <span className="text-primary">RELACIONADO</span>
      </h2>

      {podcasts.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {podcasts.map((podcast) => (
            <article
              key={podcast.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)]">
                <div className="h-40 sm:h-full">
                  {podcast.coverImageUrl ? (
                    <img
                      src={podcast.coverImageUrl}
                      alt={podcast.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary-claro/30 to-[#e8d79a]">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]">
                        Podcast
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Podcast Terrasacha
                  </p>
                  <h3 className="mt-2 text-lg font-black leading-snug text-secondary-[bosques-nublados] [overflow-wrap:anywhere]">
                    {podcast.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {podcast.summary}
                  </p>
                  <Link
                    to={`/podcast/${podcast.slug}`}
                    className="mt-4 inline-flex rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Escuchar podcast
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-secondary-claro/40 bg-secondary-claro/10 px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
            {hasLinkedButUnavailable
              ? 'Aquí en este podcast puedes encontrar más información y alcance de la noticia.'
              : 'Aquí en este podcast puedes encontrar más información y alcance de la noticia.'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {hasLinkedButUnavailable
              ? 'El episodio relacionado aún no está en estado Publicado. Mientras tanto, puedes explorar otros episodios.'
              : 'Aún no hay un episodio vinculado a esta publicación. Puedes explorar los podcasts disponibles.'}
          </p>
          <Link
            to="/podcast"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Ir a Podcast
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedPodcastSection;
