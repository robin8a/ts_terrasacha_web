import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Status } from '../API';
import { getGraphqlClient } from '../lib/amplifySetup';
import PodcastEpisodeShowcase from '../components/podcast/PodcastEpisodeShowcase';
import { mapAmplifyPodcastToPublic, type PublicPodcast } from '../lib/podcastMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';

const PODCAST_BY_SLUG = /* GraphQL */ `
  query PodcastBySlug(
    $slug: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPodcastEpisodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    podcastEpisodeBySlug(
      slug: $slug
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        slug
        description
        audioUrl
        externalPlayerUrl
        coverImageUrl
        publishedAt
        createdAt
        highlight
        relatedNewsIds
        relatedAnnouncementIds
        relatedResearchIds
      }
    }
  }
`;

const LIST_RELATED_NEWS = /* GraphQL */ `
  query ListRelatedNews($filter: ModelNewsFilterInput, $limit: Int, $nextToken: String) {
    listNews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        summary
      }
      nextToken
    }
  }
`;

const LIST_RELATED_ANNOUNCEMENTS = /* GraphQL */ `
  query ListRelatedAnnouncements($filter: ModelAnnouncementFilterInput, $limit: Int, $nextToken: String) {
    listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        summary
      }
      nextToken
    }
  }
`;

const LIST_RELATED_RESEARCH = /* GraphQL */ `
  query ListRelatedResearch($filter: ModelResearchItemFilterInput, $limit: Int, $nextToken: String) {
    listResearchItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        slug
        title
        summary
      }
      nextToken
    }
  }
`;

type RelatedEntry = {
  id: string;
  title: string;
  summary: string;
  href: string;
};

type RelatedContentState = {
  news: RelatedEntry[];
  announcements: RelatedEntry[];
  research: RelatedEntry[];
};

const EMPTY_RELATED_CONTENT: RelatedContentState = {
  news: [],
  announcements: [],
  research: [],
};

