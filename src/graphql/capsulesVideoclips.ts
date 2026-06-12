export const LIST_INFORMATIVE_CAPSULES = /* GraphQL */ `
  query ListInformativeCapsules($filter: ModelInformativeCapsuleFilterInput, $limit: Int, $nextToken: String) {
    listInformativeCapsules(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      }
      nextToken
    }
  }
`;

export const INFORMATIVE_CAPSULE_BY_SLUG = /* GraphQL */ `
  query InformativeCapsuleBySlug($slug: String!, $filter: ModelInformativeCapsuleFilterInput, $limit: Int) {
    informativeCapsuleBySlug(slug: $slug, filter: $filter, limit: $limit) {
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
        coverImageUrl
        attachmentUrls
        status
        highlight
        authorName
        publishedAt
        createdAt
      }
    }
  }
`;

export const GET_INFORMATIVE_CAPSULE = /* GraphQL */ `
  query GetInformativeCapsule($id: ID!) {
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
    }
  }
`;

export const CREATE_INFORMATIVE_CAPSULE = /* GraphQL */ `
  mutation CreateInformativeCapsule($input: CreateInformativeCapsuleInput!) {
    createInformativeCapsule(input: $input) {
      id
    }
  }
`;

export const UPDATE_INFORMATIVE_CAPSULE = /* GraphQL */ `
  mutation UpdateInformativeCapsule($input: UpdateInformativeCapsuleInput!) {
    updateInformativeCapsule(input: $input) {
      id
    }
  }
`;

export const DELETE_INFORMATIVE_CAPSULE = /* GraphQL */ `
  mutation DeleteInformativeCapsule($input: DeleteInformativeCapsuleInput!) {
    deleteInformativeCapsule(input: $input) {
      id
    }
  }
`;

export const LIST_EDUCATIONAL_VIDEOCLIPS = /* GraphQL */ `
  query ListEducationalVideoclips($filter: ModelEducationalVideoclipFilterInput, $limit: Int, $nextToken: String) {
    listEducationalVideoclips(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      }
      nextToken
    }
  }
`;

export const GET_EDUCATIONAL_VIDEOCLIP = /* GraphQL */ `
  query GetEducationalVideoclip($id: ID!) {
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
    }
  }
`;

export const EDUCATIONAL_VIDEOCLIP_BY_SLUG = /* GraphQL */ `
  query EducationalVideoclipBySlug($slug: String!, $filter: ModelEducationalVideoclipFilterInput, $limit: Int) {
    educationalVideoclipBySlug(slug: $slug, filter: $filter, limit: $limit) {
      items {
        id
        title
        slug
        description
        youtubeUrl
        topicCategory
        coverImageUrl
        relatedNewsIds
        relatedAnnouncementIds
        relatedResearchIds
        relatedCapsuleIds
        relatedPodcastIds
        status
        highlight
        publishedAt
        createdAt
      }
    }
  }
`;

export const CREATE_EDUCATIONAL_VIDEOCLIP = /* GraphQL */ `
  mutation CreateEducationalVideoclip($input: CreateEducationalVideoclipInput!) {
    createEducationalVideoclip(input: $input) {
      id
    }
  }
`;

export const UPDATE_EDUCATIONAL_VIDEOCLIP = /* GraphQL */ `
  mutation UpdateEducationalVideoclip($input: UpdateEducationalVideoclipInput!) {
    updateEducationalVideoclip(input: $input) {
      id
    }
  }
`;

export const DELETE_EDUCATIONAL_VIDEOCLIP = /* GraphQL */ `
  mutation DeleteEducationalVideoclip($input: DeleteEducationalVideoclipInput!) {
    deleteEducationalVideoclip(input: $input) {
      id
    }
  }
`;
