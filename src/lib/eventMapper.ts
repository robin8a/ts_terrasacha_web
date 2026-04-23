import type { EventType } from '../API';
import { EventType as EventTypeEnum, Status } from '../API';
import { isWithinPublicationWindow } from './publicationWindow';

export type PublicAgendaEvent = {
  id: string;
  title: string;
  description: string;
  eventType: EventType | null;
  category: string | null;
  tags: string[];
  startDateTime: string;
  endDateTime: string | null;
  timezone: string | null;
  location: string | null;
  isOnline: boolean;
  onlineUrl: string | null;
  registrationUrl: string | null;
  capacity: number | null;
  coverImageUrl: string | null;
  highlight: boolean;
};

type AmplifyEventLike = {
  id: string;
  title?: string | null;
  description?: string | null;
  eventType?: EventType | null;
  category?: string | null;
  tags?: Array<string | null> | null;
  startDateTime: string;
  endDateTime?: string | null;
  timezone?: string | null;
  location?: string | null;
  isOnline?: boolean | null;
  onlineUrl?: string | null;
  registrationUrl?: string | null;
  capacity?: number | null;
  coverImageUrl?: string | null;
  highlight?: boolean | null;
};

export const mapAmplifyEventToPublic = (raw: AmplifyEventLike): PublicAgendaEvent => ({
  id: raw.id,
  title: raw.title ?? '',
  description: raw.description ?? '',
  eventType: raw.eventType ?? null,
  category: raw.category ?? null,
  tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === 'string' && t.length > 0) : [],
  startDateTime: raw.startDateTime,
  endDateTime: raw.endDateTime ?? null,
  timezone: raw.timezone ?? null,
  location: raw.location ?? null,
  isOnline: Boolean(raw.isOnline),
  onlineUrl: raw.onlineUrl ?? null,
  registrationUrl: raw.registrationUrl ?? null,
  capacity: typeof raw.capacity === 'number' ? raw.capacity : null,
  coverImageUrl: raw.coverImageUrl ?? null,
  highlight: Boolean(raw.highlight),
});

export const isPublicAgendaEvent = (item: {
  status: Status;
  visible?: boolean | null;
  publishedAt?: string | null;
}): boolean =>
  item.status === Status.PUBLISHED &&
  item.visible !== false &&
  isWithinPublicationWindow(item);

export const getEventTypeLabelEs = (eventType: EventType | null | undefined): string => {
  switch (eventType) {
    case EventTypeEnum.WEBINAR:
      return 'Webinar';
    case EventTypeEnum.WORKSHOP:
      return 'Taller';
    case EventTypeEnum.ONSITE:
      return 'Presencial';
    case EventTypeEnum.ONLINE:
      return 'En línea';
    case EventTypeEnum.OTHER:
      return 'Otro';
    default:
      return 'Evento';
  }
};

/** Borde izquierdo + fondo suave para tarjetas de agenda */
export const getEventCardAccentClasses = (eventType: EventType | null | undefined): string => {
  switch (eventType) {
    case EventTypeEnum.WEBINAR:
      return 'border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-white';
    case EventTypeEnum.WORKSHOP:
      return 'border-l-4 border-l-secondary-pradera bg-gradient-to-br from-secondary-pradera/10 to-white';
    case EventTypeEnum.ONSITE:
      return 'border-l-4 border-l-secondary-amarilloTierra bg-gradient-to-br from-secondary-amarilloTierra/15 to-white';
    case EventTypeEnum.ONLINE:
      return 'border-l-4 border-l-sky-500 bg-gradient-to-br from-sky-50 to-white';
    case EventTypeEnum.OTHER:
    default:
      return 'border-l-4 border-l-secondary-bosquesNublados bg-gradient-to-br from-secondary-claro/30 to-white';
  }
};

const dateFmt = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const timeFmt = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
});

export const formatEventDateRangeEs = (
  startIso: string,
  endIso?: string | null,
  _timezone?: string | null,
): string => {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return '';
  const startDate = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  if (!endIso) {
    return `${startDate} · ${startTime}`;
  }
  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) {
    return `${startDate} · ${startTime}`;
  }
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return `${startDate} · ${startTime} – ${timeFmt.format(end)}`;
  }
  return `${dateFmt.format(start)} ${startTime} → ${dateFmt.format(end)} ${timeFmt.format(end)}`;
};

export const truncatePlainText = (text: string, maxLen: number): string => {
  const t = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trim()}…`;
};
