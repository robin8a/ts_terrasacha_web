import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getRutaCourseById,
  getRutaLevelById,
  rutaFormacionContent,
} from '../data/rutaFormacion';

const useInView = <T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

const getMetricValue = (
  metrics: { label: string; value: string }[],
  metricLabel: string
) => metrics.find((metric) => metric.label === metricLabel)?.value ?? 'N/D';

const RutaValueIcon = ({
  icon,
}: {
  icon: 'spark' | 'briefcase' | 'certificate' | 'community';
}) => {
  if (icon === 'spark') {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M11 3l1.88 5.78H19l-4.94 3.59L15.94 18 11 14.41 6.06 18l1.88-5.63L3 8.78h6.12L11 3z"
        />
      </svg>
    );
  }

  if (icon === 'briefcase') {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M9 6V4.75A1.75 1.75 0 0110.75 3h2.5A1.75 1.75 0 0115 4.75V6m-9 3h12m-12 0v7.25A1.75 1.75 0 007.75 18h8.5A1.75 1.75 0 0018 16.25V9m-12 0V7.75A1.75 1.75 0 017.75 6h8.5A1.75 1.75 0 0118 7.75V9"
        />
      </svg>
    );
  }

  if (icon === 'certificate') {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M8 7.75A1.75 1.75 0 019.75 6h8.5A1.75 1.75 0 0120 7.75v6.5A1.75 1.75 0 0118.25 16H15l-3 3v-3H9.75A1.75 1.75 0 018 14.25v-6.5zM6 8H5.75A1.75 1.75 0 004 9.75v8.5A1.75 1.75 0 005.75 20h6.5"
        />
      </svg>
    );
  }

  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M16 11a4 4 0 10-8 0 4 4 0 008 0zm-11 8a7 7 0 0114 0M19 8a3 3 0 013 3v1m-3 8v-1a5.98 5.98 0 00-1.13-3.5M5 8a3 3 0 00-3 3v1m3 8v-1a5.98 5.98 0 011.13-3.5"
      />
    </svg>
  );
};

const RutaLevelIcon = ({
  icon,
}: {
  icon: 'sprout' | 'tree' | 'drone';
}) => {
  if (icon === 'sprout') {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M12 20V10m0 0c0-3 2.5-5.5 5.5-5.5 0 3-2.5 5.5-5.5 5.5zm0 0C9 10 6.5 7.5 6.5 4.5c3 0 5.5 2.5 5.5 5.5z"
        />
      </svg>
    );
  }

  if (icon === 'tree') {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M12 21v-4m0 0l-4-4m4 4l4-4m-4 4V7m0 0L8 3m4 4l4-4"
        />
      </svg>
    );
  }

  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M10.5 6.5L12 5l1.5 1.5 2-.5.5 2L18 9l-1.5 1.5.5 2-2 .5L13.5 15 12 13.5 10.5 15l-1.5-1.5-2-.5.5-2L6 9l1.5-1 .5-2 2 .5zM12 15v4m-3 0h6"
      />
    </svg>
  );
};

const RutaEligibilityIcon = ({
  icon,
}: {
  icon: 'age' | 'location' | 'capacity';
}) => {
  if (icon === 'age') {
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M7 4h10M8 2v4m8-4v4M5.75 6h12.5A1.75 1.75 0 0120 7.75v10.5A1.75 1.75 0 0118.25 20H5.75A1.75 1.75 0 014 18.25V7.75A1.75 1.75 0 015.75 6zM8 11h2m4 0h2M8 15h8"
        />
      </svg>
    );
  }

  if (icon === 'location') {
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M4 17.25A2.25 2.25 0 016.25 15h11.5A2.25 2.25 0 0120 17.25V20H4v-2.75zM7.5 15V9.75A1.75 1.75 0 019.25 8h5.5A1.75 1.75 0 0116.5 9.75V15M9 8V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V8"
      />
    </svg>
  );
};

