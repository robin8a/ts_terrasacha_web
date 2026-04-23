/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateNewsInput = {
  id?: string | null,
  title: string,
  slug: string,
  summary: string,
  body: string,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  galleryImageUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  youtubeUrl?: string | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum Status {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}


export type ModelNewsConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  galleryImageUrls?: ModelStringInput | null,
  videoUrl?: ModelStringInput | null,
  youtubeUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelNewsConditionInput | null > | null,
  or?: Array< ModelNewsConditionInput | null > | null,
  not?: ModelNewsConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStatusInput = {
  eq?: Status | null,
  ne?: Status | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type News = {
  __typename: "News",
  id: string,
  title: string,
  slug: string,
  summary: string,
  body: string,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  galleryImageUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  youtubeUrl?: string | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateNewsInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  summary?: string | null,
  body?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  galleryImageUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  youtubeUrl?: string | null,
  status?: Status | null,
  highlight?: boolean | null,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteNewsInput = {
  id: string,
};

export type CreateAnnouncementInput = {
  id?: string | null,
  title: string,
  slug: string,
  summary: string,
  body: string,
  type?: string | null,
  targetAudience?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAnnouncementConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  type?: ModelStringInput | null,
  targetAudience?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  attachmentUrls?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAnnouncementConditionInput | null > | null,
  or?: Array< ModelAnnouncementConditionInput | null > | null,
  not?: ModelAnnouncementConditionInput | null,
};

export type Announcement = {
  __typename: "Announcement",
  id: string,
  title: string,
  slug: string,
  summary: string,
  body: string,
  type?: string | null,
  targetAudience?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateAnnouncementInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  summary?: string | null,
  body?: string | null,
  type?: string | null,
  targetAudience?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  status?: Status | null,
  highlight?: boolean | null,
  authorName?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteAnnouncementInput = {
  id: string,
};

export type CreateEventInput = {
  id?: string | null,
  title: string,
  description: string,
  eventType?: EventType | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  startDateTime: string,
  endDateTime?: string | null,
  timezone?: string | null,
  location?: string | null,
  isOnline: boolean,
  onlineUrl?: string | null,
  registrationUrl?: string | null,
  capacity?: number | null,
  coverImageUrl?: string | null,
  publishedAt?: string | null,
  highlight: boolean,
  status: Status,
  visible: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum EventType {
  WEBINAR = "WEBINAR",
  WORKSHOP = "WORKSHOP",
  ONSITE = "ONSITE",
  ONLINE = "ONLINE",
  OTHER = "OTHER",
}


export type ModelEventConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  eventType?: ModelEventTypeInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  startDateTime?: ModelStringInput | null,
  endDateTime?: ModelStringInput | null,
  timezone?: ModelStringInput | null,
  location?: ModelStringInput | null,
  isOnline?: ModelBooleanInput | null,
  onlineUrl?: ModelStringInput | null,
  registrationUrl?: ModelStringInput | null,
  capacity?: ModelIntInput | null,
  coverImageUrl?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  highlight?: ModelBooleanInput | null,
  status?: ModelStatusInput | null,
  visible?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEventConditionInput | null > | null,
  or?: Array< ModelEventConditionInput | null > | null,
  not?: ModelEventConditionInput | null,
};

export type ModelEventTypeInput = {
  eq?: EventType | null,
  ne?: EventType | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Event = {
  __typename: "Event",
  id: string,
  title: string,
  description: string,
  eventType?: EventType | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  startDateTime: string,
  endDateTime?: string | null,
  timezone?: string | null,
  location?: string | null,
  isOnline: boolean,
  onlineUrl?: string | null,
  registrationUrl?: string | null,
  capacity?: number | null,
  coverImageUrl?: string | null,
  publishedAt?: string | null,
  highlight: boolean,
  status: Status,
  visible: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateEventInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  eventType?: EventType | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  startDateTime?: string | null,
  endDateTime?: string | null,
  timezone?: string | null,
  location?: string | null,
  isOnline?: boolean | null,
  onlineUrl?: string | null,
  registrationUrl?: string | null,
  capacity?: number | null,
  coverImageUrl?: string | null,
  publishedAt?: string | null,
  highlight?: boolean | null,
  status?: Status | null,
  visible?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteEventInput = {
  id: string,
};

export type CreatePodcastEpisodeInput = {
  id?: string | null,
  title: string,
  slug: string,
  episodeNumber?: number | null,
  seasonNumber?: number | null,
  description: string,
  showNotes?: string | null,
  audioUrl: string,
  coverImageUrl?: string | null,
  durationSeconds?: number | null,
  relatedNewsIds?: Array< string | null > | null,
  relatedAnnouncementIds?: Array< string | null > | null,
  relatedResearchIds?: Array< string | null > | null,
  externalPlayerUrl?: string | null,
  status: Status,
  publishedAt?: string | null,
  highlight: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelPodcastEpisodeConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  episodeNumber?: ModelIntInput | null,
  seasonNumber?: ModelIntInput | null,
  description?: ModelStringInput | null,
  showNotes?: ModelStringInput | null,
  audioUrl?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  durationSeconds?: ModelIntInput | null,
  relatedNewsIds?: ModelIDInput | null,
  relatedAnnouncementIds?: ModelIDInput | null,
  relatedResearchIds?: ModelIDInput | null,
  externalPlayerUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  publishedAt?: ModelStringInput | null,
  highlight?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPodcastEpisodeConditionInput | null > | null,
  or?: Array< ModelPodcastEpisodeConditionInput | null > | null,
  not?: ModelPodcastEpisodeConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type PodcastEpisode = {
  __typename: "PodcastEpisode",
  id: string,
  title: string,
  slug: string,
  episodeNumber?: number | null,
  seasonNumber?: number | null,
  description: string,
  showNotes?: string | null,
  audioUrl: string,
  coverImageUrl?: string | null,
  durationSeconds?: number | null,
  relatedNewsIds?: Array< string | null > | null,
  relatedAnnouncementIds?: Array< string | null > | null,
  relatedResearchIds?: Array< string | null > | null,
  externalPlayerUrl?: string | null,
  status: Status,
  publishedAt?: string | null,
  highlight: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdatePodcastEpisodeInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  episodeNumber?: number | null,
  seasonNumber?: number | null,
  description?: string | null,
  showNotes?: string | null,
  audioUrl?: string | null,
  coverImageUrl?: string | null,
  durationSeconds?: number | null,
  relatedNewsIds?: Array< string | null > | null,
  relatedAnnouncementIds?: Array< string | null > | null,
  relatedResearchIds?: Array< string | null > | null,
  externalPlayerUrl?: string | null,
  status?: Status | null,
  publishedAt?: string | null,
  highlight?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeletePodcastEpisodeInput = {
  id: string,
};

export type CreateResearchItemInput = {
  id?: string | null,
  title: string,
  slug: string,
  summary: string,
  body: string,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  sourceDocxUrl?: string | null,
  pdfUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  institution?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelResearchItemConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  sourceDocxUrl?: ModelStringInput | null,
  pdfUrl?: ModelStringInput | null,
  attachmentUrls?: ModelStringInput | null,
  videoUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  institution?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelResearchItemConditionInput | null > | null,
  or?: Array< ModelResearchItemConditionInput | null > | null,
  not?: ModelResearchItemConditionInput | null,
};

export type ResearchItem = {
  __typename: "ResearchItem",
  id: string,
  title: string,
  slug: string,
  summary: string,
  body: string,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  sourceDocxUrl?: string | null,
  pdfUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  status: Status,
  highlight: boolean,
  authorName?: string | null,
  institution?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateResearchItemInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  summary?: string | null,
  body?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  coverImageUrl?: string | null,
  sourceDocxUrl?: string | null,
  pdfUrl?: string | null,
  attachmentUrls?: Array< string | null > | null,
  videoUrl?: string | null,
  status?: Status | null,
  highlight?: boolean | null,
  authorName?: string | null,
  institution?: string | null,
  publishedAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteResearchItemInput = {
  id: string,
};

export type ModelNewsFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  galleryImageUrls?: ModelStringInput | null,
  videoUrl?: ModelStringInput | null,
  youtubeUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelNewsFilterInput | null > | null,
  or?: Array< ModelNewsFilterInput | null > | null,
  not?: ModelNewsFilterInput | null,
};

export type ModelNewsConnection = {
  __typename: "ModelNewsConnection",
  items:  Array<News | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelAnnouncementFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  type?: ModelStringInput | null,
  targetAudience?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  attachmentUrls?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAnnouncementFilterInput | null > | null,
  or?: Array< ModelAnnouncementFilterInput | null > | null,
  not?: ModelAnnouncementFilterInput | null,
};

export type ModelAnnouncementConnection = {
  __typename: "ModelAnnouncementConnection",
  items:  Array<Announcement | null >,
  nextToken?: string | null,
};

export type ModelEventFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  eventType?: ModelEventTypeInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  startDateTime?: ModelStringInput | null,
  endDateTime?: ModelStringInput | null,
  timezone?: ModelStringInput | null,
  location?: ModelStringInput | null,
  isOnline?: ModelBooleanInput | null,
  onlineUrl?: ModelStringInput | null,
  registrationUrl?: ModelStringInput | null,
  capacity?: ModelIntInput | null,
  coverImageUrl?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  highlight?: ModelBooleanInput | null,
  status?: ModelStatusInput | null,
  visible?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEventFilterInput | null > | null,
  or?: Array< ModelEventFilterInput | null > | null,
  not?: ModelEventFilterInput | null,
};

export type ModelEventConnection = {
  __typename: "ModelEventConnection",
  items:  Array<Event | null >,
  nextToken?: string | null,
};

export type ModelPodcastEpisodeFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  episodeNumber?: ModelIntInput | null,
  seasonNumber?: ModelIntInput | null,
  description?: ModelStringInput | null,
  showNotes?: ModelStringInput | null,
  audioUrl?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  durationSeconds?: ModelIntInput | null,
  relatedNewsIds?: ModelIDInput | null,
  relatedAnnouncementIds?: ModelIDInput | null,
  relatedResearchIds?: ModelIDInput | null,
  externalPlayerUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  publishedAt?: ModelStringInput | null,
  highlight?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPodcastEpisodeFilterInput | null > | null,
  or?: Array< ModelPodcastEpisodeFilterInput | null > | null,
  not?: ModelPodcastEpisodeFilterInput | null,
};

export type ModelPodcastEpisodeConnection = {
  __typename: "ModelPodcastEpisodeConnection",
  items:  Array<PodcastEpisode | null >,
  nextToken?: string | null,
};

export type ModelResearchItemFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  sourceDocxUrl?: ModelStringInput | null,
  pdfUrl?: ModelStringInput | null,
  attachmentUrls?: ModelStringInput | null,
  videoUrl?: ModelStringInput | null,
  status?: ModelStatusInput | null,
  highlight?: ModelBooleanInput | null,
  authorName?: ModelStringInput | null,
  institution?: ModelStringInput | null,
  publishedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelResearchItemFilterInput | null > | null,
  or?: Array< ModelResearchItemFilterInput | null > | null,
  not?: ModelResearchItemFilterInput | null,
};

export type ModelResearchItemConnection = {
  __typename: "ModelResearchItemConnection",
  items:  Array<ResearchItem | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionNewsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  summary?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  galleryImageUrls?: ModelSubscriptionStringInput | null,
  videoUrl?: ModelSubscriptionStringInput | null,
  youtubeUrl?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  highlight?: ModelSubscriptionBooleanInput | null,
  authorName?: ModelSubscriptionStringInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionNewsFilterInput | null > | null,
  or?: Array< ModelSubscriptionNewsFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionAnnouncementFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  summary?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  targetAudience?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  attachmentUrls?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  highlight?: ModelSubscriptionBooleanInput | null,
  authorName?: ModelSubscriptionStringInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
  or?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
};

export type ModelSubscriptionEventFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  eventType?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  startDateTime?: ModelSubscriptionStringInput | null,
  endDateTime?: ModelSubscriptionStringInput | null,
  timezone?: ModelSubscriptionStringInput | null,
  location?: ModelSubscriptionStringInput | null,
  isOnline?: ModelSubscriptionBooleanInput | null,
  onlineUrl?: ModelSubscriptionStringInput | null,
  registrationUrl?: ModelSubscriptionStringInput | null,
  capacity?: ModelSubscriptionIntInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  highlight?: ModelSubscriptionBooleanInput | null,
  status?: ModelSubscriptionStringInput | null,
  visible?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionEventFilterInput | null > | null,
  or?: Array< ModelSubscriptionEventFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionPodcastEpisodeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  episodeNumber?: ModelSubscriptionIntInput | null,
  seasonNumber?: ModelSubscriptionIntInput | null,
  description?: ModelSubscriptionStringInput | null,
  showNotes?: ModelSubscriptionStringInput | null,
  audioUrl?: ModelSubscriptionStringInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  durationSeconds?: ModelSubscriptionIntInput | null,
  relatedNewsIds?: ModelSubscriptionIDInput | null,
  relatedAnnouncementIds?: ModelSubscriptionIDInput | null,
  relatedResearchIds?: ModelSubscriptionIDInput | null,
  externalPlayerUrl?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  highlight?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPodcastEpisodeFilterInput | null > | null,
  or?: Array< ModelSubscriptionPodcastEpisodeFilterInput | null > | null,
};

export type ModelSubscriptionResearchItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  summary?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  sourceDocxUrl?: ModelSubscriptionStringInput | null,
  pdfUrl?: ModelSubscriptionStringInput | null,
  attachmentUrls?: ModelSubscriptionStringInput | null,
  videoUrl?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  highlight?: ModelSubscriptionBooleanInput | null,
  authorName?: ModelSubscriptionStringInput | null,
  institution?: ModelSubscriptionStringInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionResearchItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionResearchItemFilterInput | null > | null,
};

export type CreateNewsMutationVariables = {
  input: CreateNewsInput,
  condition?: ModelNewsConditionInput | null,
};

export type CreateNewsMutation = {
  createNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateNewsMutationVariables = {
  input: UpdateNewsInput,
  condition?: ModelNewsConditionInput | null,
};

export type UpdateNewsMutation = {
  updateNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteNewsMutationVariables = {
  input: DeleteNewsInput,
  condition?: ModelNewsConditionInput | null,
};

export type DeleteNewsMutation = {
  deleteNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateAnnouncementMutationVariables = {
  input: CreateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type CreateAnnouncementMutation = {
  createAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateAnnouncementMutationVariables = {
  input: UpdateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type UpdateAnnouncementMutation = {
  updateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteAnnouncementMutationVariables = {
  input: DeleteAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type DeleteAnnouncementMutation = {
  deleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateEventMutationVariables = {
  input: CreateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type CreateEventMutation = {
  createEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateEventMutationVariables = {
  input: UpdateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type UpdateEventMutation = {
  updateEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteEventMutationVariables = {
  input: DeleteEventInput,
  condition?: ModelEventConditionInput | null,
};

export type DeleteEventMutation = {
  deleteEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreatePodcastEpisodeMutationVariables = {
  input: CreatePodcastEpisodeInput,
  condition?: ModelPodcastEpisodeConditionInput | null,
};

export type CreatePodcastEpisodeMutation = {
  createPodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdatePodcastEpisodeMutationVariables = {
  input: UpdatePodcastEpisodeInput,
  condition?: ModelPodcastEpisodeConditionInput | null,
};

export type UpdatePodcastEpisodeMutation = {
  updatePodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeletePodcastEpisodeMutationVariables = {
  input: DeletePodcastEpisodeInput,
  condition?: ModelPodcastEpisodeConditionInput | null,
};

export type DeletePodcastEpisodeMutation = {
  deletePodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateResearchItemMutationVariables = {
  input: CreateResearchItemInput,
  condition?: ModelResearchItemConditionInput | null,
};

export type CreateResearchItemMutation = {
  createResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateResearchItemMutationVariables = {
  input: UpdateResearchItemInput,
  condition?: ModelResearchItemConditionInput | null,
};

export type UpdateResearchItemMutation = {
  updateResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteResearchItemMutationVariables = {
  input: DeleteResearchItemInput,
  condition?: ModelResearchItemConditionInput | null,
};

export type DeleteResearchItemMutation = {
  deleteResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetNewsQueryVariables = {
  id: string,
};

export type GetNewsQuery = {
  getNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListNewsQueryVariables = {
  filter?: ModelNewsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNewsQuery = {
  listNews?:  {
    __typename: "ModelNewsConnection",
    items:  Array< {
      __typename: "News",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      galleryImageUrls?: Array< string | null > | null,
      videoUrl?: string | null,
      youtubeUrl?: string | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type NewsBySlugQueryVariables = {
  slug: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNewsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NewsBySlugQuery = {
  newsBySlug?:  {
    __typename: "ModelNewsConnection",
    items:  Array< {
      __typename: "News",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      galleryImageUrls?: Array< string | null > | null,
      videoUrl?: string | null,
      youtubeUrl?: string | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAnnouncementQueryVariables = {
  id: string,
};

export type GetAnnouncementQuery = {
  getAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListAnnouncementsQueryVariables = {
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnnouncementsQuery = {
  listAnnouncements?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      type?: string | null,
      targetAudience?: string | null,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      attachmentUrls?: Array< string | null > | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AnnouncementBySlugQueryVariables = {
  slug: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AnnouncementBySlugQuery = {
  announcementBySlug?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      type?: string | null,
      targetAudience?: string | null,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      attachmentUrls?: Array< string | null > | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetEventQueryVariables = {
  id: string,
};

export type GetEventQuery = {
  getEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListEventsQueryVariables = {
  filter?: ModelEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEventsQuery = {
  listEvents?:  {
    __typename: "ModelEventConnection",
    items:  Array< {
      __typename: "Event",
      id: string,
      title: string,
      description: string,
      eventType?: EventType | null,
      category?: string | null,
      tags?: Array< string | null > | null,
      startDateTime: string,
      endDateTime?: string | null,
      timezone?: string | null,
      location?: string | null,
      isOnline: boolean,
      onlineUrl?: string | null,
      registrationUrl?: string | null,
      capacity?: number | null,
      coverImageUrl?: string | null,
      publishedAt?: string | null,
      highlight: boolean,
      status: Status,
      visible: boolean,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPodcastEpisodeQueryVariables = {
  id: string,
};

export type GetPodcastEpisodeQuery = {
  getPodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListPodcastEpisodesQueryVariables = {
  filter?: ModelPodcastEpisodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPodcastEpisodesQuery = {
  listPodcastEpisodes?:  {
    __typename: "ModelPodcastEpisodeConnection",
    items:  Array< {
      __typename: "PodcastEpisode",
      id: string,
      title: string,
      slug: string,
      episodeNumber?: number | null,
      seasonNumber?: number | null,
      description: string,
      showNotes?: string | null,
      audioUrl: string,
      coverImageUrl?: string | null,
      durationSeconds?: number | null,
      relatedNewsIds?: Array< string | null > | null,
      relatedAnnouncementIds?: Array< string | null > | null,
      relatedResearchIds?: Array< string | null > | null,
      externalPlayerUrl?: string | null,
      status: Status,
      publishedAt?: string | null,
      highlight: boolean,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PodcastEpisodeBySlugQueryVariables = {
  slug: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPodcastEpisodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PodcastEpisodeBySlugQuery = {
  podcastEpisodeBySlug?:  {
    __typename: "ModelPodcastEpisodeConnection",
    items:  Array< {
      __typename: "PodcastEpisode",
      id: string,
      title: string,
      slug: string,
      episodeNumber?: number | null,
      seasonNumber?: number | null,
      description: string,
      showNotes?: string | null,
      audioUrl: string,
      coverImageUrl?: string | null,
      durationSeconds?: number | null,
      relatedNewsIds?: Array< string | null > | null,
      relatedAnnouncementIds?: Array< string | null > | null,
      relatedResearchIds?: Array< string | null > | null,
      externalPlayerUrl?: string | null,
      status: Status,
      publishedAt?: string | null,
      highlight: boolean,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetResearchItemQueryVariables = {
  id: string,
};

export type GetResearchItemQuery = {
  getResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListResearchItemsQueryVariables = {
  filter?: ModelResearchItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListResearchItemsQuery = {
  listResearchItems?:  {
    __typename: "ModelResearchItemConnection",
    items:  Array< {
      __typename: "ResearchItem",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      sourceDocxUrl?: string | null,
      pdfUrl?: string | null,
      attachmentUrls?: Array< string | null > | null,
      videoUrl?: string | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      institution?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ResearchItemBySlugQueryVariables = {
  slug: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelResearchItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ResearchItemBySlugQuery = {
  researchItemBySlug?:  {
    __typename: "ModelResearchItemConnection",
    items:  Array< {
      __typename: "ResearchItem",
      id: string,
      title: string,
      slug: string,
      summary: string,
      body: string,
      category?: string | null,
      tags?: Array< string | null > | null,
      coverImageUrl?: string | null,
      sourceDocxUrl?: string | null,
      pdfUrl?: string | null,
      attachmentUrls?: Array< string | null > | null,
      videoUrl?: string | null,
      status: Status,
      highlight: boolean,
      authorName?: string | null,
      institution?: string | null,
      publishedAt?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateNewsSubscriptionVariables = {
  filter?: ModelSubscriptionNewsFilterInput | null,
};

export type OnCreateNewsSubscription = {
  onCreateNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateNewsSubscriptionVariables = {
  filter?: ModelSubscriptionNewsFilterInput | null,
};

export type OnUpdateNewsSubscription = {
  onUpdateNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteNewsSubscriptionVariables = {
  filter?: ModelSubscriptionNewsFilterInput | null,
};

export type OnDeleteNewsSubscription = {
  onDeleteNews?:  {
    __typename: "News",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    galleryImageUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    youtubeUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnCreateAnnouncementSubscription = {
  onCreateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnUpdateAnnouncementSubscription = {
  onUpdateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnDeleteAnnouncementSubscription = {
  onDeleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    type?: string | null,
    targetAudience?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateEventSubscriptionVariables = {
  filter?: ModelSubscriptionEventFilterInput | null,
};

export type OnCreateEventSubscription = {
  onCreateEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateEventSubscriptionVariables = {
  filter?: ModelSubscriptionEventFilterInput | null,
};

export type OnUpdateEventSubscription = {
  onUpdateEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteEventSubscriptionVariables = {
  filter?: ModelSubscriptionEventFilterInput | null,
};

export type OnDeleteEventSubscription = {
  onDeleteEvent?:  {
    __typename: "Event",
    id: string,
    title: string,
    description: string,
    eventType?: EventType | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    startDateTime: string,
    endDateTime?: string | null,
    timezone?: string | null,
    location?: string | null,
    isOnline: boolean,
    onlineUrl?: string | null,
    registrationUrl?: string | null,
    capacity?: number | null,
    coverImageUrl?: string | null,
    publishedAt?: string | null,
    highlight: boolean,
    status: Status,
    visible: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreatePodcastEpisodeSubscriptionVariables = {
  filter?: ModelSubscriptionPodcastEpisodeFilterInput | null,
};

export type OnCreatePodcastEpisodeSubscription = {
  onCreatePodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdatePodcastEpisodeSubscriptionVariables = {
  filter?: ModelSubscriptionPodcastEpisodeFilterInput | null,
};

export type OnUpdatePodcastEpisodeSubscription = {
  onUpdatePodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeletePodcastEpisodeSubscriptionVariables = {
  filter?: ModelSubscriptionPodcastEpisodeFilterInput | null,
};

export type OnDeletePodcastEpisodeSubscription = {
  onDeletePodcastEpisode?:  {
    __typename: "PodcastEpisode",
    id: string,
    title: string,
    slug: string,
    episodeNumber?: number | null,
    seasonNumber?: number | null,
    description: string,
    showNotes?: string | null,
    audioUrl: string,
    coverImageUrl?: string | null,
    durationSeconds?: number | null,
    relatedNewsIds?: Array< string | null > | null,
    relatedAnnouncementIds?: Array< string | null > | null,
    relatedResearchIds?: Array< string | null > | null,
    externalPlayerUrl?: string | null,
    status: Status,
    publishedAt?: string | null,
    highlight: boolean,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateResearchItemSubscriptionVariables = {
  filter?: ModelSubscriptionResearchItemFilterInput | null,
};

export type OnCreateResearchItemSubscription = {
  onCreateResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateResearchItemSubscriptionVariables = {
  filter?: ModelSubscriptionResearchItemFilterInput | null,
};

export type OnUpdateResearchItemSubscription = {
  onUpdateResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteResearchItemSubscriptionVariables = {
  filter?: ModelSubscriptionResearchItemFilterInput | null,
};

export type OnDeleteResearchItemSubscription = {
  onDeleteResearchItem?:  {
    __typename: "ResearchItem",
    id: string,
    title: string,
    slug: string,
    summary: string,
    body: string,
    category?: string | null,
    tags?: Array< string | null > | null,
    coverImageUrl?: string | null,
    sourceDocxUrl?: string | null,
    pdfUrl?: string | null,
    attachmentUrls?: Array< string | null > | null,
    videoUrl?: string | null,
    status: Status,
    highlight: boolean,
    authorName?: string | null,
    institution?: string | null,
    publishedAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};
