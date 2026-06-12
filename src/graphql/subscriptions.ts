/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateNews = /* GraphQL */ `subscription OnCreateNews($filter: ModelSubscriptionNewsFilterInput) {
  onCreateNews(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNewsSubscriptionVariables,
  APITypes.OnCreateNewsSubscription
>;
export const onUpdateNews = /* GraphQL */ `subscription OnUpdateNews($filter: ModelSubscriptionNewsFilterInput) {
  onUpdateNews(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNewsSubscriptionVariables,
  APITypes.OnUpdateNewsSubscription
>;
export const onDeleteNews = /* GraphQL */ `subscription OnDeleteNews($filter: ModelSubscriptionNewsFilterInput) {
  onDeleteNews(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNewsSubscriptionVariables,
  APITypes.OnDeleteNewsSubscription
>;
export const onCreateAnnouncement = /* GraphQL */ `subscription OnCreateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onCreateAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAnnouncementSubscriptionVariables,
  APITypes.OnCreateAnnouncementSubscription
>;
export const onUpdateAnnouncement = /* GraphQL */ `subscription OnUpdateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onUpdateAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAnnouncementSubscriptionVariables,
  APITypes.OnUpdateAnnouncementSubscription
>;
export const onDeleteAnnouncement = /* GraphQL */ `subscription OnDeleteAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onDeleteAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAnnouncementSubscriptionVariables,
  APITypes.OnDeleteAnnouncementSubscription
>;
export const onCreateEvent = /* GraphQL */ `subscription OnCreateEvent($filter: ModelSubscriptionEventFilterInput) {
  onCreateEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEventSubscriptionVariables,
  APITypes.OnCreateEventSubscription
>;
export const onUpdateEvent = /* GraphQL */ `subscription OnUpdateEvent($filter: ModelSubscriptionEventFilterInput) {
  onUpdateEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEventSubscriptionVariables,
  APITypes.OnUpdateEventSubscription
>;
export const onDeleteEvent = /* GraphQL */ `subscription OnDeleteEvent($filter: ModelSubscriptionEventFilterInput) {
  onDeleteEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEventSubscriptionVariables,
  APITypes.OnDeleteEventSubscription
>;
export const onCreatePodcastEpisode = /* GraphQL */ `subscription OnCreatePodcastEpisode(
  $filter: ModelSubscriptionPodcastEpisodeFilterInput
) {
  onCreatePodcastEpisode(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePodcastEpisodeSubscriptionVariables,
  APITypes.OnCreatePodcastEpisodeSubscription
>;
export const onUpdatePodcastEpisode = /* GraphQL */ `subscription OnUpdatePodcastEpisode(
  $filter: ModelSubscriptionPodcastEpisodeFilterInput
) {
  onUpdatePodcastEpisode(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePodcastEpisodeSubscriptionVariables,
  APITypes.OnUpdatePodcastEpisodeSubscription
>;
export const onDeletePodcastEpisode = /* GraphQL */ `subscription OnDeletePodcastEpisode(
  $filter: ModelSubscriptionPodcastEpisodeFilterInput
) {
  onDeletePodcastEpisode(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePodcastEpisodeSubscriptionVariables,
  APITypes.OnDeletePodcastEpisodeSubscription
>;
export const onCreateResearchItem = /* GraphQL */ `subscription OnCreateResearchItem(
  $filter: ModelSubscriptionResearchItemFilterInput
) {
  onCreateResearchItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateResearchItemSubscriptionVariables,
  APITypes.OnCreateResearchItemSubscription
>;
export const onUpdateResearchItem = /* GraphQL */ `subscription OnUpdateResearchItem(
  $filter: ModelSubscriptionResearchItemFilterInput
) {
  onUpdateResearchItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateResearchItemSubscriptionVariables,
  APITypes.OnUpdateResearchItemSubscription
>;
export const onDeleteResearchItem = /* GraphQL */ `subscription OnDeleteResearchItem(
  $filter: ModelSubscriptionResearchItemFilterInput
) {
  onDeleteResearchItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteResearchItemSubscriptionVariables,
  APITypes.OnDeleteResearchItemSubscription
>;
export const onCreateInformativeCapsule = /* GraphQL */ `subscription OnCreateInformativeCapsule(
  $filter: ModelSubscriptionInformativeCapsuleFilterInput
) {
  onCreateInformativeCapsule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateInformativeCapsuleSubscriptionVariables,
  APITypes.OnCreateInformativeCapsuleSubscription
>;
export const onUpdateInformativeCapsule = /* GraphQL */ `subscription OnUpdateInformativeCapsule(
  $filter: ModelSubscriptionInformativeCapsuleFilterInput
) {
  onUpdateInformativeCapsule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateInformativeCapsuleSubscriptionVariables,
  APITypes.OnUpdateInformativeCapsuleSubscription
>;
export const onDeleteInformativeCapsule = /* GraphQL */ `subscription OnDeleteInformativeCapsule(
  $filter: ModelSubscriptionInformativeCapsuleFilterInput
) {
  onDeleteInformativeCapsule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteInformativeCapsuleSubscriptionVariables,
  APITypes.OnDeleteInformativeCapsuleSubscription
>;
export const onCreateEducationalVideoclip = /* GraphQL */ `subscription OnCreateEducationalVideoclip(
  $filter: ModelSubscriptionEducationalVideoclipFilterInput
) {
  onCreateEducationalVideoclip(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEducationalVideoclipSubscriptionVariables,
  APITypes.OnCreateEducationalVideoclipSubscription
>;
export const onUpdateEducationalVideoclip = /* GraphQL */ `subscription OnUpdateEducationalVideoclip(
  $filter: ModelSubscriptionEducationalVideoclipFilterInput
) {
  onUpdateEducationalVideoclip(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEducationalVideoclipSubscriptionVariables,
  APITypes.OnUpdateEducationalVideoclipSubscription
>;
export const onDeleteEducationalVideoclip = /* GraphQL */ `subscription OnDeleteEducationalVideoclip(
  $filter: ModelSubscriptionEducationalVideoclipFilterInput
) {
  onDeleteEducationalVideoclip(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEducationalVideoclipSubscriptionVariables,
  APITypes.OnDeleteEducationalVideoclipSubscription
>;
