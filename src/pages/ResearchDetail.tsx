import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Status } from '../API';
import RelatedPodcastSection from '../components/podcast/RelatedPodcastSection';
import RelatedVideoclipSection from '../components/videoclip/RelatedVideoclipSection';
import { researchItemBySlug } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { mapAmplifyResearchToPublic, type PublicResearchItem } from '../lib/researchMapper';

type ResearchSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

const normalizeParagraph = (value: string): string => value.replace(/\s+/g, ' ').trim();

const buildSectionId = (title: string, index: number): string => {
  const slug = normalizeParagraph(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slug ? `research-section-${slug}-${index}` : `research-section-${index}`;
};

const getPrimarySectionTitle = (value: string): string | null => {
  const candidate = normalizeParagraph(value);
  if (!candidate || candidate.length > 120) return null;

  if (/^introducci[oó]n$/i.test(candidate)) return 'Introducción';
  if (/^estructura de productos de procesamiento$/i.test(candidate)) {
    return 'Estructura de Productos de Procesamiento';
  }
  if (/^procesos de calibraci[oó]n \(cal\) y validaci[oó]n \(val\)$/i.test(candidate)) {
    return 'Procesos de Calibración y Validación';
  }
  if (/^validaci[oó]n de datos \(val\): estrategia jer[aá]rquica ceos$/i.test(candidate)) {
    return 'Validación de Datos';
  }
  if (/^fases operacionales y cronograma de productos$/i.test(candidate)) {
    return 'Fases Operacionales y Cronograma de Productos';
  }
  if (/^desaf[ií]os especializados en calibraci[oó]n biomass$/i.test(candidate)) {
    return 'Desafíos Especializados en Calibración BIOMASS';
  }
  if (/^conclusi[oó]n$/i.test(candidate)) return 'Conclusión';

  return null;
};

const isSecondarySectionHeading = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  if (!candidate || candidate.length > 90) return false;
  if (/[.!?]$/.test(candidate)) return false;

  return (
    /^(nivel [123](?::.*)?|fases de calibraci[oó]n durante la comisi[oó]n \(commissioning phase\)|calibraci[oó]n radiom[eé]trica y polarim[eé]trica:?|caracterizaci[oó]n de antena:?|infraestructura de validaci[oó]n: geo-trees y frm4biomass|geo-trees \(global forest biomass reference system\):|frm4biomass \(fiducial reference measurements for biomass\):|procedimientos de validaci[oó]n espec[ií]ficos por producto|validaci[oó]n de biomasa \(agbd\)|validaci[oó]n de altura forestal \(fh\)|validaci[oó]n de perturbaci[oó]n forestal \(fd\))$/i.test(candidate) ||
    /^(producto l\d|acr[oó]nimo|descripci[oó]n|m[eé]trica f[ií]sica|contenido|resoluci[oó]n espacial|estadio ceos|criterios|aplicaci[oó]n biomass|fase|duraci[oó]n estimada|objetivos principales|productos cal\/val|calibraci[oó]n externa|requisitos de exactitud radiom[eé]trica|objetivos clave frm4biomass|m[eé]tricas principales|procedimiento)$/i.test(candidate) ||
    candidate.split(/\s+/).length <= 6
  );
};

const parseDefinitionParagraph = (value: string): { label: string; content: string } | null => {
  const candidate = normalizeParagraph(value);
  const match = candidate.match(/^([^:]{2,80}):\s+(.+)$/);
  if (!match) return null;

  const [, label, content] = match;
  if (/[.!?]$/.test(label.trim())) return null;

  return {
    label: label.trim(),
    content: content.trim(),
  };
};

const parseMetricRow = (value: string): { label: string; metric: string } | null => {
  const definition = parseDefinitionParagraph(value);
  if (!definition) return null;

  if (definition.label.length > 60 || definition.content.length === 0) return null;
  if (definition.content.length > 40) return null;
  if (/[.!?]$/.test(definition.content)) return null;

  return {
    label: definition.label,
    metric: definition.content,
  };
};

const isCompactAcronym = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  if (!candidate || candidate.length > 32) return false;
  if (candidate.includes(':')) return false;
  if (/[.!?]$/.test(candidate)) return false;
  return candidate.split(/\s+/).length <= 4;
};

