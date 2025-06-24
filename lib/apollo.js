// Enhanced GraphQL client with comprehensive ACF custom fields support
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

// Enhanced helper function to parse custom fields with multiple format support
export const parseCustomFields = (customFieldsData) => {
  // Return empty object if no data
  if (!customFieldsData) return {}
  
  try {
    // If it's already an object, return it
    if (typeof customFieldsData === 'object' && customFieldsData !== null) {
      return customFieldsData
    }
    
    // If it's a string, try multiple parsing methods
    if (typeof customFieldsData === 'string') {
      // Handle empty string
      if (customFieldsData.trim() === '') return {}
      
      // Try JSON parsing first
      try {
        const parsed = JSON.parse(customFieldsData)
        return typeof parsed === 'object' && parsed !== null ? parsed : {}
      } catch (jsonError) {
        // If JSON parsing fails, try to extract ACF field patterns
        
        // Pattern 1: WordPress serialized data (PHP serialize format)
        if (customFieldsData.includes('a:') && customFieldsData.includes(':{')) {
          try {
            // Try to extract key-value pairs from serialized data
            const matches = customFieldsData.match(/"([^"]+)";[^"]*"([^"]+)"/g)
            if (matches) {
              const obj = {}
              matches.forEach(match => {
                const keyValue = match.match(/"([^"]+)";[^"]*"([^"]+)"/)
                if (keyValue && keyValue[1] && keyValue[2]) {
                  obj[keyValue[1]] = keyValue[2]
                }
              })
              return obj
            }
          } catch (e) {
            console.warn('Failed to parse serialized data:', e)
          }
        }
        
        // Pattern 2: Key-value pairs separated by delimiters
        if (customFieldsData.includes(':') || customFieldsData.includes('=')) {
          try {
            const obj = {}
            const delimiter = customFieldsData.includes('|') ? '|' : (customFieldsData.includes(';') ? ';' : ',')
            const pairs = customFieldsData.split(delimiter)
            
            pairs.forEach(pair => {
              const separator = pair.includes('=') ? '=' : ':'
              const [key, value] = pair.split(separator).map(s => s.trim())
              if (key && value) {
                obj[key.replace(/['"]/g, '')] = value.replace(/['"]/g, '')
              }
            })
            
            if (Object.keys(obj).length > 0) {
              return obj
            }
          } catch (e) {
            console.warn('Failed to parse key-value pairs:', e)
          }
        }
        
        // Pattern 3: Try to find field names and values
        const fieldPatterns = [
          /city[:\s=]+([^,;|\n]+)/i,
          /state[:\s=]+([^,;|\n]+)/i,
          /salary[_\s]*min[:\s=]+([^,;|\n]+)/i,
          /salary[_\s]*max[:\s=]+([^,;|\n]+)/i,
          /work[_\s]*mode[:\s=]+([^,;|\n]+)/i,
          /required[_\s]*skills[:\s=]+([^,;|\n]+)/i,
          /experience[_\s]*level[:\s=]+([^,;|\n]+)/i,
          /company[_\s]*size[:\s=]+([^,;|\n]+)/i,
          /is[_\s]*urgent[:\s=]+([^,;|\n]+)/i,
          /application[_\s]*deadline[:\s=]+([^,;|\n]+)/i
        ]
        
        const extractedFields = {}
        fieldPatterns.forEach((pattern, index) => {
          const match = customFieldsData.match(pattern)
          if (match && match[1]) {
            const fieldNames = [
              'city', 'state', 'salaryMin', 'salaryMax', 'workMode', 
              'requiredSkills', 'experienceLevel', 'companySize', 
              'isUrgent', 'applicationDeadline'
            ]
            extractedFields[fieldNames[index]] = match[1].trim().replace(/['"]/g, '')
          }
        })
        
        if (Object.keys(extractedFields).length > 0) {
          return extractedFields
        }
      }
    }
    
    return {}
  } catch (error) {
    console.warn('Failed to parse custom fields:', {
      input: customFieldsData,
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

// Enhanced function to get unique values with proper type handling
export const getUniqueValues = (jobs, field) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  try {
    const values = jobs
      .map(job => {
        const customFields = parseCustomFields(job.customFields)
        return customFields[field]
      })
      .filter(value => value !== null && value !== undefined && value !== '')
      .map(value => {
        // Ensure value is a string before calling trim
        if (typeof value === 'string') {
          return value.trim()
        } else if (typeof value === 'number') {
          return String(value)
        } else if (typeof value === 'boolean') {
          return String(value)
        } else {
          try {
            return String(value).trim()
          } catch (e) {
            return String(value)
          }
        }
      })
      .filter(value => value !== '' && value !== 'undefined' && value !== 'null')
      .filter((value, index, self) => self.indexOf(value) === index)
    
    return values.sort()
  } catch (error) {
    console.warn('Error getting unique values:', error)
    return []
  }
}

// Enhanced GraphQL queries with multiple ACF field access patterns
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

// Enhanced client-side filtering functions with comprehensive parsing
export const filterJobsByLocation = (jobs, city) => {
  if (!jobs || !city) return jobs
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const jobCity = safeToLowerCase(customFields.city)
      const searchCity = safeToLowerCase(city)
      
      // Check exact match and partial match
      return jobCity === searchCity || 
             jobCity.includes(searchCity) || 
             searchCity.includes(jobCity) ||
             // Also check in title and excerpt for location mentions
             safeToLowerCase(job.title).includes(searchCity) ||
             safeToLowerCase(job.excerpt || '').includes(searchCity)
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
      const jobSkills = safeToLowerCase(customFields.requiredSkills || customFields.skills || '')
      const searchSkill = safeToLowerCase(skill)
      
      // Check in custom fields, title, and excerpt
      return jobSkills.includes(searchSkill) ||
             safeToLowerCase(job.title).includes(searchSkill) ||
             safeToLowerCase(job.excerpt || '').includes(searchSkill)
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
      const jobMinSalary = safeToNumber(customFields.salaryMin || customFields.salary_min, 0)
      const jobMaxSalary = safeToNumber(customFields.salaryMax || customFields.salary_max, 999)
      
      // Check if job salary range overlaps with search range
      const salaryMatch = (jobMinSalary >= minSalary && jobMinSalary <= maxSalary) ||
                         (jobMaxSalary >= minSalary && jobMaxSalary <= maxSalary) ||
                         (jobMinSalary <= minSalary && jobMaxSalary >= maxSalary)
      
      // Also check for salary keywords in title/content if no explicit salary data
      if (!salaryMatch && (!customFields.salaryMin && !customFields.salaryMax)) {
        const salaryKeywords = {
          'fresher': { min: 0, max: 3 },
          'entry': { min: 0, max: 3 },
          'junior': { min: 3, max: 5 },
          'senior': { min: 5, max: 12 },
          'lead': { min: 8, max: 15 },
          'manager': { min: 12, max: 25 }
        }
        
        const titleLower = safeToLowerCase(job.title)
        const excerptLower = safeToLowerCase(job.excerpt || '')
        
        for (const [keyword, range] of Object.entries(salaryKeywords)) {
          if (titleLower.includes(keyword) || excerptLower.includes(keyword)) {
            return (range.min >= minSalary && range.min <= maxSalary) ||
                   (range.max >= minSalary && range.max <= maxSalary)
          }
        }
      }
      
      return salaryMatch
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
      const isUrgent = customFields.isUrgent || customFields.is_urgent || customFields.urgent
      
      return isUrgent === '1' || 
             isUrgent === 1 || 
             isUrgent === true || 
             isUrgent === 'true' || 
             isUrgent === 'yes' ||
             safeToLowerCase(isUrgent) === 'yes' ||
             // Check for urgent keywords in title
             safeToLowerCase(job.title).includes('urgent') ||
             safeToLowerCase(job.title).includes('immediate') ||
             safeToLowerCase(job.excerpt || '').includes('urgent')
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
      const jobExperience = safeToLowerCase(customFields.experienceLevel || customFields.experience_level || customFields.experience || '')
      const searchExperience = safeToLowerCase(experienceLevel)
      
      return jobExperience === searchExperience || 
             jobExperience.includes(searchExperience) ||
             safeToLowerCase(job.title).includes(searchExperience) ||
             safeToLowerCase(job.excerpt || '').includes(searchExperience)
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
      const jobWorkMode = safeToLowerCase(customFields.workMode || customFields.work_mode || '')
      const searchWorkMode = safeToLowerCase(workMode)
      
      return jobWorkMode === searchWorkMode || 
             jobWorkMode.includes(searchWorkMode) ||
             safeToLowerCase(job.title).includes(searchWorkMode) ||
             safeToLowerCase(job.excerpt || '').includes(searchWorkMode)
    } catch (error) {
      console.warn('Error filtering job by work mode:', error)
      return false
    }
  })
}

// Combined filtering function with fallback search
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
      const parsedCustomFields = parseCustomFields(job.customFields)
      return {
        ...job,
        parsedCustomFields,
        // Add convenience properties
        hasLocation: !!(parsedCustomFields.city),
        hasSkills: !!(parsedCustomFields.requiredSkills || parsedCustomFields.skills),
        hasSalary: !!(parsedCustomFields.salaryMin || parsedCustomFields.salaryMax),
        isUrgent: !!(parsedCustomFields.isUrgent === '1' || parsedCustomFields.isUrgent === true)
      }
    } catch (error) {
      console.warn('Error processing job data:', error)
      return job
    }
  })
}

