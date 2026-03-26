import * as mammoth from 'mammoth/mammoth.browser';

type ResearchDocxPrefill = {
  title: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  institution: string;
};

const normalizeLine = (value: string): string => value.replace(/\s+/g, ' ').trim();
const SUMMARY_MAX_LENGTH = 320;
const SUMMARY_MIN_BREAK_INDEX = 180;

const isLikelySectionHeading = (value: string): boolean => {
  const candidate = value.trim();
  if (!candidate) return false;
  if (candidate.length <= 60 && /^[A-ZÁÉÍÓÚÑ0-9 ,./()\-:]+$/.test(candidate)) return true;
  return /^(introducción|resumen|abstract|metodolog[ií]a|conclusi[oó]n|referencias|bibliograf[ií]a|anexos?)$/i.test(candidate);
};

const truncateSummary = (value: string): string => {
  const normalized = normalizeLine(value);
  if (normalized.length <= SUMMARY_MAX_LENGTH) return normalized;

  const withinLimit = normalized.slice(0, SUMMARY_MAX_LENGTH);
  const punctuationBreak = Math.max(
    withinLimit.lastIndexOf('. '),
    withinLimit.lastIndexOf('; '),
    withinLimit.lastIndexOf(': '),
  );

  if (punctuationBreak >= SUMMARY_MIN_BREAK_INDEX) {
    return withinLimit.slice(0, punctuationBreak + 1).trim();
  }

  const commaBreak = withinLimit.lastIndexOf(', ');
  if (commaBreak >= SUMMARY_MIN_BREAK_INDEX) {
    return withinLimit.slice(0, commaBreak).trim();
  }

  const wordBreak = withinLimit.lastIndexOf(' ');
  if (wordBreak >= SUMMARY_MIN_BREAK_INDEX) {
    return withinLimit.slice(0, wordBreak).trim();
  }

  return withinLimit.trim();
};

const detectCategory = (title: string, content: string): string => {
  const candidate = `${title} ${content}`.toLowerCase();
  if (/metodolog|protocolo|calibraci[oó]n|validaci[oó]n/.test(candidate)) return 'Documento metodológico';
  if (/art[ií]culo|doi|journal|revista/.test(candidate)) return 'Artículo científico';
  if (/policy|brief/.test(candidate)) return 'Policy brief';
  if (/informe|t[eé]cnico|mission|misi[oó]n|productos l1|productos l2|productos l3/.test(candidate)) return 'Informe técnico';
  if (/an[aá]lisis/.test(candidate)) return 'Análisis';
  return 'Reporte';
};

const detectInstitution = (content: string): string => {
  const matches = [
    /Agencia Espacial Europea \(ESA\)/i,
    /Universidad Cooperativa de Colombia/i,
    /European Space Agency \(ESA\)/i,
    /\bESA\b/i,
  ];

  for (const pattern of matches) {
    const match = content.match(pattern);
    if (match?.[0]) return match[0];
  }

  return '';
};

const detectAuthorName = (lines: string[]): string => {
  for (const line of lines.slice(0, 12)) {
    if (/^autor(?:es)?[:\-]/i.test(line)) {
      return normalizeLine(line.replace(/^autor(?:es)?[:\-]\s*/i, ''));
    }
  }

  return '';
};

export const parseResearchDocxFile = async (file: File): Promise<ResearchDocxPrefill> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  const lines = result.value
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('No se pudo extraer texto del documento.');
  }

  const title = lines[0] ?? '';
  const bodyStartIndex = title ? 1 : 0;
  const remainingLines = lines.slice(bodyStartIndex);

  const referencesIndex = remainingLines.findIndex((line: string) => /^(referencias|bibliograf[ií]a)$/i.test(line));
  const contentLines = referencesIndex >= 0 ? remainingLines.slice(0, referencesIndex) : remainingLines;

  const summarySource =
    contentLines.find((line: string) => !isLikelySectionHeading(line) && line.length >= 120) ??
    contentLines.find((line: string) => !isLikelySectionHeading(line) && line.length >= 60) ??
    contentLines[0] ??
    '';

  const content = contentLines.join('\n\n');
  const category = detectCategory(title, content);
  const institution = detectInstitution(content);
  const authorName = detectAuthorName(lines);

  return {
    title,
    summary: truncateSummary(summarySource),
    content,
    category,
    authorName,
    institution,
  };
};

export type { ResearchDocxPrefill };
