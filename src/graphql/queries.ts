/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getNews = /* GraphQL */ `query GetNews($id: ID!) {
  getNews(id: $id) {
    id
    title
    slug
    summary
    body
    category
    tags
    coverImageUrl
    galleryImageUrls
    videoUrl
    youtubeUrl
    status
    highlight
    authorName
    publishedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetNewsQueryVariables, APITypes.GetNewsQuery>;
export const listNews = /* GraphQL */ `query ListNews($filter: ModelNewsFilterInput, $limit: Int, $nextToken: String) {
  listNews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      summary
      body
      category
      tags
      coverImageUrl
      galleryImageUrls
      videoUrl
      youtubeUrl
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListNewsQueryVariables, APITypes.ListNewsQuery>;
export const newsBySlug = /* GraphQL */ `query NewsBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelNewsFilterInput
  $limit: Int
  $nextToken: String
) {
  newsBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      summary
      body
      category
      tags
      coverImageUrl
      galleryImageUrls
      videoUrl
      youtubeUrl
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NewsBySlugQueryVariables,
  APITypes.NewsBySlugQuery
>;
export const getAnnouncement = /* GraphQL */ `query GetAnnouncement($id: ID!) {
  getAnnouncement(id: $id) {
    id
    title
    slug
    summary
    body
    type
    targetAudience
    category
    tags
    coverImageUrl
    attachmentUrls
    status
    highlight
    authorName
    publishedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAnnouncementQueryVariables,
  APITypes.GetAnnouncementQuery
>;
export const listAnnouncements = /* GraphQL */ `query ListAnnouncements(
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      summary
      body
      type
      targetAudience
      category
      tags
      coverImageUrl
      attachmentUrls
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnnouncementsQueryVariables,
  APITypes.ListAnnouncementsQuery
>;
export const announcementBySlug = /* GraphQL */ `query AnnouncementBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  announcementBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      summary
      body
      type
      targetAudience
      category
      tags
      coverImageUrl
      attachmentUrls
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnnouncementBySlugQueryVariables,
  APITypes.AnnouncementBySlugQuery
>;
export const getEvent = /* GraphQL */ `query GetEvent($id: ID!) {
  getEvent(id: $id) {
    id
    title
    description
    eventType
    category
    tags
    startDateTime
    endDateTime
    timezone
    location
    isOnline
    onlineUrl
    registrationUrl
    capacity
    coverImageUrl
    publishedAt
    highlight
    status
    visible
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetEventQueryVariables, APITypes.GetEventQuery>;
export const listEvents = /* GraphQL */ `query ListEvents(
  $filter: ModelEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      eventType
      category
      tags
      startDateTime
      endDateTime
      timezone
      location
      isOnline
      onlineUrl
      registrationUrl
      capacity
      coverImageUrl
      publishedAt
      highlight
      status
      visible
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEventsQueryVariables,
  APITypes.ListEventsQuery
>;
export const getPodcastEpisode = /* GraphQL */ `query GetPodcastEpisode($id: ID!) {
  getPodcastEpisode(id: $id) {
    id
    title
    slug
    episodeNumber
    seasonNumber
    description
    showNotes
    audioUrl
    coverImageUrl
    durationSeconds
    relatedNewsIds
    relatedAnnouncementIds
    relatedResearchIds
    externalPlayerUrl
    status
    publishedAt
    highlight
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPodcastEpisodeQueryVariables,
  APITypes.GetPodcastEpisodeQuery
>;
export const listPodcastEpisodes = /* GraphQL */ `query ListPodcastEpisodes(
  $filter: ModelPodcastEpisodeFilterInput
  $limit: Int
  $nextToken: String
) {
  listPodcastEpisodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      episodeNumber
      seasonNumber
      description
      showNotes
      audioUrl
      coverImageUrl
      durationSeconds
      relatedNewsIds
      relatedAnnouncementIds
      relatedResearchIds
      externalPlayerUrl
      status
      publishedAt
      highlight
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPodcastEpisodesQueryVariables,
  APITypes.ListPodcastEpisodesQuery
>;
export const podcastEpisodeBySlug = /* GraphQL */ `query PodcastEpisodeBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelPodcastEpisodeFilterInput
  $limit: Int
  $nextToken: String
) {
  podcastEpisodeBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      episodeNumber
      seasonNumber
      description
      showNotes
      audioUrl
      coverImageUrl
      durationSeconds
      relatedNewsIds
      relatedAnnouncementIds
      relatedResearchIds
      externalPlayerUrl
      status
      publishedAt
      highlight
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PodcastEpisodeBySlugQueryVariables,
  APITypes.PodcastEpisodeBySlugQuery
>;
export const getResearchItem = /* GraphQL */ `query GetResearchItem($id: ID!) {
  getResearchItem(id: $id) {
    id
    title
    slug
    summary
    body
    category
    tags
    coverImageUrl
    sourceDocxUrl
    pdfUrl
    attachmentUrls
    videoUrl
    status
    highlight
    authorName
    institution
    publishedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetResearchItemQueryVariables,
  APITypes.GetResearchItemQuery
>;
export const listResearchItems = /* GraphQL */ `query ListResearchItems(
  $filter: ModelResearchItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listResearchItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      summary
      body
      category
      tags
      coverImageUrl
      sourceDocxUrl
      pdfUrl
      attachmentUrls
      videoUrl
      status
      highlight
      authorName
      institution
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListResearchItemsQueryVariables,
  APITypes.ListResearchItemsQuery
>;
export const researchItemBySlug = /* GraphQL */ `query ResearchItemBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelResearchItemFilterInput
  $limit: Int
  $nextToken: String
) {
  researchItemBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      summary
      body
      category
      tags
      coverImageUrl
      sourceDocxUrl
      pdfUrl
      attachmentUrls
      videoUrl
      status
      highlight
      authorName
      institution
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ResearchItemBySlugQueryVariables,
  APITypes.ResearchItemBySlugQuery
>;
export const getInformativeCapsule = /* GraphQL */ `query GetInformativeCapsule($id: ID!) {
  getInformativeCapsule(id: $id) {
    id
    title
    slug
    summary
    body
    contextType
    legalReference
    institution
    category
    tags
    coverImageUrl
    attachmentUrls
    relatedNewsIds
    relatedResearchIds
    status
    highlight
    authorName
    publishedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInformativeCapsuleQueryVariables,
  APITypes.GetInformativeCapsuleQuery
>;
export const listInformativeCapsules = /* GraphQL */ `query ListInformativeCapsules(
  $filter: ModelInformativeCapsuleFilterInput
  $limit: Int
  $nextToken: String
) {
  listInformativeCapsules(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      summary
      body
      contextType
      legalReference
      institution
      category
      tags
      coverImageUrl
      attachmentUrls
      relatedNewsIds
      relatedResearchIds
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInformativeCapsulesQueryVariables,
  APITypes.ListInformativeCapsulesQuery
>;
export const informativeCapsuleBySlug = /* GraphQL */ `query InformativeCapsuleBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelInformativeCapsuleFilterInput
  $limit: Int
  $nextToken: String
) {
  informativeCapsuleBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      summary
      body
      contextType
      legalReference
      institution
      category
      tags
      coverImageUrl
      attachmentUrls
      relatedNewsIds
      relatedResearchIds
      status
      highlight
      authorName
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.InformativeCapsuleBySlugQueryVariables,
  APITypes.InformativeCapsuleBySlugQuery
>;
export const getEducationalVideoclip = /* GraphQL */ `query GetEducationalVideoclip($id: ID!) {
  getEducationalVideoclip(id: $id) {
    id
    title
    slug
    description
    youtubeUrl
    topicCategory
    tags
    coverImageUrl
    durationSeconds
    relatedNewsIds
    relatedAnnouncementIds
    relatedResearchIds
    relatedCapsuleIds
    relatedPodcastIds
    status
    highlight
    publishedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEducationalVideoclipQueryVariables,
  APITypes.GetEducationalVideoclipQuery
>;
export const listEducationalVideoclips = /* GraphQL */ `query ListEducationalVideoclips(
  $filter: ModelEducationalVideoclipFilterInput
  $limit: Int
  $nextToken: String
) {
  listEducationalVideoclips(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      description
      youtubeUrl
      topicCategory
      tags
      coverImageUrl
      durationSeconds
      relatedNewsIds
      relatedAnnouncementIds
      relatedResearchIds
      relatedCapsuleIds
      relatedPodcastIds
      status
      highlight
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEducationalVideoclipsQueryVariables,
  APITypes.ListEducationalVideoclipsQuery
>;
export const educationalVideoclipBySlug = /* GraphQL */ `query EducationalVideoclipBySlug(
  $slug: String!
  $sortDirection: ModelSortDirection
  $filter: ModelEducationalVideoclipFilterInput
  $limit: Int
  $nextToken: String
) {
  educationalVideoclipBySlug(
    slug: $slug
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      slug
      description
      youtubeUrl
      topicCategory
      tags
      coverImageUrl
      durationSeconds
      relatedNewsIds
      relatedAnnouncementIds
      relatedResearchIds
      relatedCapsuleIds
      relatedPodcastIds
      status
      highlight
      publishedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.EducationalVideoclipBySlugQueryVariables,
  APITypes.EducationalVideoclipBySlugQuery
>;
