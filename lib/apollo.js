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

// Enhanced helper function to parse custom fields JSON string with better error handling
export const parseCustomFields = (customFieldsString) => {
  // Return empty object if no data
  if (!customFieldsString) return {}
  
  try {
    // If it's already an object, return it
    if (typeof customFieldsString === 'object' && customFieldsString !== null) {
      return customFieldsString
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof customFieldsString === 'string') {
      // Handle empty string
      if (customFieldsString.trim() === '') return {}
      
      // Try to parse JSON
      const parsed = JSON.parse(customFieldsString)
      
      // Ensure we return an object
      return typeof parsed === 'object' && parsed !== null ? parsed : {}
    }
    
    return {}
  } catch (error) {
    console.warn('Failed to parse custom fields:', {
      input: customFieldsString,
      error: error.message
    })
    return {}
  }
}

// Helper function to safely convert to string and lowercase
const safeToLowerCase = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).toLowerCase()
}

// Helper function to safely convert to number
const safeToNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

// Debug helper to understand your custom fields structure
export const debugCustomFields = (jobs) => {
  console.log('=== DEBUGGING CUSTOM FIELDS ===')
  
  if (!jobs || jobs.length === 0) {
    console.log('No jobs provided for debugging')
    return
  }

  // Check first 3 jobs
  jobs.slice(0, 3).forEach((job, index) => {
    console.log(`\n--- Job ${index + 1}: ${job.title} ---`)
    console.log('Raw customFields:', job.customFields)
    console.log('Type of customFields:', typeof job.customFields)
    
    try {
      let parsed
      if (typeof job.customFields === 'string') {
        parsed = JSON.parse(job.customFields)
        console.log('Parsed customFields:', parsed)
        console.log('Parsed type:', typeof parsed)
        console.log('City value:', parsed.city, 'Type:', typeof parsed.city)
      } else {
        parsed = job.customFields
        console.log('Already an object:', parsed)
        console.log('City value:', parsed?.city, 'Type:', typeof parsed?.city)
      }
      
      // Test each field type
      Object.keys(parsed || {}).forEach(key => {
        console.log(`  ${key}:`, parsed[key], `(${typeof parsed[key]})`)
      })
      
    } catch (error) {
      console.error('Parse error:', error.message)
    }
  })
  
  console.log('=== END DEBUG ===')
}

// Basic query structure - customFields as String
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
        customFields
      }
    }
  }
`

// Using search parameter for location filtering
export const GET_JOBS_BY_LOCATION = `
  query GetJobsByLocation($search: String!, $first: Int = 50) {
    posts(
      first: $first, 
      where: {
        search: $search,
        orderby: {field: DATE, order: DESC}
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
        customFields
      }
    }
  }
`

// Get all posts for client-side filtering
export const GET_ALL_JOBS = `
  query GetAllJobs($first: Int = 200) {
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
        customFields
      }
    }
  }
`

// Using search for skills
export const GET_JOBS_BY_SKILLS = `
  query GetJobsBySkills($search: String!, $first: Int = 50) {
    posts(
      first: $first,
      where: {
        search: $search,
        orderby: {field: DATE, order: DESC}
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
        customFields
      }
    }
  }
`

// Get recent posts (fallback query)
export const GET_RECENT_POSTS = `
  query GetRecentPosts($first: Int = 20) {
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
        customFields
      }
    }
  }
`

// Search posts query
export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int = 50) {
    posts(first: $first, where: {search: $search, orderby: {field: DATE, order: DESC}}) {
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
        customFields
      }
    }
  }
`

// Test Mumbai jobs using search
export const TEST_MUMBAI_JOBS = `
  query TestMumbaiJobs {
    posts(
      first: 10,
      where: {
        search: "Mumbai",
        orderby: {field: DATE, order: DESC}
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        customFields
      }
    }
  }
`

// Get single post query
export const GET_POST = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
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
        }
      }
      customFields
    }
  }
`

// Get category posts query
export const GET_CATEGORY_POSTS = `
  query GetCategoryPosts($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      description
      posts(first: 20) {
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
            }
          }
          customFields
        }
      }
    }
  }
`

// Get batch posts query
export const GET_BATCH_POSTS = `
  query GetBatchPosts($search: String!) {
    posts(first: 50, where: {search: $search, orderby: {field: DATE, order: DESC}}) {
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
          }
        }
        customFields
      }
    }
  }
`

// Get education posts query
export const GET_EDUCATION_POSTS = `
  query GetEducationPosts($search: String!) {
    posts(first: 50, where: {search: $search, orderby: {field: DATE, order: DESC}}) {
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
          }
        }
        customFields
      }
    }
  }
