// Simple, reliable Apollo.js with perfect matching capabilities
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

// Simple, reliable GraphQL query
export const GET_ALL_JOBS = `
  query GetAllJobs($first: Int = 300) {
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

// Advanced custom fields parser with multiple parsing strategies
export const parseCustomFields = (customFieldsData) => {
  if (!customFieldsData) return {}
  
  try {
    // Strategy 1: If it's already an object, return it
    if (typeof customFieldsData === 'object' && customFieldsData !== null) {
      return customFieldsData
    }
    
    // Strategy 2: If it's a string, try multiple parsing methods
    if (typeof customFieldsData === 'string') {
      const text = customFieldsData.trim()
      if (!text) return {}
      
      // Try JSON parsing first
      try {
        const parsed = JSON.parse(text)
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed
        }
      } catch (jsonError) {
        // JSON parsing failed, try advanced pattern extraction
        const extracted = {}
        const lowerText = text.toLowerCase()
        
        // Enhanced field patterns with multiple variations
        const fieldPatterns = [
          // Location patterns
          [/(?:city|location)[:\s='"]*([^,;\n|"']+)/i, 'city'],
          [/(?:state|region)[:\s='"]*([^,;\n|"']+)/i, 'state'],
          
          // Salary patterns  
          [/(?:salary[_\s]*min|min[_\s]*salary|minimum[_\s]*salary)[:\s='"]*([0-9.]+)/i, 'salaryMin'],
          [/(?:salary[_\s]*max|max[_\s]*salary|maximum[_\s]*salary)[:\s='"]*([0-9.]+)/i, 'salaryMax'],
          [/(?:salary|package)[:\s='"]*([0-9.]+)[_\s]*[-to]*[_\s]*([0-9.]+)/i, 'salaryRange'],
          [/([0-9.]+)[_\s]*[-to]+[_\s]*([0-9.]+)[_\s]*(?:lpa|lakhs?|per\s*annum)/i, 'salaryRange'],
          
          // Work mode patterns
          [/(?:work[_\s]*mode|employment[_\s]*type|job[_\s]*type)[:\s='"]*([^,;\n|"']+)/i, 'workMode'],
          
          // Experience patterns
          [/(?:experience|exp)[:\s='"]*([^,;\n|"']+)/i, 'experienceLevel'],
          [/(?:fresher|entry[_\s]*level|graduate)/i, 'fresherJob'],
          
          // Skills patterns
          [/(?:skills?|technologies?|tech[_\s]*stack|required[_\s]*skills?)[:\s='"]*([^,;\n|"']+)/i, 'requiredSkills'],
          
          // Company patterns
          [/(?:company[_\s]*size|organization[_\s]*size)[:\s='"]*([^,;\n|"']+)/i, 'companySize'],
          
          // Urgency patterns
          [/(?:urgent|immediate|asap)/i, 'isUrgent'],
          
          // Deadline patterns
          [/(?:deadline|last[_\s]*date|apply[_\s]*by)[:\s='"]*([^,;\n|"']+)/i, 'applicationDeadline'],
          
          // Education patterns
          [/(?:education|qualification|degree)[:\s='"]*([^,;\n|"']+)/i, 'educationRequired']
        ]
        
        fieldPatterns.forEach(([pattern, fieldName]) => {
          const match = text.match(pattern)
          if (match) {
            if (fieldName === 'salaryRange' && match[1] && match[2]) {
              // Handle salary range extraction
              extracted.salaryMin = match[1].trim()
              extracted.salaryMax = match[2].trim()
            } else if (fieldName === 'fresherJob') {
              extracted.experienceLevel = 'Fresher'
            } else if (fieldName === 'isUrgent') {
              extracted.isUrgent = true
            } else if (match[1]) {
              extracted[fieldName] = match[1].trim().replace(/['"]/g, '')
            }
          }
        })
        
        // Special keyword detection
        if (lowerText.includes('remote') || lowerText.includes('work from home') || lowerText.includes('wfh')) {
          extracted.workMode = extracted.workMode || 'Remote'
        }
        
        if (lowerText.includes('hybrid')) {
          extracted.workMode = extracted.workMode || 'Hybrid'
        }
        
        if (lowerText.includes('onsite') || lowerText.includes('office')) {
          extracted.workMode = extracted.workMode || 'Onsite'
        }
        
        return extracted
      }
    }
    
    return {}
  } catch (error) {
    console.warn('Failed to parse custom fields:', error)
    return {}
  }
}

// Advanced city filtering with multiple matching strategies
export const filterJobsByCity = (jobs, cityInfo) => {
  if (!jobs || !cityInfo) return []
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      
      // Strategy 1: Exact custom field matches
      const jobCity = (customFields.city || '').toLowerCase().trim()
      const jobState = (customFields.state || '').toLowerCase().trim()
      
      const exactMatch = cityInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase().trim()
        return jobCity === searchTerm || jobState === searchTerm
      })
      
      if (exactMatch) return true
      
      // Strategy 2: Partial custom field matches
      const partialFieldMatch = cityInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return jobCity.includes(searchTerm) || jobState.includes(searchTerm)
      })
      
      if (partialFieldMatch) return true
      
      // Strategy 3: Content-based matches (title and excerpt)
      const contentMatch = cityInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return title.includes(searchTerm) || excerpt.includes(searchTerm)
      })
      
      return contentMatch
      
    } catch (error) {
      console.warn('Error filtering job by city:', error)
      return false
    }
  })
}

// Advanced skill filtering with comprehensive matching
export const filterJobsBySkill = (jobs, skillInfo) => {
  if (!jobs || !skillInfo) return []
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      
      // Strategy 1: Skills field matches
      const jobSkills = (customFields.requiredSkills || customFields.skills || '').toLowerCase()
      
      const skillFieldMatch = skillInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return jobSkills.includes(searchTerm)
      })
      
      if (skillFieldMatch) return true
      
      // Strategy 2: Title and content matches
      const contentMatch = skillInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return title.includes(searchTerm) || excerpt.includes(searchTerm)
      })
      
      return contentMatch
      
    } catch (error) {
      console.warn('Error filtering job by skill:', error)
      return false
    }
  })
}

// Advanced salary range filtering
export const filterJobsBySalaryRange = (jobs, minSalary, maxSalary, searchTerms = []) => {
  if (!jobs) return []
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      
      // Strategy 1: Explicit salary field matches
      const jobMinSalary = parseFloat(customFields.salaryMin || 0)
      const jobMaxSalary = parseFloat(customFields.salaryMax || 999)
      
      const salaryMatch = (jobMinSalary >= minSalary && jobMinSalary <= maxSalary) ||
                         (jobMaxSalary >= minSalary && jobMaxSalary <= maxSalary) ||
                         (jobMinSalary <= minSalary && jobMaxSalary >= maxSalary)
      
      if (salaryMatch && (jobMinSalary > 0 || jobMaxSalary < 999)) {
        return true
      }
      
      // Strategy 2: Content-based salary detection
      const content = [title, excerpt].join(' ')
      
      // Look for salary mentions in content
      const salaryPatterns = [
        /([0-9.]+)[_\s]*[-to]*[_\s]*([0-9.]+)[_\s]*(?:lpa|lakhs?|per\s*annum)/i,
        /₹[_\s]*([0-9.]+)[_\s]*[-to]*[_\s]*([0-9.]+)/i
      ]
      
      for (const pattern of salaryPatterns) {
        const match = content.match(pattern)
        if (match) {
          const contentMinSal = parseFloat(match[1] || 0)
          const contentMaxSal = parseFloat(match[2] || match[1] || 999)
          
          const contentSalaryMatch = (contentMinSal >= minSalary && contentMinSal <= maxSalary) ||
                                    (contentMaxSal >= minSalary && contentMaxSal <= maxSalary)
          
          if (contentSalaryMatch) return true
        }
      }
      
      // Strategy 3: Keyword-based matching
      return searchTerms.some(term => 
        content.includes(term.toLowerCase())
      )
      
    } catch (error) {
      console.warn('Error filtering job by salary range:', error)
      return false
    }
  })
}

// Calculate comprehensive job statistics
export const calculateJobStats = (jobs, filterInfo = null) => {
  if (!jobs || !Array.isArray(jobs)) return {
    total: 0,
    remote: 0,
    urgent: 0,
    fresher: 0,
    withSalary: 0,
    highSalary: 0
  }
  
  try {
    let jobsToAnalyze = jobs
    
    // Apply filter if provided
    if (filterInfo) {
      if (filterInfo.type === 'city') {
        jobsToAnalyze = filterJobsByCity(jobs, filterInfo)
      } else if (filterInfo.type === 'skill') {
        jobsToAnalyze = filterJobsBySkill(jobs, filterInfo)
      } else if (filterInfo.type === 'salary') {
        jobsToAnalyze = filterJobsBySalaryRange(jobs, filterInfo.min, filterInfo.max, filterInfo.searchTerms)
      }
    }
    
    const stats = {
      total: jobsToAnalyze.length,
      remote: 0,
      urgent: 0,
      fresher: 0,
      withSalary: 0,
      highSalary: 0
    }
    
    jobsToAnalyze.forEach(job => {
      try {
        const customFields = parseCustomFields(job.customFields)
        const title = (job.title || '').toLowerCase()
        const excerpt = (job.excerpt || '').toLowerCase()
        const content = [title, excerpt].join(' ')
        
        // Count remote jobs
        if (customFields.workMode?.toLowerCase().includes('remote') ||
            content.includes('remote') || content.includes('wfh') || content.includes('work from home')) {
          stats.remote++
        }
        
        // Count urgent jobs
        if (customFields.isUrgent || content.includes('urgent') || content.includes('immediate')) {
          stats.urgent++
        }
        
        // Count fresher jobs
        if (customFields.experienceLevel?.toLowerCase().includes('fresher') ||
            content.includes('fresher') || content.includes('trainee') || content.includes('entry level')) {
          stats.fresher++
        }
        
        // Count jobs with salary data
        const hasExplicitSalary = customFields.salaryMin || customFields.salaryMax
        const hasContentSalary = content.includes('lpa') || content.includes('salary') || content.includes('₹')
        
        if (hasExplicitSalary || hasContentSalary) {
          stats.withSalary++
          
          // Count high salary jobs (8+ LPA)
          const minSal = parseFloat(customFields.salaryMin || 0)
          const maxSal = parseFloat(customFields.salaryMax || 0)
          
          if (minSal >= 8 || maxSal >= 8) {
            stats.highSalary++
          } else if (content.includes('8') && (content.includes('lpa') || content.includes('lakhs'))) {
            stats.highSalary++
          }
        }
      } catch (error) {
        // Skip if processing fails
      }
    })
    
    return stats
  } catch (error) {
    console.warn('Error calculating job stats:', error)
    return { total: 0, remote: 0, urgent: 0, fresher: 0, withSalary: 0, highSalary: 0 }
  }
}

// Get unique values for filter dropdowns
export const getUniqueValues = (jobs, fieldName) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  try {
    const values = new Set()
    
    jobs.forEach(job => {
      try {
        const customFields = parseCustomFields(job.customFields)
        const value = customFields[fieldName]
        
        if (value && typeof value === 'string' && value.trim() !== '') {
          // Handle comma-separated values
          const splitValues = value.split(/[,;|]/).map(v => v.trim()).filter(v => v !== '')
          splitValues.forEach(v => {
            if (v.length > 1 && v.length < 50) { // Reasonable length filter
              values.add(v)
            }
          })
        }
      } catch (error) {
        // Skip if processing fails
      }
    })
    
    return Array.from(values).sort().slice(0, 20) // Limit to 20 for UI performance
  } catch (error) {
    console.warn('Error getting unique values:', error)
    return []
  }
}

// Enhanced filtering with multiple criteria
export const applyMultipleFilters = (jobs, filters) => {
  if (!jobs || !filters) return jobs
  
  let filteredJobs = [...jobs]
  
  try {
    // Apply city filter
    if (filters.cityInfo) {
      filteredJobs = filterJobsByCity(filteredJobs, filters.cityInfo)
    }
    
    // Apply skill filter
    if (filters.skillInfo) {
      filteredJobs = filterJobsBySkill(filteredJobs, filters.skillInfo)
    }
    
    // Apply salary filter
    if (filters.salaryRange) {
      filteredJobs = filterJobsBySalaryRange(
        filteredJobs, 
        filters.salaryRange.min, 
        filters.salaryRange.max, 
        filters.salaryRange.searchTerms
      )
    }
    
    // Apply experience filter
    if (filters.experience && filters.experience !== 'all') {
      filteredJobs = filteredJobs.filter(job => {
        try {
          const customFields = parseCustomFields(job.customFields)
          const content = [job.title || '', job.excerpt || ''].join(' ').toLowerCase()
          
          return customFields.experienceLevel?.toLowerCase().includes(filters.experience.toLowerCase()) ||
                 content.includes(filters.experience.toLowerCase())
        } catch {
          return false
        }
      })
    }
    
    // Apply work mode filter
    if (filters.workMode && filters.workMode !== 'all') {
      filteredJobs = filteredJobs.filter(job => {
        try {
          const customFields = parseCustomFields(job.customFields)
          const content = [job.title || '', job.excerpt || ''].join(' ').toLowerCase()
          
          return customFields.workMode?.toLowerCase().includes(filters.workMode.toLowerCase()) ||
                 content.includes(filters.workMode.toLowerCase())
        } catch {
          return false
        }
      })
    }
    
    // Apply urgent filter
    if (filters.urgentOnly) {
      filteredJobs = filteredJobs.filter(job => {
        try {
          const customFields = parseCustomFields(job.customFields)
          const content = [job.title || '', job.excerpt || ''].join(' ').toLowerCase()
          
          return customFields.isUrgent || content.includes('urgent') || content.includes('immediate')
        } catch {
          return false
        }
      })
    }
    
    return filteredJobs
  } catch (error) {
    console.warn('Error applying multiple filters:', error)
    return jobs
  }
}

// Export legacy function names for compatibility
export const extractACFFields = parseCustomFields
export const GET_ALL_JOBS_WITH_ACF = GET_ALL_JOBS
export const GET_JOBS_BY_LOCATION = GET_ALL_JOBS
export const GET_JOBS_BY_SKILLS = GET_ALL_JOBS
export const GET_JOBS_BY_SALARY = GET_ALL_JOBS