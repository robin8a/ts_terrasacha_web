/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createNews = /* GraphQL */ `mutation CreateNews(
  $input: CreateNewsInput!
  $condition: ModelNewsConditionInput
) {
  createNews(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateNewsMutationVariables,
  APITypes.CreateNewsMutation
>;
export const updateNews = /* GraphQL */ `mutation UpdateNews(
  $input: UpdateNewsInput!
  $condition: ModelNewsConditionInput
) {
  updateNews(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateNewsMutationVariables,
  APITypes.UpdateNewsMutation
>;
export const deleteNews = /* GraphQL */ `mutation DeleteNews(
  $input: DeleteNewsInput!
  $condition: ModelNewsConditionInput
) {
  deleteNews(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteNewsMutationVariables,
  APITypes.DeleteNewsMutation
>;
export const createAnnouncement = /* GraphQL */ `mutation CreateAnnouncement(
  $input: CreateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  createAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAnnouncementMutationVariables,
  APITypes.CreateAnnouncementMutation
>;
export const updateAnnouncement = /* GraphQL */ `mutation UpdateAnnouncement(
  $input: UpdateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  updateAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAnnouncementMutationVariables,
  APITypes.UpdateAnnouncementMutation
>;
export const deleteAnnouncement = /* GraphQL */ `mutation DeleteAnnouncement(
  $input: DeleteAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  deleteAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAnnouncementMutationVariables,
  APITypes.DeleteAnnouncementMutation
>;
export const createEvent = /* GraphQL */ `mutation CreateEvent(
  $input: CreateEventInput!
  $condition: ModelEventConditionInput
) {
  createEvent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEventMutationVariables,
  APITypes.CreateEventMutation
>;
export const updateEvent = /* GraphQL */ `mutation UpdateEvent(
  $input: UpdateEventInput!
  $condition: ModelEventConditionInput
) {
  updateEvent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEventMutationVariables,
  APITypes.UpdateEventMutation
>;
export const deleteEvent = /* GraphQL */ `mutation DeleteEvent(
  $input: DeleteEventInput!
  $condition: ModelEventConditionInput
) {
  deleteEvent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEventMutationVariables,
  APITypes.DeleteEventMutation
>;
export const createPodcastEpisode = /* GraphQL */ `mutation CreatePodcastEpisode(
  $input: CreatePodcastEpisodeInput!
  $condition: ModelPodcastEpisodeConditionInput
) {
  createPodcastEpisode(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePodcastEpisodeMutationVariables,
  APITypes.CreatePodcastEpisodeMutation
>;
export const updatePodcastEpisode = /* GraphQL */ `mutation UpdatePodcastEpisode(
  $input: UpdatePodcastEpisodeInput!
  $condition: ModelPodcastEpisodeConditionInput
) {
  updatePodcastEpisode(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePodcastEpisodeMutationVariables,
  APITypes.UpdatePodcastEpisodeMutation
>;
export const deletePodcastEpisode = /* GraphQL */ `mutation DeletePodcastEpisode(
  $input: DeletePodcastEpisodeInput!
  $condition: ModelPodcastEpisodeConditionInput
) {
  deletePodcastEpisode(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePodcastEpisodeMutationVariables,
  APITypes.DeletePodcastEpisodeMutation
>;
export const createResearchItem = /* GraphQL */ `mutation CreateResearchItem(
  $input: CreateResearchItemInput!
  $condition: ModelResearchItemConditionInput
) {
  createResearchItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateResearchItemMutationVariables,
  APITypes.CreateResearchItemMutation
>;
export const updateResearchItem = /* GraphQL */ `mutation UpdateResearchItem(
  $input: UpdateResearchItemInput!
  $condition: ModelResearchItemConditionInput
) {
  updateResearchItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateResearchItemMutationVariables,
  APITypes.UpdateResearchItemMutation
>;
export const deleteResearchItem = /* GraphQL */ `mutation DeleteResearchItem(
  $input: DeleteResearchItemInput!
  $condition: ModelResearchItemConditionInput
) {
  deleteResearchItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteResearchItemMutationVariables,
  APITypes.DeleteResearchItemMutation
>;
export const createInformativeCapsule = /* GraphQL */ `mutation CreateInformativeCapsule(
  $input: CreateInformativeCapsuleInput!
  $condition: ModelInformativeCapsuleConditionInput
) {
  createInformativeCapsule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateInformativeCapsuleMutationVariables,
  APITypes.CreateInformativeCapsuleMutation
>;
export const updateInformativeCapsule = /* GraphQL */ `mutation UpdateInformativeCapsule(
  $input: UpdateInformativeCapsuleInput!
  $condition: ModelInformativeCapsuleConditionInput
) {
  updateInformativeCapsule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateInformativeCapsuleMutationVariables,
  APITypes.UpdateInformativeCapsuleMutation
>;
export const deleteInformativeCapsule = /* GraphQL */ `mutation DeleteInformativeCapsule(
  $input: DeleteInformativeCapsuleInput!
  $condition: ModelInformativeCapsuleConditionInput
) {
  deleteInformativeCapsule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteInformativeCapsuleMutationVariables,
  APITypes.DeleteInformativeCapsuleMutation
>;
export const createEducationalVideoclip = /* GraphQL */ `mutation CreateEducationalVideoclip(
  $input: CreateEducationalVideoclipInput!
  $condition: ModelEducationalVideoclipConditionInput
) {
  createEducationalVideoclip(input: $input, condition: $condition) {
    id
    title
    slug
    description
    youtubeUrl
    tiktokUrl
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
` as GeneratedMutation<
  APITypes.CreateEducationalVideoclipMutationVariables,
  APITypes.CreateEducationalVideoclipMutation
>;
export const updateEducationalVideoclip = /* GraphQL */ `mutation UpdateEducationalVideoclip(
  $input: UpdateEducationalVideoclipInput!
  $condition: ModelEducationalVideoclipConditionInput
) {
  updateEducationalVideoclip(input: $input, condition: $condition) {
    id
    title
    slug
    description
    youtubeUrl
    tiktokUrl
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
` as GeneratedMutation<
  APITypes.UpdateEducationalVideoclipMutationVariables,
  APITypes.UpdateEducationalVideoclipMutation
>;
export const deleteEducationalVideoclip = /* GraphQL */ `mutation DeleteEducationalVideoclip(
  $input: DeleteEducationalVideoclipInput!
  $condition: ModelEducationalVideoclipConditionInput
) {
  deleteEducationalVideoclip(input: $input, condition: $condition) {
    id
    title
    slug
    description
    youtubeUrl
    tiktokUrl
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
` as GeneratedMutation<
  APITypes.DeleteEducationalVideoclipMutationVariables,
  APITypes.DeleteEducationalVideoclipMutation
>;
