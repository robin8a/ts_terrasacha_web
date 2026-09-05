import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  FAQ_CATEGORIES,
  type FaqAnswerPart,
  type FaqCategoryId,
  type FaqItem,
} from '../data/faq';

type ActiveCategory = 'all' | FaqCategoryId;

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const answerToSearchText = (parts: FaqAnswerPart[]) =>
  parts
    .map((part) => {
      if (part.type === 'ul' || part.type === 'ol') {
        return part.items.join(' ');
      }
      return part.text;
    })
    .join(' ');

const FaqAnswer = ({ parts }: { parts: FaqAnswerPart[] }) => (
  <div className="space-y-3 text-sm leading-relaxed text-[#44482c]/85 sm:text-[0.95rem]">
    {parts.map((part, index) => {
      if (part.type === 'h') {
        return (
          <h4
            key={`h-${index}`}
            className="pt-1 text-sm font-bold uppercase tracking-wide text-[#44482c]"
          >
            {part.text}
          </h4>
        );
      }

      if (part.type === 'ul') {
        return (
          <ul key={`ul-${index}`} className="list-disc space-y-1.5 pl-5">
            {part.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      }

      if (part.type === 'ol') {
        return (
          <ol key={`ol-${index}`} className="list-decimal space-y-1.5 pl-5">
            {part.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        );
      }

      if (part.type === 'note') {
        return (
          <p
            key={`note-${index}`}
            className="rounded-xl border border-[#44482c]/10 bg-[#e8d79a]/35 px-3 py-2 text-sm text-[#44482c]/90"
          >
            {part.text}
          </p>
        );
      }

      return <p key={`p-${index}`}>{part.text}</p>;
    })}
  </div>
);

const FaqAccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const panelId = useId();
  const buttonId = `${panelId}-button`;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <article className="border-b border-[#44482c]/12 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className="group flex w-full items-start justify-between gap-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:py-5"
        >
          <span className="text-base font-semibold leading-snug text-[#44482c] group-hover:text-primary sm:text-lg">
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#44482c]/20 text-[#44482c] transition-transform duration-300 ${
              isOpen ? 'rotate-45 bg-[#44482c] text-[#e8d79a]' : 'bg-white/70'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-2 sm:pr-10">
            <FaqAnswer parts={item.answer} />
          </div>
        </div>
      </div>
    </article>
  );
};

const PreguntasFrecuentes = () => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);
  const searchInputId = useId();

  const filteredCategories = useMemo(() => {
    const query = normalizeText(deferredQuery);

    return FAQ_CATEGORIES.map((category) => {
      if (activeCategory !== 'all' && category.id !== activeCategory) {
        return { ...category, items: [] as FaqItem[] };
      }

      if (!query) {
        return category;
      }

      const items = category.items.filter((item) => {
        const haystack = normalizeText(
          `${item.question} ${answerToSearchText(item.answer)} ${category.label}`,
        );
        return haystack.includes(query);
      });

      return { ...category, items };
    }).filter((category) => category.items.length > 0);
  }, [activeCategory, deferredQuery]);

  const totalResults = useMemo(
    () => filteredCategories.reduce((acc, category) => acc + category.items.length, 0),
    [filteredCategories],
  );

  useEffect(() => {
    setOpenItemId(null);
  }, [activeCategory, deferredQuery]);

  const handleCategoryChange = (categoryId: ActiveCategory) => {
    setActiveCategory(categoryId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleToggleItem = (itemId: string) => {
    setOpenItemId((current) => (current === itemId ? null : itemId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f4ea] via-white to-secondary-claro/15 font-primary text-[#44482c]">
      <section className="relative overflow-hidden border-b border-[#44482c]/10 bg-[#e8d79a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-full bg-gradient-to-t from-[#f7f4ea]/40 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]/70">
            Centro de ayuda
          </p>
          <h1 className="mt-3 max-w-3xl font-slogan text-3xl uppercase tracking-slogan text-[#44482c] sm:text-4xl md:text-5xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#44482c]/85 sm:text-lg">
            Respuestas claras para propietarios, inversionistas y quienes exploran créditos de
            carbono, tradición y libertad, y la tecnología de Terrasacha.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="sticky top-0 z-20 -mx-4 mb-8 border-b border-[#44482c]/10 bg-[#f7f4ea]/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar en preguntas frecuentes
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#44482c]/50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </span>
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Busca por palabra clave…"
              className="w-full rounded-2xl border border-[#44482c]/15 bg-white/90 py-3 pl-11 pr-24 text-sm text-[#44482c] shadow-sm placeholder:text-[#44482c]/45 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-base"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-1.5 right-1.5 rounded-xl px-3 text-sm font-medium text-[#44482c]/70 transition hover:bg-[#e8d79a]/60 hover:text-[#44482c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Limpiar búsqueda"
              >
                Limpiar
              </button>
            ) : null}
          </div>

          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Categorías de preguntas frecuentes"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => handleCategoryChange('all')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                activeCategory === 'all'
                  ? 'bg-[#44482c] text-[#e8d79a]'
                  : 'border border-[#44482c]/15 bg-white/80 text-[#44482c]/80 hover:border-[#44482c]/30 hover:text-[#44482c]'
              }`}
            >
              Todas
            </button>
            {FAQ_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive
                      ? 'bg-[#44482c] text-[#e8d79a]'
                      : 'border border-[#44482c]/15 bg-white/80 text-[#44482c]/80 hover:border-[#44482c]/30 hover:text-[#44482c]'
                  }`}
                >
                  {category.shortLabel}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-sm text-[#44482c]/65" aria-live="polite">
            {totalResults === 0
              ? 'No hay resultados para tu búsqueda.'
              : `${totalResults} pregunta${totalResults === 1 ? '' : 's'} encontrada${totalResults === 1 ? '' : 's'}`}
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#44482c]/20 bg-white/70 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[#44482c]">Sin coincidencias</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#44482c]/70">
              Prueba con otra palabra o explora una categoría distinta. También puedes escribirnos
              directamente.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleClearSearch();
                  handleCategoryChange('all');
                }}
                className="rounded-full border border-[#44482c]/20 px-5 py-2.5 text-sm font-semibold text-[#44482c] transition hover:bg-[#e8d79a]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Ver todas las preguntas
              </button>
              <Link
                to="/contacto"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Ir a Contacto
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-36"
                aria-labelledby={`${category.id}-heading`}
              >
                <div className="mb-3 sm:mb-4">
                  <h2
                    id={`${category.id}-heading`}
                    className="text-xl font-bold text-[#44482c] sm:text-2xl"
                  >
                    {category.label}
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm text-[#44482c]/70 sm:text-base">
                    {category.description}
                  </p>
                </div>

                <div className="rounded-3xl border border-[#44482c]/10 bg-white/85 px-4 shadow-[0_10px_40px_-28px_rgba(68,72,44,0.45)] sm:px-6">
                  {category.items.map((item) => (
                    <FaqAccordionItem
                      key={item.id}
                      item={item}
                      isOpen={openItemId === item.id}
                      onToggle={() => handleToggleItem(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="mt-12 rounded-3xl border border-[#44482c]/10 bg-[#e8d79a]/35 px-6 py-7 sm:mt-14 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-[#44482c] sm:text-xl">Glosario</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#44482c]/75 sm:text-base">
                Consulta definiciones de términos forestales, de carbono y blockchain en una sección
                aparte.
              </p>
            </div>
            <Link
              to="/glosario"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#44482c] px-5 py-2.5 text-sm font-semibold text-[#e8d79a] transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Abrir glosario
            </Link>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl border border-[#44482c]/10 bg-[#44482c] px-6 py-8 text-[#e8d79a] sm:mt-16 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-slogan text-2xl uppercase tracking-slogan sm:text-3xl">
                ¿No encontraste tu respuesta?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#e8d79a]/85 sm:text-base">
                Escríbenos y te acompañamos con la información que necesitas sobre predios,
                proyectos forestales o la plataforma.
              </p>
            </div>
            <Link
              to="/contacto"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8d79a] px-6 py-3 text-sm font-bold text-[#44482c] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d79a]/60"
            >
              Contactar a Terrasacha
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PreguntasFrecuentes;