`

// Client-side filtering helper functions with JSON parsing and type safety
export const filterJobsByLocation = (jobs, city) => {
  if (!jobs || !city) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobCity = safeToLowerCase(customFields.city)
      const searchCity = safeToLowerCase(city)
      
      return jobCity === searchCity || jobCity.includes(searchCity)
    } catch (error) {
      console.warn('Error filtering job by location:', error)
      return false
    }
  })
}

export const filterJobsBySkills = (jobs, skill) => {
  if (!jobs || !skill) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobSkills = safeToLowerCase(customFields.requiredSkills)
      const searchSkill = safeToLowerCase(skill)
      
      return jobSkills.includes(searchSkill)
    } catch (error) {
      console.warn('Error filtering job by skills:', error)
      return false
    }
  })
}

export const filterJobsBySalaryRange = (jobs, minSalary, maxSalary) => {
  if (!jobs) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobMinSalary = safeToNumber(customFields.salaryMin, 0)
      const jobMaxSalary = safeToNumber(customFields.salaryMax, 999)
      
      return jobMinSalary >= minSalary && jobMaxSalary <= maxSalary
    } catch (error) {
      console.warn('Error filtering job by salary:', error)
      return false
    }
  })
}

export const filterUrgentJobs = (jobs) => {
  if (!jobs) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const isUrgent = customFields.isUrgent
      
      return isUrgent === '1' || 
             isUrgent === 1 || 
             isUrgent === true || 
             isUrgent === 'true' || 
             safeToLowerCase(isUrgent) === 'yes'
    } catch (error) {
      console.warn('Error filtering urgent jobs:', error)
      return false
    }
  })
}

export const filterJobsByExperience = (jobs, experienceLevel) => {
  if (!jobs || !experienceLevel) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobExperience = safeToLowerCase(customFields.experienceLevel)
      const searchExperience = safeToLowerCase(experienceLevel)
      
      return jobExperience === searchExperience || jobExperience.includes(searchExperience)
    } catch (error) {
      console.warn('Error filtering job by experience:', error)
      return false
    }
  })
}

export const filterJobsByWorkMode = (jobs, workMode) => {
  if (!jobs || !workMode) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobWorkMode = safeToLowerCase(customFields.workMode)
      const searchWorkMode = safeToLowerCase(workMode)
      
      return jobWorkMode === searchWorkMode || jobWorkMode.includes(searchWorkMode)
    } catch (error) {
      console.warn('Error filtering job by work mode:', error)
      return false
    }
  })
}

// Combined filtering function
export const applyFilters = (jobs, filters = {}) => {
  if (!jobs) return []
  
  let filteredJobs = [...jobs]
  
  try {
    if (filters.city) {
      filteredJobs = filterJobsByLocation(filteredJobs, filters.city)
    }
    
    if (filters.skill) {
      filteredJobs = filterJobsBySkills(filteredJobs, filters.skill)
    }
    
    if (filters.minSalary !== undefined && filters.maxSalary !== undefined) {
      filteredJobs = filterJobsBySalaryRange(filteredJobs, filters.minSalary, filters.maxSalary)
    }
    
    if (filters.experienceLevel) {
      filteredJobs = filterJobsByExperience(filteredJobs, filters.experienceLevel)
    }
    
    if (filters.workMode) {
      filteredJobs = filterJobsByWorkMode(filteredJobs, filters.workMode)
    }
    
    if (filters.urgentOnly) {
      filteredJobs = filterUrgentJobs(filteredJobs)
    }
  } catch (error) {
    console.error('Error applying filters:', error)
    return jobs // Return original jobs if filtering fails
  }
  
  return filteredJobs
}

// Enhanced job data processor
export const processJobData = (jobs) => {
  if (!jobs) return []
  
  return jobs.map(job => {
    try {
      return {
        ...job,
        parsedCustomFields: parseCustomFields(job.customFields)
      }
    } catch (error) {
      console.warn('Error processing job data:', error)
      return job
    }
  })
}

// Get unique values from jobs for filter options
export const getUniqueValues = (jobs, field) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  try {
    const values = jobs
      .map(job => {
        const customFields = parseCustomFields(job.customFields)
        return customFields[field]
      })
      .filter(value => value !== null && value !== undefined && value !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
    
    return values.sort()
  } catch (error) {
    console.warn('Error getting unique values:', error)
    return []
  }
}

// Helper to get job statistics
export const getJobStats = (jobs) => {
  if (!jobs || !Array.isArray(jobs)) return {
    total: 0,
    remote: 0,
    urgent: 0,
    fresher: 0
  }
  
  try {
    const stats = {
      total: jobs.length,
      remote: 0,
      urgent: 0,
      fresher: 0
    }
    
    jobs.forEach(job => {
      const customFields = parseCustomFields(job.customFields)
      
      if (safeToLowerCase(customFields.workMode) === 'remote') {
        stats.remote++
      }
      
      if (customFields.isUrgent === '1' || customFields.isUrgent === true || customFields.isUrgent === 'true') {
        stats.urgent++
      }
      
      if (safeToLowerCase(customFields.experienceLevel) === 'fresher') {
        stats.fresher++
      }
    })
    
    return stats
  } catch (error) {
    console.warn('Error calculating job stats:', error)
    return { total: jobs.length, remote: 0, urgent: 0, fresher: 0 }
  }
}