const isMetadataHeading = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^(producto l\d|acr[oó]nimo|descripci[oó]n|m[eé]trica f[ií]sica|contenido|resoluci[oó]n espacial|estadio ceos|criterios|aplicaci[oó]n biomass|fase|duraci[oó]n estimada|objetivos principales|productos cal\/val)$/i.test(
    candidate,
  );
};

const isLevelHeading = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^nivel\s+[123][a-z]?(?:\s*[:(].*)?$/i.test(candidate);
};

const isProductHeading = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^(biomasa \(agb\/agbd\)|altura forestal \(fh\)|perturbaci[oó]n forestal \(fd\))$/i.test(candidate);
};

const isUnitHeading = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^(t\/ha \(mg\/ha\)|metros|binario \+ probabilidad)$/i.test(candidate);
};

const isProductTableTitle = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^producto l\d$/i.test(candidate);
};

const isCeosStageCode = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^[0-4]$/.test(candidate);
};

const isCeosTableHeader = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /^(estadio ceos|criterios|aplicaci[oó]n biomass)$/i.test(candidate);
};

const isTimelinePhase = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /(comisi[oó]n|tomograf[ií]a|interferometr[ií]a)/i.test(candidate);
};

const isTimelineDuration = (value: string): boolean => {
  const candidate = normalizeParagraph(value);
  return /(mes(es)?|a[nñ]o|contingencia|iniciales|recurrentes)/i.test(candidate);
};

const buildResearchSections = (paragraphs: string[]): ResearchSection[] => {
  if (paragraphs.length === 0) return [];

  const sections: ResearchSection[] = [];
  let currentSection: ResearchSection | null = null;
  const pushCurrentSection = () => {
    if (!currentSection || currentSection.paragraphs.length === 0) return;
    sections.push(currentSection);
  };

  paragraphs.forEach((paragraph, index) => {
    const normalizedParagraph = normalizeParagraph(paragraph);
    if (!normalizedParagraph) return;

    const primarySectionTitle = getPrimarySectionTitle(normalizedParagraph);
    if (primarySectionTitle) {
      pushCurrentSection();

      currentSection = {
        id: buildSectionId(primarySectionTitle, index),
        title: primarySectionTitle,
        paragraphs: [],
      };
      return;
    }

    if (!currentSection) {
      currentSection = {
        id: buildSectionId('Contenido', index),
        title: 'Contenido',
        paragraphs: [],
      };
    }

    currentSection.paragraphs.push(normalizedParagraph);
  });

  pushCurrentSection();

  return sections;
};

