// Enhanced GraphQL client with custom fields support
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await fetch('https://classicjobs.in/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })

    const result = await response.json()
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      throw new Error(result.errors[0].message)
    }
    
    return result.data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// Enhanced queries with custom fields
export const GET_POSTS_WITH_CUSTOM_FIELDS = `
  query GetPostsWithCustomFields($first: Int = 10) {
    posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        title
        excerpt
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          educationRequired
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
          companySize
        }
      }
    }
  }
`

export const GET_JOBS_BY_LOCATION = `
  query GetJobsByLocation($city: String!, $first: Int = 20) {
    posts(
      first: $first, 
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          metaArray: [
            {
              key: "city",
              value: $city,
              compare: EQUAL_TO
            }
          ]
        }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
        }
      }
    }
  }
`

export const GET_JOBS_BY_SKILLS = `
  query GetJobsBySkills($skill: String!, $first: Int = 20) {
    posts(
      first: $first,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          metaArray: [
            {
              key: "required_skills",
              value: $skill,
              compare: LIKE
            }
          ]
        }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          salaryMin
          salaryMax
          isUrgent
        }
      }
    }
  }
`

export const GET_URGENT_JOBS = `
  query GetUrgentJobs($first: Int = 10) {
    posts(
      first: $first,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          metaArray: [
            {
              key: "is_urgent",
              value: "1",
              compare: EQUAL_TO
            }
          ]
        }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          salaryMin
          salaryMax
          applicationDeadline
        }
      }
    }
  }
`

export const GET_JOBS_BY_SALARY_RANGE = `
  query GetJobsBySalaryRange($minSalary: Int!, $maxSalary: Int!, $first: Int = 20) {
    posts(
      first: $first,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          relation: AND,
          metaArray: [
            {
              key: "salary_min",
              value: $minSalary,
              type: NUMERIC,
              compare: GREATER_THAN_OR_EQUAL_TO
            },
            {
              key: "salary_max",
              value: $maxSalary,
              type: NUMERIC,
              compare: LESS_THAN_OR_EQUAL_TO
            }
          ]
        }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          salaryMin
          salaryMax
        }
      }
    }
  }
`

// Get all unique locations for filter options
export const GET_ALL_LOCATIONS = `
  query GetAllLocations {
    posts(first: 1000) {
      nodes {
        customFields {
          city
          state
        }
      }
    }
  }
`

// Get all unique skills for filter options
export const GET_ALL_SKILLS = `
  query GetAllSkills {
    posts(first: 1000) {
      nodes {
        customFields {
          requiredSkills
        }
      }
    }
  }
`