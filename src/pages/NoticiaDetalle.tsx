import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNews } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyNewsToNoticia } from '../lib/newsMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import RelatedPodcastSection from '../components/podcast/RelatedPodcastSection';
import RelatedVideoclipSection from '../components/videoclip/RelatedVideoclipSection';
import type { Noticia } from '../data/noticias';

const HASHTAG_ONLY_LINE_REGEX = /^(?:#[^\s#.,;:!?()[\]{}"']+\s*)+$/;
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

const NoticiaDetalle = () => {
  const { id } = useParams();
  const noticiaId = id ?? '';
  const [noticia, setNoticia] = useState<Noticia | null | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
    const contentParagraphs = detailContent.filter((paragraph) => {
      const normalized = paragraph.trim();
      if (!normalized) return false;
      return !HASHTAG_ONLY_LINE_REGEX.test(normalized);
    });

    return {
      contentParagraphs: contentParagraphs
        .map((paragraph) => paragraph.replace(EMOJI_REGEX, '').trim())
        .filter((paragraph) => paragraph.length > 0),
    };
  }, [detailContent]);

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
        if (!isWithinPublicationWindow(item)) {
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

  if (noticia === undefined) {
    return (
      <main className="font-primary bg-gray-50 min-h-screen py-16">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/noticias"
          className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
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
                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                      aria-label="Ver imagen anterior"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wide">Ant</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                      aria-label="Ver imagen siguiente"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wide">Sig</span>
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

            {(noticia.youtubeEmbedUrl || noticia.video) && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
                  <span className="text-secondary-[bosques-nublados]">VIDEO</span>{' '}
                  <span className="text-primary">DE LA PUBLICACIÓN</span>
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-black shadow-sm">
                  {noticia.youtubeEmbedUrl ? (
                    <div className="aspect-video w-full">
                      <iframe
                        className="h-full w-full"
                        src={noticia.youtubeEmbedUrl}
                        title={`Video de YouTube de ${noticia.title}`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      className="w-full"
                      controls
                      preload="metadata"
                      poster={noticia.image}
                    >
                      <source src={noticia.video} type="video/mp4" />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  )}
                </div>
              </div>
            )}

            <RelatedPodcastSection relationType="news" relatedId={String(noticia.id)} />
            <RelatedVideoclipSection relationType="news" relatedId={String(noticia.id)} />
          </div>
        </article>
      </section>
    </main>
  );
};

export default NoticiaDetalle;
