import { useDeferredValue, useId, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  GLOSSARY_TERMS,
  getGlossaryLetter,
  type GlossaryTerm,
} from '../data/glosario';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const Glosario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | 'all'>('all');
  const deferredQuery = useDeferredValue(searchQuery);
  const searchInputId = useId();

  const availableLetters = useMemo(() => {
    const letters = new Set(GLOSSARY_TERMS.map((item) => getGlossaryLetter(item.term)));
    return letters;
  }, []);

  const filteredTerms = useMemo(() => {
    const query = normalizeText(deferredQuery);

    return GLOSSARY_TERMS.filter((item) => {
      const matchesLetter =
        activeLetter === 'all' || getGlossaryLetter(item.term) === activeLetter;
      if (!matchesLetter) return false;
      if (!query) return true;

      const haystack = normalizeText(`${item.term} ${item.definition}`);
      return haystack.includes(query);
    });
  }, [activeLetter, deferredQuery]);

  const groupedTerms = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();

    filteredTerms.forEach((item) => {
      const letter = getGlossaryLetter(item.term);
      const current = groups.get(letter) ?? [];
      current.push(item);
      groups.set(letter, current);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, 'es'));
  }, [filteredTerms]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleLetterChange = (letter: string | 'all') => {
    setActiveLetter(letter);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f4ea] via-white to-secondary-claro/15 font-primary text-[#44482c]">
      <section className="relative overflow-hidden border-b border-[#44482c]/10 bg-[#e8d79a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]/70">
            Referencia
          </p>
          <h1 className="mt-3 max-w-3xl font-slogan text-3xl uppercase tracking-slogan text-[#44482c] sm:text-4xl md:text-5xl">
            Glosario
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#44482c]/85 sm:text-lg">
            Definiciones clave sobre bosques, carbono, mercados y tecnología blockchain para
            navegar el ecosistema Terrasacha con más claridad.
          </p>
          <Link
            to="/preguntas-frecuentes"
            className="mt-6 inline-flex text-sm font-semibold text-[#44482c] underline-offset-2 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Ir a Preguntas frecuentes
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="sticky top-0 z-20 -mx-4 mb-8 border-b border-[#44482c]/10 bg-[#f7f4ea]/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar en el glosario
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
              placeholder="Busca un término…"
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
            className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filtrar glosario por letra"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeLetter === 'all'}
              onClick={() => handleLetterChange('all')}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                activeLetter === 'all'
                  ? 'bg-[#44482c] text-[#e8d79a]'
                  : 'border border-[#44482c]/15 bg-white/80 text-[#44482c]/80 hover:border-[#44482c]/30'
              }`}
            >
              Todas
            </button>
            {ALPHABET.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  disabled={!isAvailable}
                  onClick={() => handleLetterChange(letter)}
                  className={`h-9 w-9 shrink-0 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-30 ${
                    isActive
                      ? 'bg-[#44482c] text-[#e8d79a]'
                      : 'border border-[#44482c]/15 bg-white/80 text-[#44482c]/80 hover:border-[#44482c]/30'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-sm text-[#44482c]/65" aria-live="polite">
            {filteredTerms.length === 0
              ? 'No hay términos para tu búsqueda.'
              : `${filteredTerms.length} término${filteredTerms.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {groupedTerms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#44482c]/20 bg-white/70 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[#44482c]">Sin coincidencias</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#44482c]/70">
              Prueba con otra palabra o vuelve a ver todo el abecedario.
            </p>
            <button
              type="button"
              onClick={() => {
                handleClearSearch();
                handleLetterChange('all');
              }}
              className="mt-6 rounded-full border border-[#44482c]/20 px-5 py-2.5 text-sm font-semibold text-[#44482c] transition hover:bg-[#e8d79a]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Ver todo el glosario
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedTerms.map(([letter, terms]) => (
              <section
                key={letter}
                id={`letra-${letter}`}
                className="scroll-mt-40"
                aria-labelledby={`heading-${letter}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    id={`heading-${letter}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#44482c] font-slogan text-xl text-[#e8d79a]"
                  >
                    {letter}
                  </h2>
                  <div className="h-px flex-1 bg-[#44482c]/15" />
                </div>

                <dl className="space-y-3">
                  {terms.map((item) => (
                    <div
                      key={item.id}
                      id={item.id}
                      className="scroll-mt-40 rounded-2xl border border-[#44482c]/10 bg-white/85 px-4 py-4 sm:px-5 sm:py-5"
                    >
                      <dt className="text-base font-bold text-[#44482c] sm:text-lg">{item.term}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-[#44482c]/80 sm:text-[0.95rem]">
                        {item.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}

        <section className="mt-12 overflow-hidden rounded-3xl border border-[#44482c]/10 bg-[#44482c] px-6 py-8 text-[#e8d79a] sm:mt-16 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-slogan text-2xl uppercase tracking-slogan sm:text-3xl">
                ¿Quieres más detalle?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#e8d79a]/85 sm:text-base">
                Consulta las preguntas frecuentes o escríbenos si necesitas aclarar un término del
                proyecto.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/preguntas-frecuentes"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#e8d79a]/40 px-6 py-3 text-sm font-bold text-[#e8d79a] transition hover:bg-[#e8d79a]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d79a]/60"
              >
                Preguntas frecuentes
              </Link>
              <Link
                to="/contacto"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8d79a] px-6 py-3 text-sm font-bold text-[#44482c] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d79a]/60"
              >
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Glosario;
