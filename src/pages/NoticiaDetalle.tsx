import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNews } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyNewsToNoticia } from '../lib/newsMapper';
import type { Noticia } from '../data/noticias';

const getCategoryBadgeClasses = (category?: string) => {
  const map: Record<string, string> = {
    'Tecnología': 'bg-primary text-white',
    'Innovación': 'bg-secondary-pradera text-white',
    'Sostenibilidad': 'bg-secondary-claro text-white',
    'Alianzas': 'bg-secondary-[amarillo-tierra] text-white',
    'Impacto': 'bg-secondary-[bosques-nublados] text-white',
  };

  return map[category || ''] || 'bg-gray-700 text-white';
};

const HASHTAG_REGEX = /#[^\s#.,;:!?()[\]{}"']+/g;
const HASHTAG_ONLY_LINE_REGEX = /^(?:#[^\s#.,;:!?()[\]{}"']+\s*)+$/;

const NoticiaDetalle = () => {
  const { id } = useParams();
  const noticiaId = id ?? '';
  const [noticia, setNoticia] = useState<Noticia | null | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllTags, setShowAllTags] = useState(false);
  const carouselImages = useMemo(() => {
    if (!noticia) {
      return [];
    }

    const images = [
      ...(noticia.image ? [noticia.image] : []),
      ...(noticia.gallery ?? []),
    ];

    return images.filter((image, index) => images.indexOf(image) === index);
  }, [noticia]);

  const hasMultipleImages = carouselImages.length > 1;
  const detailContent = noticia?.content ?? [];
  const parsedDetail = useMemo(() => {
    const tagsSet = new Set<string>();

    detailContent.forEach((paragraph) => {
      const matches = paragraph.match(HASHTAG_REGEX) ?? [];
      matches.forEach((tag) => tagsSet.add(tag));
    });

    const contentParagraphs = detailContent.filter((paragraph) => {
      const normalized = paragraph.trim();
      if (!normalized) return false;
      return !HASHTAG_ONLY_LINE_REGEX.test(normalized);
    });

    return {
      contentParagraphs,
      tags: Array.from(tagsSet),
    };
  }, [detailContent]);
  const visibleTags = showAllTags ? parsedDetail.tags : parsedDetail.tags.slice(0, 8);

  useEffect(() => {
    let cancelled = false;

    const fetchNoticia = async () => {
      setNoticia(undefined);
      try {
        const client = getGraphqlClient();

        if (!noticiaId) {
          setNoticia(null);
          return;
        }

        const res = await client.graphql({
          query: getNews,
          variables: { id: noticiaId },
          authMode: 'apiKey',
        });

        const item = res?.data?.getNews ?? null;
        if (!item) {
          if (!cancelled) setNoticia(null);
          return;
        }

        const mapped = mapAmplifyNewsToNoticia(item);
        if (!cancelled) setNoticia(mapped);
      } catch (err) {
        if (!cancelled) setNoticia(null);
      }
    };

    void fetchNoticia();
    return () => {
      cancelled = true;
    };
  }, [noticiaId]);

  useEffect(() => {
    setShowAllTags(false);
  }, [noticiaId]);

  if (noticia === undefined) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Noticias
            </p>
            <h1 className="mt-3 text-3xl font-bold text-secondary-[bosques-nublados]">
              Cargando...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!noticia) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Noticias
            </p>
            <h1 className="mt-3 text-3xl font-bold text-secondary-[bosques-nublados]">
              Noticia no encontrada
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              La noticia que intentas abrir no existe o fue movida.
            </p>
            <Link
              to="/noticias"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Volver a noticias
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const handlePreviousImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveImageIndex((currentIndex) => (
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    ));
  };

  const handleNextImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveImageIndex((currentIndex) => (
      currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
    ));
  };

  const handleSelectImage = (selectedIndex: number) => {
    setActiveImageIndex(selectedIndex);
  };

  return (
    <main className="font-primary bg-gray-50 min-h-screen py-16">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/noticias"
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
          Volver a noticias
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {carouselImages.length > 0 && (
            <div className="border-b border-gray-100 bg-gray-950/5">
              <div className="relative h-72 sm:h-80 lg:h-[28rem] overflow-hidden">
                <img
                  src={carouselImages[activeImageIndex]}
                  alt={`${noticia.title} - imagen ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                {noticia.category && (
                  <span
                    className={`absolute left-5 top-5 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${getCategoryBadgeClasses(
                      noticia.category
                    )}`}
                  >
                    {noticia.category}
                  </span>
                )}

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                      aria-label="Ver imagen anterior"
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
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                      aria-label="Ver imagen siguiente"
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

                    <div className="absolute bottom-5 right-5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                      {activeImageIndex + 1} / {carouselImages.length}
                    </div>
                  </>
                )}
              </div>

              {hasMultipleImages && (
                <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 py-4 sm:px-6">
                  {carouselImages.map((image, index) => {
                    const isActive = index === activeImageIndex;

                    return (
                      <button
                        key={`${noticia.id}-thumbnail-${index}`}
                        type="button"
                        onClick={() => handleSelectImage(index)}
                        className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          isActive
                            ? 'border-primary shadow-md'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        aria-label={`Ver imagen ${index + 1} de la noticia`}
                      >
                        <img
                          src={image}
                          alt={`${noticia.title} - miniatura ${index + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-medium text-gray-500">{noticia.date}</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-secondary-[bosques-nublados]">
              {noticia.title}
            </h1>
            {parsedDetail.contentParagraphs.length > 0 && (
              <div className="mt-8 space-y-4 border-t border-gray-100 pt-8">
                {parsedDetail.contentParagraphs.map((paragraph, index) => (
                  <p
                    key={`${noticia.id}-content-${index}`}
                    className="text-sm sm:text-base leading-relaxed text-gray-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {parsedDetail.tags.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  Etiquetas
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {visibleTags.map((tag) => (
                    <span
                      key={`${noticia.id}-${tag}`}
                      className="inline-flex rounded-full border border-secondary-claro/40 bg-secondary-claro/15 px-3 py-1 text-xs font-semibold text-secondary-[bosques-nublados]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {parsedDetail.tags.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTags((prev) => !prev)}
                    className="mt-3 text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    {showAllTags ? 'Ver menos' : `Ver más (${parsedDetail.tags.length - 8})`}
                  </button>
                )}
              </div>
            )}

            {noticia.video && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
                  <span className="text-secondary-[bosques-nublados]">VIDEO</span>{' '}
                  <span className="text-primary">DE LA PUBLICACIÓN</span>
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-black shadow-sm">
                  <video
                    className="w-full"
                    controls
                    preload="metadata"
                    poster={noticia.image}
                  >
                    <source src={noticia.video} type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default NoticiaDetalle;