const RutaProcessIcon = ({
  icon,
}: {
  icon: 'social' | 'form' | 'review';
}) => {
  if (icon === 'social') {
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M17 8h.01M7 21h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4zm8-11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }

  if (icon === 'form') {
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M8 6h8M8 10h8M8 14h5m4.5 5.5l-3.25-.75L8 20l1.25-6.25 6.5-6.5a1.77 1.77 0 112.5 2.5l-6.5 6.5z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M10.5 17.25L6 21l1.5-5.25A7 7 0 1119 12a6.96 6.96 0 01-2.05 4.95M12 9v3m0 3h.01"
      />
    </svg>
  );
};

const getCourseDuration = (courseId: string) =>
  getMetricValue(getRutaCourseById(courseId)?.metrics ?? [], 'Duración');

const RutaFormacion = () => {
  const detailPanelRef = useRef<HTMLElement | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState(
    rutaFormacionContent.courses[0]?.id ?? ''
  );
  const [expandedIntermediateCourseId, setExpandedIntermediateCourseId] = useState(
    rutaFormacionContent.courses.find((course) => course.levelId === 'intermedio')?.id ?? ''
  );
  const [notesAccordionOpen, setNotesAccordionOpen] = useState(false);

  const valueSection = useInView<HTMLElement>();
  const pathSection = useInView<HTMLElement>();
  const tableSection = useInView<HTMLElement>();
  const eligibilitySection = useInView<HTMLElement>();
  const notesSection = useInView<HTMLDivElement>();

  const selectedCourse = useMemo(
    () =>
      getRutaCourseById(selectedCourseId) ?? rutaFormacionContent.courses[0],
    [selectedCourseId]
  );

  if (!selectedCourse) {
    return null;
  }

  const selectedLevel = getRutaLevelById(selectedCourse.levelId);

  if (!selectedLevel) {
    return null;
  }

  const isAdvancedSelected = selectedLevel.id === 'avanzado';
  const detailPanelClassName = isAdvancedSelected
    ? 'border-[#44482c]/20 bg-gradient-to-br from-[#505538] via-[#44482c] to-[#2f331d] text-[#f8f3df]'
    : selectedLevel.id === 'intermedio'
      ? 'border-[#849b50]/20 bg-gradient-to-br from-white via-white to-[#eef3df] text-[#44482c]'
      : 'border-[#6e6c35]/15 bg-gradient-to-br from-white via-white to-[#f8f3df] text-[#44482c]';
  const detailMutedClassName = isAdvancedSelected
    ? 'text-[#f8f3df]/75'
    : 'text-[#44482c]/75';
  const detailSoftSurfaceClassName = isAdvancedSelected
    ? 'border-white/10 bg-white/10'
    : 'border-black/5 bg-white/75';
  const detailOutlineSurfaceClassName = isAdvancedSelected
    ? 'border-white/10 bg-black/10'
    : 'border-[#6e6c35]/10 bg-[#f8f6ec]';
  const selectedLevelCourses = useMemo(
    () =>
      rutaFormacionContent.courses.filter(
        (course) => course.levelId === selectedLevel.id
      ),
    [selectedLevel.id]
  );
  const curriculumRows = useMemo(
    () => [
      {
        label: 'Formación',
        getValue: (courseId: string) =>
          getRutaCourseById(courseId)?.title ?? 'N/D',
      },
      {
        label: 'Duración',
        getValue: (courseId: string) =>
          getMetricValue(
            getRutaCourseById(courseId)?.metrics ?? [],
            'Duración'
          ),
      },
      {
        label: 'Cupos',
        getValue: (courseId: string) =>
          getMetricValue(
            getRutaCourseById(courseId)?.metrics ?? [],
            'Cupos'
          ),
      },
      {
        label: 'Puntos',
        getValue: (courseId: string) =>
          getMetricValue(
            getRutaCourseById(courseId)?.metrics ?? [],
            'Puntos'
          ),
      },
    ],
    []
  );

  const handleSelectCourse = (courseId: string) => {
    if (courseId === selectedCourseId) {
      return;
    }

    setSelectedCourseId(courseId);

    if (typeof window === 'undefined') {
      return;
    }

    if (window.innerWidth >= 1024) {
      return;
    }

    window.requestAnimationFrame(() => {
      detailPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleSelectLevel = (levelId: 'basico' | 'intermedio' | 'avanzado') => {
    const nextCourse = rutaFormacionContent.courses.find(
      (course) => course.levelId === levelId
    );

    if (!nextCourse) {
      return;
    }

    if (levelId === 'intermedio') {
      setExpandedIntermediateCourseId(nextCourse.id);
    }

    handleSelectCourse(nextCourse.id);
  };

  const handleToggleIntermediateCourse = (courseId: string) => {
    setExpandedIntermediateCourseId((currentCourseId) =>
      currentCourseId === courseId ? '' : courseId
    );
    handleSelectCourse(courseId);
  };

  return (
    <main className="font-primary min-h-screen bg-gradient-to-b from-white via-[#f7f4ea] to-white">
      {/* Hero: fondo paisaje, contenido centrado (código guía) */}
      <section
        className="relative min-h-screen w-full flex flex-col overflow-hidden"
        aria-label="Hero Ruta de Formación"
      >
        {/* Imagen de fondo: paisaje agroforestal */}
        <img
          src={encodeURI('/Ruta de formacion/hero.png')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          role="presentation"
          loading="eager"
        />
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-5xl mx-auto w-full pt-24 pb-16">
          <h1 className="text-[4.5rem] md:text-7xl lg:text-[5.5rem] font-black text-[#2E3A1E] leading-tight mb-6 max-w-4xl mx-auto">
            ¡Conéctate para la
            <br />
            transformación de tu
            <br />
            futuro...
          </h1>
          <p
            className="text-lg md:text-xl text-white font-medium mb-8 max-w-3xl mx-auto text-shadow-md leading-relaxed"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Ruta de formación en tecnología agroforestal para residentes de Meta y Arauca. Descubre los niveles Básico,
            Intermedio y Avanzado.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="px-6 py-2 rounded-md bg-[#D9CA89] text-[#2C3A1F] font-semibold text-sm md:text-base shadow-sm">
              Residentes de Meta y Arauca
            </span>
            <span className="px-6 py-2 rounded-md bg-[#D9CA89] text-[#2C3A1F] font-semibold text-sm md:text-base shadow-sm">
              Formación gratuita
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#inscripcion"
                className="px-8 py-3 rounded-lg bg-[#5C6836] hover:bg-[#4a532b] text-white font-semibold text-lg transition-colors shadow-lg border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C3A1F] focus-visible:ring-offset-2"
                aria-label="Ir a inscripción"
              >
                ¡Quiero Inscribirme ya!
              </a>
              <span className="text-white text-sm font-medium text-shadow-sm" aria-hidden>
                #inscripcion
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a
                href="#explorar-ruta"
                className="px-8 py-3 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-lg hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label="Explorar cursos de la ruta"
              >
                Explorar cursos
              </a>
              <span className="text-white text-sm font-medium text-shadow-sm" aria-hidden>
                #explorar-ruta
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <section
          ref={valueSection.ref}
          className={`mt-14 rounded-3xl border border-[#6e6c35]/10 bg-white px-6 py-10 text-center shadow-sm transition-all duration-700 ease-out sm:px-8 sm:py-12 lg:px-12 ${
            valueSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6e6c35]/10 bg-[#f8f3df] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Propuesta de valor
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-4xl lg:text-5xl">
              {rutaFormacionContent.valueSectionTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[#44482c]/80 sm:text-lg">
              {rutaFormacionContent.valueSectionBody}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rutaFormacionContent.valueHighlights.map((highlight) => (
              <article
                key={highlight.id}
                className="rounded-3xl border border-[#6e6c35]/10 bg-gradient-to-b from-white to-[#f8f6ec] p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#44482c] text-[#e8d79a]">
                  <RutaValueIcon icon={highlight.icon} />
                </div>

                <h3 className="mt-5 text-xl font-black leading-snug text-secondary-[bosques-nublados]">
                  {highlight.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#44482c]/75">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          ref={pathSection.ref}
          id="explorar-ruta"
          className={`scroll-mt-header mt-14 grid grid-cols-1 gap-8 transition-all duration-700 ease-out lg:grid-cols-[0.92fr,1.08fr] ${
            pathSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <article className="rounded-3xl border border-[#6e6c35]/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Ruta visual de aprendizaje
                </p>
                <h2 className="mt-2 text-2xl font-black text-secondary-[bosques-nublados] sm:text-3xl">
                  Un camino de 3 estaciones
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#44482c]/75">
                Haz clic en cada estación para abrir el panel lateral con la información del nivel, sus beneficios y
                los cursos asociados.
              </p>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#6e6c35]/8 bg-gradient-to-b from-[#faf9f4] to-[#f2ede2] p-5 shadow-inner shadow-[#6e6c35]/5 sm:p-6">
              {/* Línea de tiempo punteada con flechas (SVG en código, estilo referencia) */}
              <div
                className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
                style={{ top: 24, left: '50%', marginLeft: -120, width: 240, height: 'calc(100% - 48px)' }}
                aria-hidden
              >
                <svg
                  fill="none"
                  viewBox="0 0 200 600"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker
                      id="ruta-arrow-down"
                      markerWidth="8"
                      markerHeight="8"
                      refX="4"
                      refY="4"
                      orient="auto"
                    >
                      <path
                        d="M 4 0 L 0 8 L 8 8 Z"
                        fill="#6e6c35"
                      />
                    </marker>
                  </defs>
                  {/* Camino punteado en S / zigzag */}
                  <path
                    d="M 100 0 L 100 70 C 170 70, 170 190, 100 190 L 100 270 C 30 270, 30 390, 100 390 L 100 600"
                    stroke="#6e6c35"
                    strokeWidth="5"
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd="url(#ruta-arrow-down)"
                  />
                  {/* Flechas en los cambios de dirección (triángulos rellenos) */}
                  <path d="M 95 58 L 100 72 L 105 58 Z" fill="#6e6c35" />
                  <path d="M 162 172 L 178 190 L 162 208 Z" fill="#6e6c35" />
                  <path d="M 38 252 L 22 270 L 38 288 Z" fill="#6e6c35" />
                </svg>
              </div>
              {/* En móvil: línea vertical punteada simple (en lg se usa el SVG) */}
              <div
                className="pointer-events-none absolute left-10 top-12 bottom-12 z-0 w-0 border-l-2 border-dashed border-[#6e6c35]/60 lg:hidden"
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-white/70 to-transparent" />

              <div className="relative z-10 space-y-8">
                {rutaFormacionContent.levels.map((level, index) => {
                  const isActiveLevel = level.id === selectedLevel.id;
                  const isStationOnRight = index % 2 === 1;
                  const stationSurfaceClassName = isActiveLevel
                    ? `${level.cardClassName} shadow-lg shadow-[#6e6c35]/8`
                    : 'border-[#6e6c35]/10 bg-white/90 hover:border-[#6e6c35]/25 hover:bg-white hover:shadow-md';
                  const stationTextClassName =
                    level.id === 'avanzado' && isActiveLevel
                      ? 'text-[#f8f3df]'
                      : 'text-[#44482c]';

                  return (
                    <button
                      key={level.id}
                      type="button"
                      aria-label={`Abrir estación ${level.title}`}
                      aria-pressed={isActiveLevel}
                      onClick={() => handleSelectLevel(level.id)}
                      className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6e6c35]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2ede2] rounded-2xl"
                    >
                      <div className="grid grid-cols-[80px,1fr] gap-5 lg:grid-cols-[1fr,120px,1fr] lg:items-center lg:gap-8">
                        <div className="relative z-10 flex flex-col items-center gap-2 lg:col-start-2 lg:row-start-1">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-16 sm:w-16 ${
                              isActiveLevel
                                ? `${level.badgeClassName} shadow-md ring-2 ring-[#44482c]/10`
                                : 'border-[#6e6c35]/20 bg-white text-[#44482c] group-hover:border-[#6e6c35]/35 group-hover:shadow-sm'
                            }`}
                          >
                            <RutaLevelIcon icon={level.icon} />
                          </div>
                          <span
                            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-[11px] font-black tabular-nums transition-colors ${
                              isActiveLevel
                                ? 'bg-[#44482c] text-[#e8d79a]'
                                : 'bg-[#6e6c35]/15 text-[#44482c] group-hover:bg-[#6e6c35]/25'
                            }`}
                            aria-hidden
                          >
                            {index + 1}
                          </span>
                        </div>

                        <div
                          className={`min-w-0 rounded-2xl border p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:p-6 ${
                            isStationOnRight ? 'lg:col-start-3' : 'lg:col-start-1'
                          } ${stationSurfaceClassName}`}
                        >
                          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                isActiveLevel
                                  ? level.badgeClassName
                                  : 'border border-[#6e6c35]/10 bg-white/80 text-[#44482c]'
                              }`}
                            >
                              {level.title}
                            </span>
                          </div>

                          <h3
                            className={`mt-3 text-center text-lg font-bold leading-snug tracking-tight sm:text-xl ${stationTextClassName}`}
                          >
                            {level.routeLabel}
                          </h3>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              </div>
            </article>

          <section
            id="temario-capacitacion"
            ref={detailPanelRef}
            className={`scroll-mt-header h-fit rounded-[2rem] border p-6 shadow-sm transition-colors duration-300 lg:sticky lg:top-24 sm:p-7 ${detailPanelClassName}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${selectedLevel.badgeClassName}`}
              >
                {selectedLevel.title}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${detailMutedClassName}`}>
                {selectedLevel.routeLabel}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
              {selectedLevel.detailTitle}
                </h3>

            <p className={`mt-4 text-base leading-relaxed ${detailMutedClassName}`}>
              {selectedLevel.description}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={`rounded-2xl border p-4 ${detailSoftSurfaceClassName}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${detailMutedClassName}`}>
                  Duración
                </p>
                <p className="mt-2 text-base font-black">
                  {selectedLevel.detailDuration}
                </p>
              </div>

              <div className={`rounded-2xl border p-4 ${detailSoftSurfaceClassName}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${detailMutedClassName}`}>
                  Beneficio
                </p>
                <p className="mt-2 text-base font-black">
                  {selectedLevel.id === 'avanzado' ? 'Gran premio de alto valor' : selectedLevel.supportText}
                </p>
              </div>
            </div>

            <div className={`mt-6 rounded-3xl border p-5 ${detailOutlineSurfaceClassName}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${detailMutedClassName}`}>
                Beneficio principal
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                {selectedLevel.detailBenefit}
              </p>
            </div>

            {selectedLevel.id === 'basico' && (
              <div className="mt-8">
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${detailMutedClassName}`}>
                  Cursos del nivel
                </p>
                <div className="mt-4 space-y-3">
                  {selectedLevelCourses.map((course) => (
                    <article
                      key={course.id}
                      className={`rounded-3xl border p-4 ${detailSoftSurfaceClassName}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-current/10">
                          <RutaLevelIcon icon="sprout" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black leading-snug">
                            {course.title}
                          </p>
                          <p className={`mt-2 text-sm ${detailMutedClassName}`}>
                            {getCourseDuration(course.id)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {selectedLevel.id === 'intermedio' && (
              <div className="mt-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${detailMutedClassName}`}>
                      Cursos a elegir
                    </p>
                    <p className={`mt-2 text-sm leading-relaxed ${detailMutedClassName}`}>
                      Explora el acordeón para conocer el foco de cada curso del nivel intermedio.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedLevelCourses.map((course) => {
                    const isExpandedCourse = expandedIntermediateCourseId === course.id;

                    return (
                      <article
                        key={course.id}
                        className={`overflow-hidden rounded-3xl border ${detailSoftSurfaceClassName}`}
                      >
                        <button
                          type="button"
                          aria-label={`Abrir información de ${course.title}`}
                          aria-expanded={isExpandedCourse}
                          onClick={() => handleToggleIntermediateCourse(course.id)}
                          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                        >
                          <div>
                            <p className="text-sm font-black leading-snug">
                              {course.title}
                            </p>
                            <p className={`mt-2 text-sm ${detailMutedClassName}`}>
                              {getCourseDuration(course.id)}
                            </p>
                          </div>
                          <span className="text-lg font-black">
                            {isExpandedCourse ? '−' : '+'}
                          </span>
                        </button>

                        {isExpandedCourse && (
                          <div className="border-t border-current/10 px-5 pb-5 pt-4">
                            <p className={`text-sm leading-relaxed ${detailMutedClassName}`}>
                              {course.summary}
                            </p>
                            <ul className="mt-4 space-y-2">
                              {course.temario[0]?.topics.slice(0, 3).map((topic) => (
                                <li
                                  key={topic.id}
                                  className="flex items-start gap-3 text-sm leading-relaxed"
                                >
                                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-current/70" />
                                  <span>{topic.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
            </article>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedLevel.id === 'avanzado' && (
              <div className="mt-8 space-y-4">
                <div className={`rounded-3xl border p-5 ${detailSoftSurfaceClassName}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${detailMutedClassName}`}>
                    El gran premio
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">
                    {selectedLevel.detailReward}
                  </p>
                </div>

                <div className={`rounded-3xl border p-5 ${detailOutlineSurfaceClassName}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${detailMutedClassName}`}>
                    Oportunidad de oro
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">
                    Obtén un activo invaluable para tu futuro profesional con formación de alto impacto en una de las
                    tecnologías más demandadas de la agricultura de precisión.
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>

        <section
          ref={tableSection.ref}
          className={`mt-14 transition-all duration-700 ease-out ${
            tableSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <article className="overflow-hidden rounded-3xl border border-[#6e6c35]/10 bg-white shadow-sm">
            <div className="border-b border-[#6e6c35]/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Base curricular
              </p>
              <h3 className="mt-2 text-xl font-black text-secondary-[bosques-nublados]">
                Distribución de horas, cupos y puntos
                </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#44482c]/75">
                Tabla dinámica construida con la estructura oficial de la ruta. Selecciona una estación o una columna
                para mantener sincronizado el nivel activo.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="flex flex-wrap gap-2">
                {rutaFormacionContent.levels.map((level) => {
                  const isActiveLevel = level.id === selectedLevel.id;

                  return (
                    <button
                      key={level.id}
                      type="button"
                      aria-label={`Ver base curricular del ${level.title}`}
                      onClick={() => handleSelectLevel(level.id)}
                      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                        isActiveLevel
                          ? level.badgeClassName
                          : 'border-[#6e6c35]/10 bg-[#f8f6ec] text-[#44482c] hover:border-[#6e6c35]/25 hover:bg-white'
                      }`}
                    >
                      {level.title}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 min-w-[120px] rounded-l-2xl border border-[#6e6c35]/10 bg-[#f8f6ec] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#44482c]">
                        Campo
                      </th>
                      {selectedLevelCourses.map((course, index) => {
                        const isActiveCourse = course.id === selectedCourse.id;
                        const headerRoundedClassName =
                          index === selectedLevelCourses.length - 1
                            ? 'rounded-r-2xl'
                            : '';

                        return (
                          <th
                            key={course.id}
                            className={`min-w-[220px] border border-l-0 border-[#6e6c35]/10 px-3 py-3 align-top transition-colors duration-200 ${headerRoundedClassName} ${
                              isActiveCourse
                                ? 'bg-[#44482c] text-[#e8d79a]'
                                : 'bg-white text-[#44482c] hover:bg-[#f8f6ec]'
                            }`}
                          >
                            <button
                              type="button"
                              aria-label={`Seleccionar ${course.shortTitle}`}
                              onClick={() => handleSelectCourse(course.id)}
                              className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6e6c35]/40 focus-visible:ring-offset-2 rounded-lg"
                            >
                              <span className="inline-flex rounded-full border border-current/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                                {course.code}
                              </span>
                              <p className="mt-3 text-sm font-black leading-snug">
                                {course.shortTitle}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed opacity-80">
                                {course.category}
                              </p>
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {curriculumRows.map((row, rowIndex) => (
                      <tr key={row.label}>
                        <th
                          className={`sticky left-0 z-10 min-w-[120px] border border-t-0 border-[#6e6c35]/10 bg-[#f8f6ec] px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-[#44482c] ${
                            rowIndex === curriculumRows.length - 1
                              ? 'rounded-bl-2xl'
                              : ''
                          }`}
                        >
                          {row.label}
                        </th>
                        {selectedLevelCourses.map((course, columnIndex) => {
                          const isActiveCourse = course.id === selectedCourse.id;
                          const cellRoundedClassName =
                            rowIndex === curriculumRows.length - 1 &&
                            columnIndex === selectedLevelCourses.length - 1
                              ? 'rounded-br-2xl'
                              : '';

                          return (
                            <td
                              key={`${row.label}-${course.id}`}
                              className={`border border-l-0 border-t-0 border-[#6e6c35]/10 px-4 py-4 align-top transition-colors duration-200 ${cellRoundedClassName} ${
                                isActiveCourse
                                  ? 'bg-[#f6f0d0]'
                                  : 'bg-white hover:bg-[#f8f6ec]'
                              }`}
                            >
                              <button
                                type="button"
                                aria-label={`Ver detalle de ${course.shortTitle}`}
                                onClick={() => handleSelectCourse(course.id)}
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6e6c35]/40 focus-visible:ring-offset-1 rounded-lg py-1"
                              >
                                <span
                                  className={`block text-sm leading-relaxed ${
                                    row.label === 'Formación'
                                      ? 'font-semibold text-[#44482c]'
                                      : 'font-medium text-[#44482c]/85'
                                  }`}
                                >
                                  {row.getValue(course.id)}
                                </span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-2xl border border-[#6e6c35]/10 bg-[#f8f6ec] px-4 py-4">
                <p className="text-sm leading-relaxed text-[#44482c]/80">
                  <span className="font-semibold text-[#44482c]">
                    Nivel activo:
                  </span>{' '}
                  {selectedLevel.title}. La tabla conserva la sincronía con la estación seleccionada y resalta el curso
                  que estás explorando.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section
          ref={eligibilitySection.ref}
          id="inscripcion"
          className={`scroll-mt-header mt-14 rounded-3xl border border-[#6e6c35]/10 bg-[#faf9f4] p-6 shadow-sm transition-all duration-700 ease-out sm:p-8 lg:p-10 ${
            eligibilitySection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Participación e inscripción
          </p>
          <h2 className="mt-2 text-center text-3xl font-black text-secondary-[bosques-nublados] sm:text-4xl">
            ¿Quiénes pueden participar?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[#44482c]/75 sm:text-base">
            Esta sección define con claridad los criterios de elegibilidad para evitar inscripciones no válidas y
            orientar correctamente a las personas interesadas.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {rutaFormacionContent.eligibility.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#44482c]/25 bg-[#f0eac1] shadow-[6px_6px_0_0_rgba(68,72,44,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(68,72,44,0.25)]"
              >
                <div className="flex flex-1 flex-col items-center px-6 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#44482c] text-[#e8d79a]">
                    <RutaEligibilityIcon icon={item.icon} />
                  </div>
                  <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-[#44482c]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44482c]/85">
                    {item.description}
                  </p>
                </div>
                {item.footerLabel && (
                  <div className="border-t border-[#44482c]/20 bg-[#e8e2b7] px-4 py-4 text-center">
                    <span className="text-sm font-medium text-[#44482c]/90">{item.footerLabel}</span>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-center text-2xl font-black uppercase tracking-tight text-secondary-[bosques-nublados] sm:text-3xl">
              Tu ruta hacia la capacitación en 3 pasos
            </h3>

            {/* Línea conectora y números (desktop) */}
            <div className="relative mt-10 hidden md:block">
              <div className="absolute left-[15%] right-[15%] top-1/2 h-0.5 -translate-y-1/2 bg-[#44482c]/30" aria-hidden />
              <div className="relative grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex justify-center">
                    <div
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#44482c] text-lg font-black text-[#e8d79a]"
                      aria-hidden
                    >
                      {num}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
              {rutaFormacionContent.processSteps.map((step, index) => (
                <article
                  key={step.id}
                  className="flex flex-col items-center rounded-2xl border-2 border-[#44482c]/20 bg-[#f8f6ec] p-6 text-center shadow-[6px_6px_0_0_rgba(68,72,44,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(68,72,44,0.2)] md:mt-0"
                >
                  <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#44482c] text-lg font-black text-[#e8d79a] md:hidden">
                    {index + 1}
                  </div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#44482c] text-[#e8d79a]">
                    <RutaProcessIcon icon={step.icon} />
                  </div>
                  <h4 className="min-h-[3.5rem] text-lg font-black uppercase leading-snug text-secondary-[bosques-nublados]">
                    {step.title}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-[#44482c]/85">
                    {step.description}
                  </p>
                  {step.secondaryDescription && (
                    <p className="mt-2 text-sm leading-relaxed text-[#44482c]/75">
                      {step.secondaryDescription}
                    </p>
                  )}

                  {step.links && step.links.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {step.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.label}
                          className="inline-flex items-center justify-center rounded-2xl border border-[#44482c]/10 bg-white p-3.5 text-[#44482c] transition-all hover:-translate-y-0.5 hover:border-[#6e6c35]/25 hover:bg-[#f8f6ec]"
                        >
                          {link.id === 'instagram' && (
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                              <path d="M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z" />
                              <circle cx="14.87" cy="5.26" r="1.09" />
                              <path d="M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z" />
                            </svg>
                          )}
                          {link.id === 'facebook' && (
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                              <path d="M11,10h2.6l0.4-3H11V5.3c0-0.9,0.2-1.5,1.5-1.5H14V1.1c-0.3,0-1-0.1-2.1-0.1C9.6,1,8,2.4,8,5v2H5.5v3H8v8h3V10z" />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  {step.actionHref && step.actionLabel && (
                    <a
                      href={step.actionHref}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#44482c] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#e8d79a] transition-all hover:-translate-y-0.5 hover:bg-[#6e6c35]"
                    >
                      <span>{step.actionLabel}</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}

                  {step.id === 'review' && !step.actionHref && (
                    <p className="mt-6 text-sm font-medium text-[#44482c]/80">Espera la confirmación.</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bloque 6: Notas Importantes (acordeón colapsable) */}
        <div
          ref={notesSection.ref}
          className={`container mx-auto mt-10 px-4 transition-all duration-700 ease-out lg:px-8 ${
            notesSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="rounded-2xl border border-[#6e6c35]/10 bg-[#fbfaf5]">
            <button
              type="button"
              onClick={() => setNotesAccordionOpen((open) => !open)}
              aria-expanded={notesAccordionOpen}
              aria-controls="notas-importantes-content"
              id="notas-importantes-trigger"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-[#44482c] transition-colors hover:bg-[#f4efe1]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6e6c35]/30 focus-visible:ring-offset-2 rounded-2xl"
            >
              <span>{rutaFormacionContent.importantNotesAccordionTitle}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-[#44482c] transition-transform duration-200 ${notesAccordionOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id="notas-importantes-content"
              role="region"
              aria-labelledby="notas-importantes-trigger"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${notesAccordionOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="border-t border-[#6e6c35]/10 px-5 py-4">
                <ul className="space-y-3 text-sm leading-relaxed text-[#44482c]/90">
                  {rutaFormacionContent.importantNotes.map((note, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6e6c35]/50" aria-hidden />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default RutaFormacion;