// Get job statistics with enhanced parsing
export const getJobStats = (jobs) => {
  if (!jobs || !Array.isArray(jobs)) return {
    total: 0,
    remote: 0,
    urgent: 0,
    fresher: 0,
    withLocation: 0,
    withSkills: 0,
    withSalary: 0
  }
  
  try {
    const stats = {
      total: jobs.length,
      remote: 0,
      urgent: 0,
      fresher: 0,
      withLocation: 0,
      withSkills: 0,
      withSalary: 0
    }
    
    jobs.forEach(job => {
      const customFields = parseCustomFields(job.customFields)
      
      if (safeToLowerCase(customFields.workMode || '').includes('remote')) {
        stats.remote++
      }
      
      if (customFields.isUrgent === '1' || customFields.isUrgent === true || 
          safeToLowerCase(job.title).includes('urgent')) {
        stats.urgent++
      }
      
      if (safeToLowerCase(customFields.experienceLevel || '').includes('fresher') ||
          safeToLowerCase(job.title).includes('fresher')) {
        stats.fresher++
      }
      
      if (customFields.city) {
        stats.withLocation++
      }
      
      if (customFields.requiredSkills || customFields.skills) {
        stats.withSkills++
      }
      
      if (customFields.salaryMin || customFields.salaryMax) {
        stats.withSalary++
      }
    })
    
    return stats
  } catch (error) {
    console.warn('Error calculating job stats:', error)
    return { 
      total: jobs.length, 
      remote: 0, 
      urgent: 0, 
      fresher: 0,
      withLocation: 0,
      withSkills: 0,
      withSalary: 0
    }
  }
}

