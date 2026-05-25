import type { ReactNode } from 'react';
import PodcastPlayer from './PodcastPlayer';
import type { PublicPodcast } from '../../lib/podcastMapper';

type PodcastEpisodeShowcaseProps = {
  podcast: PublicPodcast;
  badgeLabel?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  formatDate: (value?: string | null) => string;
  actions?: ReactNode;
};

const PodcastEpisodeShowcase = ({
  podcast,
  badgeLabel = 'Episodio',
  headingLevel = 'h3',
  formatDate,
  actions,
}: PodcastEpisodeShowcaseProps) => {
  const Heading = headingLevel;
  const hasVideo = Boolean(podcast.youtubeEmbedUrl);

  const metaChips = (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {!hasVideo ? (
        <span className="inline-flex rounded-full bg-secondary-[amarillo-tierra] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary-[bosques-nublados]">
          {badgeLabel}
        </span>
      ) : null}
      {podcast.publishedAt ? (
        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
          {formatDate(podcast.publishedAt)}
        </span>
      ) : null}
      {podcast.highlight ? (
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          Destacado
        </span>
      ) : null}
    </div>
  );

  const metadataBlock = (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      {podcast.coverImageUrl ? (
        <div className="flex-shrink-0">
          <img
            src={podcast.coverImageUrl}
            alt=""
            className="h-24 w-24 rounded-2xl border border-gray-100 object-cover shadow-sm sm:h-28 sm:w-28"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Podcast Terrasacha
        </p>
        <Heading className="mt-3 text-2xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-3xl">
          {podcast.title}
        </Heading>

        {metaChips}

        {podcast.summary ? (
          <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
            {podcast.summary}
          </p>
        ) : null}

        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );

  if (hasVideo) {
    return (
      <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="relative bg-secondary-[bosques-nublados]">
          <PodcastPlayer podcast={podcast} title={podcast.title} variant="hero" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary-[bosques-nublados]/50 to-transparent" />
          <span className="absolute left-4 top-4 z-10 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados] shadow-sm">
            {badgeLabel}
          </span>
        </div>

        <div className="border-t border-gray-100 bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8">
          {metadataBlock}
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {podcast.coverImageUrl ? (
          <div className="relative min-h-[16rem] overflow-hidden lg:col-span-5 lg:min-h-[20rem]">
            <img
              src={podcast.coverImageUrl}
              alt={podcast.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/70 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
              {badgeLabel}
            </span>
          </div>
        ) : null}

        <div
          className={`flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:p-10 ${
            podcast.coverImageUrl ? 'lg:col-span-7' : 'lg:col-span-12'
          }`}
        >
          {!podcast.coverImageUrl ? (
            <span className="mb-4 inline-flex w-fit rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
              {badgeLabel}
            </span>
          ) : null}

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Podcast Terrasacha
          </p>
          <Heading className="mt-3 text-2xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-3xl">
            {podcast.title}
          </Heading>

          {podcast.publishedAt ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Publicado: {formatDate(podcast.publishedAt)}
            </p>
          ) : null}

          {podcast.summary ? (
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
              {podcast.summary}
            </p>
          ) : null}

          <div className="mt-6">
            <PodcastPlayer podcast={podcast} title={podcast.title} />
          </div>

          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
};

export default PodcastEpisodeShowcase;