const PodcastDetail = () => {
  const { slug } = useParams();
  const podcastSlug = slug ?? '';
  const [podcast, setPodcast] = useState<PublicPodcast | null | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<RelatedContentState>(EMPTY_RELATED_CONTENT);
  const relatedCarouselsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    const fetchPodcast = async () => {
      if (!podcastSlug) {
        if (!cancelled) setPodcast(null);
        return;
      }

      try {
        const client = getGraphqlClient();
        const response: any = await client.graphql({
          query: PODCAST_BY_SLUG,
          variables: {
            slug: podcastSlug,
            limit: 1,
            filter: { status: { eq: Status.PUBLISHED } },
          },
          authMode: 'apiKey',
        });

        const item = response?.data?.podcastEpisodeBySlug?.items?.[0] ?? null;
        if (!cancelled) {
          setPodcast(item && isWithinPublicationWindow(item) ? mapAmplifyPodcastToPublic(item) : null);
        }
      } catch {
        if (!cancelled) {
          setPodcast(null);
        }
      }
    };

    void fetchPodcast();

    return () => {
      cancelled = true;
    };
  }, [podcastSlug]);

  useEffect(() => {
    let cancelled = false;

    const fetchRelatedContent = async () => {
      if (!podcast) {
        if (!cancelled) setRelatedContent(EMPTY_RELATED_CONTENT);
        return;
      }

      const newsIds = new Set(podcast.relatedNewsIds.map((id) => id.trim()));
      const announcementIds = new Set(podcast.relatedAnnouncementIds.map((id) => id.trim()));
      const researchIds = new Set(podcast.relatedResearchIds.map((id) => id.trim()));
      if (newsIds.size === 0 && announcementIds.size === 0 && researchIds.size === 0) {
        if (!cancelled) setRelatedContent(EMPTY_RELATED_CONTENT);
        return;
      }

      try {
        const client = getGraphqlClient();
        const [newsRes, announcementsRes, researchRes]: [any, any, any] = await Promise.all([
          client.graphql({
            query: LIST_RELATED_NEWS,
            variables: { filter: { status: { eq: Status.PUBLISHED } }, limit: 1000 },
            authMode: 'apiKey',
          }),
          client.graphql({
            query: LIST_RELATED_ANNOUNCEMENTS,
            variables: { filter: { status: { eq: Status.PUBLISHED } }, limit: 1000 },
            authMode: 'apiKey',
          }),
          client.graphql({
            query: LIST_RELATED_RESEARCH,
            variables: { filter: { status: { eq: Status.PUBLISHED } }, limit: 1000 },
            authMode: 'apiKey',
          }),
        ]);

        const nextNews: RelatedEntry[] = (newsRes?.data?.listNews?.items ?? [])
          .filter((item: any) => item?.id && newsIds.has(String(item.id)) && isWithinPublicationWindow(item))
          .map((item: any) => ({
            id: String(item.id),
            title: String(item.title ?? ''),
            summary: String(item.summary ?? ''),
            href: `/noticias/${item.id}`,
          }));

        const nextAnnouncements: RelatedEntry[] = (announcementsRes?.data?.listAnnouncements?.items ?? [])
          .filter((item: any) => item?.id && announcementIds.has(String(item.id)) && isWithinPublicationWindow(item))
          .map((item: any) => ({
            id: String(item.id),
            title: String(item.title ?? ''),
            summary: String(item.summary ?? ''),
            href: `/comunicados/${item.id}`,
          }));

        const nextResearch: RelatedEntry[] = (researchRes?.data?.listResearchItems?.items ?? [])
          .filter((item: any) => item?.id && researchIds.has(String(item.id)) && isWithinPublicationWindow(item))
          .map((item: any) => ({
            id: String(item.id),
            title: String(item.title ?? ''),
            summary: String(item.summary ?? ''),
            href: `/investigacion/${item.slug}`,
          }));

        if (!cancelled) {
          setRelatedContent({
            news: nextNews,
            announcements: nextAnnouncements,
            research: nextResearch,
          });
        }
      } catch {
        if (!cancelled) setRelatedContent(EMPTY_RELATED_CONTENT);
      }
    };

    void fetchRelatedContent();

    return () => {
      cancelled = true;
    };
  }, [podcast]);

  if (podcast === undefined) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Podcast</p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">Cargando...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!podcast) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Podcast</p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">
              Episodio no encontrado
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              El podcast solicitado no existe, no está publicado o fue movido.
            </p>
            <Link
              to="/podcast"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Volver a podcast
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const relatedSections = [
    { key: 'news', title: 'Noticias relacionadas', entries: relatedContent.news },
    { key: 'announcements', title: 'Comunicados relacionados', entries: relatedContent.announcements },
    { key: 'research', title: 'Investigación relacionada', entries: relatedContent.research },
  ].filter((section) => section.entries.length > 0);

  const handleScrollRelated = (sectionKey: string, direction: 'prev' | 'next') => {
    const container = relatedCarouselsRef.current[sectionKey];
    if (!container) return;
    const amount = Math.max(280, Math.floor(container.clientWidth * 0.85));
    container.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/podcast"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a podcast
        </Link>

        <div className="mt-6">
          <PodcastEpisodeShowcase
            podcast={podcast}
            badgeLabel="Episodio"
            headingLevel="h1"
            formatDate={(value) =>
              value
                ? new Date(value).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''
            }
          />
        </div>

        {relatedSections.length > 0 && (
          <article className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">CONTENIDO</span>{' '}
              <span className="text-primary">RELACIONADO</span>
            </h2>

            <div className="mt-4 space-y-5">
              {relatedSections.map((section) => (
                <div key={section.key}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                      {section.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleScrollRelated(section.key, 'prev')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary hover:text-primary"
                        aria-label={`Desplazar ${section.title} hacia la izquierda`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScrollRelated(section.key, 'next')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary hover:text-primary"
                        aria-label={`Desplazar ${section.title} hacia la derecha`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div
                    ref={(node) => {
                      relatedCarouselsRef.current[section.key] = node;
                    }}
                    className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
                  >
                    {section.entries.map((entry) => (
                      <article
                        key={entry.id}
                        className="w-[86%] min-w-[86%] snap-start rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary/40 sm:w-[48%] sm:min-w-[48%] lg:w-[37%] lg:min-w-[37%]"
                      >
                        <h3 className="text-sm font-bold leading-snug text-secondary-[bosques-nublados]">
                          {entry.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                          {entry.summary}
                        </p>
                        <Link
                          to={entry.href}
                          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary-dark"
                        >
                          Ver publicación
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default PodcastDetail;