const ResearchDetail = () => {
  const { slug } = useParams();
  const researchSlug = slug ?? '';
  const [researchItem, setResearchItem] = useState<PublicResearchItem | null | undefined>(undefined);
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      setResearchItem(undefined);

      try {
        if (!researchSlug) {
          if (!cancelled) setResearchItem(null);
          return;
        }

        const client = getGraphqlClient();
        const res: any = await client.graphql({
          query: researchItemBySlug,
          variables: {
            slug: researchSlug,
            limit: 1,
            filter: { status: { eq: Status.PUBLISHED } },
          },
          authMode: 'apiKey',
        });

        const item = res?.data?.researchItemBySlug?.items?.[0] ?? null;
        if (!cancelled) {
          setResearchItem(item && isWithinPublicationWindow(item) ? mapAmplifyResearchToPublic(item) : null);
        }
      } catch {
        if (!cancelled) setResearchItem(null);
      }
    };

    void fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [researchSlug]);

  const researchSections = useMemo(
    () => buildResearchSections(researchItem?.body ?? []),
    [researchItem?.body],
  );

  useEffect(() => {
    if (researchSections.length === 0) {
      setExpandedSectionIds([]);
      return;
    }

    setExpandedSectionIds((currentIds) => {
      const validIds = currentIds.filter((id) => researchSections.some((section) => section.id === id));
      if (validIds.length > 0) return validIds;
      return [researchSections[0].id];
    });
  }, [researchSections]);

  useEffect(() => {
    if (researchSections.length === 0) return;

    const handleHashNavigation = () => {
      const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!hashId) return;

      const sectionExists = researchSections.some((section) => section.id === hashId);
      if (!sectionExists) return;

      setExpandedSectionIds((currentIds) => (currentIds.includes(hashId) ? currentIds : [...currentIds, hashId]));
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [researchSections]);

  const handleToggleSection = (sectionId: string) => {
    setExpandedSectionIds((currentIds) =>
      currentIds.includes(sectionId)
        ? currentIds.filter((id) => id !== sectionId)
        : [...currentIds, sectionId],
    );
  };

  const renderSectionParagraphs = (section: ResearchSection) => {
    const blocks: ReactElement[] = [];

    for (let paragraphIndex = 0; paragraphIndex < section.paragraphs.length; paragraphIndex += 1) {
      const paragraph = section.paragraphs[paragraphIndex];
      const definitionParagraph = parseDefinitionParagraph(paragraph);
      const nextParagraph = section.paragraphs[paragraphIndex + 1];

      if (
        isSecondarySectionHeading(paragraph) &&
        nextParagraph &&
        isSecondarySectionHeading(nextParagraph) &&
        isCompactAcronym(nextParagraph) &&
        isLevelHeading(paragraph)
      ) {
        blocks.push(
          <div
            key={`${section.id}-paragraph-${paragraphIndex}`}
            className="border-l-4 border-primary/40 bg-secondary-claro/10 px-4 py-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-[bosques-nublados] sm:text-sm">
              {paragraph}
            </h4>
            <p className="mt-2 inline-flex rounded-full border border-primary/20 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
              {nextParagraph}
            </p>
          </div>,
        );
        paragraphIndex += 1;
        continue;
      }

      if (isSecondarySectionHeading(paragraph) && isProductTableTitle(paragraph)) {
        const groupedHeadings: string[] = [];
        let lookaheadIndex = paragraphIndex + 1;

        while (lookaheadIndex < section.paragraphs.length) {
          const lookaheadParagraph = section.paragraphs[lookaheadIndex];
          if (!isSecondarySectionHeading(lookaheadParagraph) || !isMetadataHeading(lookaheadParagraph)) {
            break;
          }
          groupedHeadings.push(lookaheadParagraph);
          lookaheadIndex += 1;
        }

        if (groupedHeadings.length > 0) {
          blocks.push(
            <div
              key={`${section.id}-paragraph-${paragraphIndex}`}
              className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-[bosques-nublados]">
                {paragraph}
              </p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                Campos de referencia
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {groupedHeadings.map((heading) => (
                  <span
                    key={`${section.id}-${heading}-${paragraphIndex}`}
                    className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-[bosques-nublados]"
                  >
                    {heading}
                  </span>
                ))}
              </div>
            </div>,
          );

          paragraphIndex += groupedHeadings.length;
          continue;
        }
      }

      if (isCeosStageCode(paragraph) && paragraphIndex + 2 < section.paragraphs.length) {
        const criteriaParagraph = section.paragraphs[paragraphIndex + 1];
        const applicationParagraph = section.paragraphs[paragraphIndex + 2];

        if (
          !isCeosStageCode(criteriaParagraph) &&
          !isCeosStageCode(applicationParagraph) &&
          !isCeosTableHeader(criteriaParagraph) &&
          !isCeosTableHeader(applicationParagraph)
        ) {
          blocks.push(
            <div
              key={`${section.id}-paragraph-${paragraphIndex}`}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-5"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)]">
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Estadio</p>
                  <p className="mt-1 text-base font-black text-primary">{paragraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Criterios</p>
                  <p className="mt-1 text-sm text-gray-700">{criteriaParagraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Aplicación BIOMASS</p>
                  <p className="mt-1 text-sm text-gray-700">{applicationParagraph}</p>
                </div>
              </div>
            </div>,
          );

          paragraphIndex += 2;
          continue;
        }
      }

      if (isTimelinePhase(paragraph) && paragraphIndex + 3 < section.paragraphs.length) {
        const durationParagraph = section.paragraphs[paragraphIndex + 1];
        const objectiveParagraph = section.paragraphs[paragraphIndex + 2];
        const productsParagraph = section.paragraphs[paragraphIndex + 3];

        if (
          isTimelineDuration(durationParagraph) &&
          !isTimelinePhase(objectiveParagraph) &&
          !isTimelineDuration(objectiveParagraph) &&
          !isMetadataHeading(objectiveParagraph) &&
          !isTimelinePhase(productsParagraph) &&
          !isTimelineDuration(productsParagraph) &&
          !isMetadataHeading(productsParagraph)
        ) {
          blocks.push(
            <div
              key={`${section.id}-paragraph-${paragraphIndex}`}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-5"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Fase</p>
                  <p className="mt-1 text-sm font-semibold text-secondary-[bosques-nublados]">{paragraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    Duración Estimada
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{durationParagraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    Objetivos Principales
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{objectiveParagraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Productos Cal/Val</p>
                  <p className="mt-1 text-sm text-gray-700">{productsParagraph}</p>
                </div>
              </div>
            </div>,
          );

          paragraphIndex += 3;
          continue;
        }
      }

      if (
        isSecondarySectionHeading(paragraph) &&
        isProductHeading(paragraph) &&
        paragraphIndex + 3 < section.paragraphs.length
      ) {
        const resolutionParagraph = section.paragraphs[paragraphIndex + 1];
        const contentParagraph = section.paragraphs[paragraphIndex + 2];
        const metricParagraph = section.paragraphs[paragraphIndex + 3];

        if (
          !isSecondarySectionHeading(resolutionParagraph) &&
          !isSecondarySectionHeading(contentParagraph) &&
          isSecondarySectionHeading(metricParagraph) &&
          isUnitHeading(metricParagraph)
        ) {
          blocks.push(
            <div
              key={`${section.id}-paragraph-${paragraphIndex}`}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-[bosques-nublados]">
                {paragraph}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    Resolución Espacial
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{resolutionParagraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Contenido</p>
                  <p className="mt-1 text-sm text-gray-700">{contentParagraph}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Métrica Física</p>
                  <p className="mt-1 text-sm text-gray-700">{metricParagraph}</p>
                </div>
              </div>
            </div>,
          );

          paragraphIndex += 3;
          continue;
        }
      }

      if (isSecondarySectionHeading(paragraph)) {
        const firstMetricRow = parseMetricRow(paragraph);
        if (firstMetricRow) {
          const metricRows: Array<{ label: string; metric: string }> = [firstMetricRow];
          let lookaheadIndex = paragraphIndex + 1;

          while (lookaheadIndex < section.paragraphs.length) {
            const lookaheadParagraph = section.paragraphs[lookaheadIndex];
            if (!isSecondarySectionHeading(lookaheadParagraph)) break;

            const metricRow = parseMetricRow(lookaheadParagraph);
            if (!metricRow) break;

            metricRows.push(metricRow);
            lookaheadIndex += 1;
          }

          if (metricRows.length >= 2) {
            blocks.push(
              <div
                key={`${section.id}-paragraph-${paragraphIndex}`}
                className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                  Parámetros
                </p>
                <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                  {metricRows.map((row) => (
                    <div
                      key={`${section.id}-${row.label}-${paragraphIndex}`}
                      className="grid grid-cols-1 gap-1 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                    >
                      <p className="text-xs font-semibold text-secondary-[bosques-nublados] sm:text-sm">
                        {row.label}
                      </p>
                      <p className="text-xs font-bold text-primary sm:text-sm">{row.metric}</p>
                    </div>
                  ))}
                </div>
              </div>,
            );

            paragraphIndex += metricRows.length - 1;
            continue;
          }
        }
      }

      if (isSecondarySectionHeading(paragraph) && isMetadataHeading(paragraph)) {
        const groupedHeadings: string[] = [paragraph];
        let lookaheadIndex = paragraphIndex + 1;

        while (lookaheadIndex < section.paragraphs.length) {
          const lookaheadParagraph = section.paragraphs[lookaheadIndex];
          if (!isSecondarySectionHeading(lookaheadParagraph) || !isMetadataHeading(lookaheadParagraph)) {
            break;
          }
          groupedHeadings.push(lookaheadParagraph);
          lookaheadIndex += 1;
        }

        blocks.push(
          <div
            key={`${section.id}-paragraph-${paragraphIndex}`}
            className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Campos de referencia</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {groupedHeadings.map((heading) => (
                <span
                  key={`${section.id}-${heading}-${paragraphIndex}`}
                  className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-[bosques-nublados]"
                >
                  {heading}
                </span>
              ))}
            </div>
          </div>,
        );

        paragraphIndex += groupedHeadings.length - 1;
        continue;
      }

      if (isSecondarySectionHeading(paragraph)) {
        blocks.push(
          <div
            key={`${section.id}-paragraph-${paragraphIndex}`}
            className="border-l-4 border-primary/40 bg-secondary-claro/10 px-4 py-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-[bosques-nublados] sm:text-sm">
              {paragraph}
            </h4>
          </div>,
        );
        continue;
      }

      if (definitionParagraph) {
        blocks.push(
          <div
            key={`${section.id}-paragraph-${paragraphIndex}`}
            className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-5"
          >
            <p className="text-xs font-bold text-secondary-[bosques-nublados] sm:text-sm">
              {definitionParagraph.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-[15px] sm:leading-7">
              {definitionParagraph.content}
            </p>
          </div>,
        );
        continue;
      }

      blocks.push(
        <p
          key={`${section.id}-paragraph-${paragraphIndex}`}
          className="text-sm leading-6 text-gray-700 sm:text-[15px] sm:leading-7"
        >
          {paragraph}
        </p>,
      );
    }

    return blocks;
  };

  if (researchItem === undefined) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Investigación</p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">Cargando...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!researchItem) {
    return (
      <main className="font-primary min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Investigación</p>
            <h1 className="mt-3 text-3xl font-black text-secondary-[bosques-nublados]">
              Publicación no encontrada
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              La investigación solicitada no existe, no está publicada o fue movida.
            </p>
            <Link
              to="/investigacion"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Volver a investigación
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/investigacion"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a investigación
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative min-h-[24rem] overflow-hidden lg:col-span-5">
              {researchItem.coverImageUrl ? (
                <img
                  src={researchItem.coverImageUrl}
                  alt={researchItem.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full min-h-[24rem] items-center justify-center bg-gradient-to-br from-secondary-claro/30 to-[#e8d79a]">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]">
                    Investigación
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/10 to-transparent" />
            </div>

            <div className="bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {researchItem.category ?? 'Investigación aplicada'}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-4xl">
                {researchItem.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-700">
                {researchItem.authorName && (
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2">
                    Autor: {researchItem.authorName}
                  </span>
                )}
                {researchItem.institution && (
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2">
                    {researchItem.institution}
                  </span>
                )}
                {researchItem.publishedAt && (
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2">
                    {new Date(researchItem.publishedAt).toLocaleDateString('es-CO')}
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {researchItem.documentUrl && (
                  <a
                    href={researchItem.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    Descargar documento
                  </a>
                )}
                {researchItem.attachmentUrls.length > 0 && (
                  <span className="inline-flex items-center rounded-full border border-secondary-claro/50 bg-secondary-claro/15 px-5 py-3 text-sm font-semibold text-secondary-[bosques-nublados]">
                    {researchItem.attachmentUrls.length} adjunto(s)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 sm:p-8 lg:p-10">
            {researchSections.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  Navegación
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Salta rápidamente a la sección que quieras consultar dentro del documento.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {researchSections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:border-primary hover:text-primary"
                    >
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className={researchSections.length > 0 ? 'mt-8' : ''}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                Contenido
              </h2>
              <div className="mt-6 space-y-10">
                {researchSections.map((section, sectionIndex) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)] sm:p-8"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSection(section.id)}
                      aria-expanded={expandedSectionIds.includes(section.id)}
                      aria-controls={`${section.id}-content`}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex min-w-[6.5rem] items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                            Sección {String(sectionIndex + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-base font-black leading-tight text-secondary-[bosques-nublados] sm:text-[1.35rem]">
                            {section.title}
                          </h3>
                        </div>
                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary-[bosques-nublados]">
                          <svg
                            className={`h-4 w-4 transition-transform ${
                              expandedSectionIds.includes(section.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {expandedSectionIds.includes(section.id) && (
                      <div id={`${section.id}-content`} className="mt-6 space-y-5">
                        {renderSectionParagraphs(section)}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>

            {researchItem.attachmentUrls.length > 0 && (
              <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                  Adjuntos
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {researchItem.attachmentUrls.map((url, index) => (
                    <a
                      key={`${researchItem.id}-attachment-${index}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:border-primary hover:text-primary"
                    >
                      {url.split('/').pop() ?? `Adjunto ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 sm:px-8 lg:px-10 lg:pb-10">
            <RelatedPodcastSection relationType="research" relatedId={researchItem.id} />
            <RelatedVideoclipSection relationType="research" relatedId={researchItem.id} />
          </div>
        </article>
      </section>
    </main>
  );
};

export default ResearchDetail;