// Debug function to analyze job data structure
export const debugJobData = (jobs, limit = 3) => {
  if (!jobs || !Array.isArray(jobs)) {
    console.log('No jobs data to debug')
    return
  }
  
  console.log('=== JOB DATA DEBUG ANALYSIS ===')
  console.log(`Total jobs: ${jobs.length}`)
  
  jobs.slice(0, limit).forEach((job, index) => {
    console.log(`\n--- JOB ${index + 1}: ${job.title} ---`)
    console.log('ID:', job.id)
    console.log('CustomFields type:', typeof job.customFields)
    console.log('CustomFields raw:', job.customFields)
    
    const parsed = parseCustomFields(job.customFields)
    console.log('Parsed fields:', parsed)
    console.log('Available field keys:', Object.keys(parsed))
    
    // Check for common field variations
    const commonFields = ['city', 'state', 'salaryMin', 'salaryMax', 'workMode', 'requiredSkills', 'experienceLevel']
    const foundFields = commonFields.filter(field => parsed[field])
    const missingFields = commonFields.filter(field => !parsed[field])
    
    console.log('Found fields:', foundFields)
    console.log('Missing fields:', missingFields)
  })
  
  // Overall statistics
  const stats = getJobStats(jobs)
  console.log('\n=== OVERALL STATISTICS ===')
  console.log('Jobs with location data:', stats.withLocation)
  console.log('Jobs with skills data:', stats.withSkills)
  console.log('Jobs with salary data:', stats.withSalary)  
  console.log('Remote jobs:', stats.remote)
  console.log('Urgent jobs:', stats.urgent)
  console.log('Fresher jobs:', stats.fresher)
  console.log('===============================')
}