'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest, parseCustomFields, getUniqueValues, filterJobsBySalaryRange, getJobStats } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// Salary range mapping for SEO-friendly URLs
const salaryRangeMap = {
  '0-3-lpa': { 
    min: 0, 
    max: 3, 
    name: '0-3 LPA', 
    description: 'Entry-level positions perfect for freshers and new graduates',
    icon: '🌱',
    searchTerms: ['fresher', '0-3', 'entry level', 'graduate', 'trainee']
  },
  '3-5-lpa': { 
    min: 3, 
    max: 5, 
    name: '3-5 LPA', 
    description: 'Mid-level opportunities for professionals with 1-2 years experience',
    icon: '📈',
    searchTerms: ['3-5', 'junior', '1-2 years', 'associate', 'mid-level']
  },
  '5-8-lpa': { 
    min: 5, 
    max: 8, 
    name: '5-8 LPA', 
    description: 'Senior positions for experienced professionals',
    icon: '💼',
    searchTerms: ['5-8', 'senior', 'experienced', '3+ years', 'specialist']
  },
  '8-12-lpa': { 
    min: 8, 
    max: 12, 
    name: '8-12 LPA', 
    description: 'High-paying roles for senior developers and specialists',
    icon: '🚀',
    searchTerms: ['8-12', 'lead', 'specialist', '5+ years', 'architect']
  },
  '12-plus-lpa': { 
    min: 12, 
    max: 100, 
    name: '12+ LPA', 
    description: 'Premium positions for team leads and architects',
    icon: '💎',
    searchTerms: ['12+', 'architect', 'manager', 'principal', 'director']
  }
}

const GET_ALL_JOBS_FOR_SALARY = `
  query GetAllJobsForSalary($first: Int = 200) {
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

// Safe function to get unique values with proper error handling
const getSafeUniqueValues = (jobs, field) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  try {
    const values = []
    
    jobs.forEach(job => {
      try {
        const customFields = parseCustomFields(job.customFields)
        const value = customFields[field]
        
        if (value !== null && value !== undefined && value !== '') {
          // Convert to string safely
          let stringValue = ''
          if (typeof value === 'string') {
            stringValue = value.trim()
          } else if (typeof value === 'number') {
            stringValue = String(value)
          } else if (typeof value === 'boolean') {
            stringValue = String(value)
          } else {
            stringValue = String(value)
          }
          
          if (stringValue && stringValue !== 'undefined' && stringValue !== 'null') {
            values.push(stringValue)
          }
        }
      } catch (error) {
        console.warn(`Error processing job ${job.id} for field ${field}:`, error)
      }
    })
    
    // Remove duplicates and sort
    const uniqueValues = [...new Set(values)]
    return uniqueValues.sort()
  } catch (error) {
    console.warn('Error getting unique values:', error)
    return []
  }
}

// Enhanced filtering function for salary ranges
const filterJobsBySalaryRangeEnhanced = (jobs, minSalary, maxSalary, searchTerms = []) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      
      // Check explicit salary fields
      const jobMinSalary = parseInt(customFields.salaryMin || customFields.salary_min || 0)
      const jobMaxSalary = parseInt(customFields.salaryMax || customFields.salary_max || 999)
      
      // Check if job salary range overlaps with search range
      const explicitSalaryMatch = (jobMinSalary >= minSalary && jobMinSalary <= maxSalary) ||
                                 (jobMaxSalary >= minSalary && jobMaxSalary <= maxSalary) ||
                                 (jobMinSalary <= minSalary && jobMaxSalary >= maxSalary)
      
      if (explicitSalaryMatch && (jobMinSalary > 0 || jobMaxSalary < 999)) {
        return true
      }
      
      // If no explicit salary data, check for keywords in title and excerpt
      const titleLower = (job.title || '').toLowerCase()
      const excerptLower = (job.excerpt || '').toLowerCase()
      
      // Check for search terms
      const keywordMatch = searchTerms.some(term => 
        titleLower.includes(term.toLowerCase()) || 
        excerptLower.includes(term.toLowerCase())
      )
      
      return keywordMatch
    } catch (error) {
      console.warn('Error filtering job by salary range:', error)
      return false
    }
  })
}

export default function SalaryRangeJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState({
    location: 'all',
    experienceLevel: 'all',
    skills: 'all',
    workMode: 'all'
  })

  const rangeSlug = params?.range
  const salaryInfo = salaryRangeMap[rangeSlug]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchAllJobs = async () => {
      if (!salaryInfo) {
        setError('Salary range not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const result = await graphqlRequest(GET_ALL_JOBS_FOR_SALARY, { first: 200 })
        
        if (result?.posts?.nodes) {
          setAllJobs(result.posts.nodes)
        } else {
          setAllJobs([])
        }
      } catch (err) {
        console.error('Error fetching salary range jobs:', err)
        setError('Failed to load jobs for this salary range. Please try again.')
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllJobs()
  }, [mounted, rangeSlug, salaryInfo])

  // Filter jobs based on salary range and additional filters
  useEffect(() => {
    if (!allJobs.length || !salaryInfo) {
      setFilteredJobs([])
      return
    }

    try {
      // First filter by salary range
      let filtered = filterJobsBySalaryRangeEnhanced(
        allJobs, 
        salaryInfo.min, 
        salaryInfo.max, 
        salaryInfo.searchTerms
      )

      // Apply additional filters
      if (filters.location !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const customFields = parseCustomFields(job.customFields)
            const jobLocation = (customFields.city || '').toLowerCase()
            return jobLocation.includes(filters.location.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.location.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.experienceLevel !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const customFields = parseCustomFields(job.customFields)
            const jobExperience = (customFields.experienceLevel || '').toLowerCase()
            return jobExperience.includes(filters.experienceLevel.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.experienceLevel.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.skills !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const customFields = parseCustomFields(job.customFields)
            const jobSkills = (customFields.requiredSkills || customFields.skills || '').toLowerCase()
            return jobSkills.includes(filters.skills.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.skills.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.workMode !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const customFields = parseCustomFields(job.customFields)
            const jobWorkMode = (customFields.workMode || '').toLowerCase()
            return jobWorkMode.includes(filters.workMode.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.workMode.toLowerCase())
          } catch { return false }
        })
      }

      setFilteredJobs(filtered)
    } catch (error) {
      console.error('Error filtering jobs:', error)
      setFilteredJobs([])
    }
  }, [allJobs, salaryInfo, filters])

  // Get unique values for filter options with safe handling
  const uniqueLocations = getSafeUniqueValues(allJobs, 'city').slice(0, 10)
  const popularSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'Angular', 'PHP', 'MySQL']
  const experienceLevels = ['Fresher', '0-1 years', '1-2 years', '2-3 years', '3+ years', '5+ years']
  const workModes = ['Remote', 'Hybrid', 'On-site', 'Work from home']

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        </div>
      </div>
    )
  }

  if (!salaryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salary Range Not Found</h1>
          <p className="text-gray-600 mb-4">The salary range you're looking for doesn't exist.</p>
          <a
            href="/search"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search All Jobs
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-success text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{salaryInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {salaryInfo.name} Jobs
              </h1>
              <p className="text-lg opacity-90">
                {salaryInfo.description}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {loading ? '...' : `${filteredJobs.length} opportunities`} available
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/search" className="hover:text-primary-600">Salary Ranges</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{salaryInfo.name}</span>
        </nav>

        {/* Quick Stats */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">{filteredJobs.length}</div>
              <p className="text-sm text-gray-600">Total Positions</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">
                {filteredJobs.filter(job => {
                  try {
                    const customFields = parseCustomFields(job.customFields)
                    return (customFields.workMode || '').toLowerCase().includes('remote') ||
                           (job.title || '').toLowerCase().includes('remote')
                  } catch { return false }
                }).length}
              </div>
              <p className="text-sm text-gray-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {filteredJobs.filter(job => {
                  try {
                    const customFields = parseCustomFields(job.customFields)
                    return customFields.isUrgent === '1' || customFields.isUrgent === true ||
                           (job.title || '').toLowerCase().includes('urgent')
                  } catch { return false }
                }).length}
              </div>
              <p className="text-sm text-gray-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">
                {uniqueLocations.length}
              </div>
              <p className="text-sm text-gray-600">Cities Available</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && allJobs.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filter {salaryInfo.name} Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Experience Levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <select
                  value={filters.skills}
                  onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Skills</option>
                  {popularSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Work Modes</option>
                  {workModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found in {salaryInfo.name} Range
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} post={job} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{salaryInfo.icon}</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            No jobs found in {salaryInfo.name} range
          </h3>
          <p className="text-gray-600 mb-6">
            {allJobs.length > 0 
              ? 'Try adjusting your filters to see more results.'
              : `We're actively sourcing ${salaryInfo.name} opportunities for you!`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFilters({ location: 'all', experienceLevel: 'all', skills: 'all', workMode: 'all' })}
              className="bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors"
            >
              Clear Filters
            </button>
            <a
              href="/search"
              className="border border-success-600 text-success-600 px-6 py-3 rounded-lg hover:bg-success-50 transition-colors"
            >
              Search All Jobs
            </a>
          </div>
        </div>
      )}

      {/* Salary Range Navigation */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Explore Other Salary Ranges</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(salaryRangeMap).map(([slug, range]) => (
            <a
              key={slug}
              href={`/salary/${slug}`}
              className={`group rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 border ${
                slug === rangeSlug 
                  ? 'bg-success-100 border-success-300 text-success-700'
                  : 'bg-gray-50 hover:bg-success-50 border-gray-200 hover:border-success-200'
              }`}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {range.icon}
              </div>
              <h3 className="font-medium text-gray-800 group-hover:text-success-700">
                {range.name}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Total jobs loaded: {allJobs.length}</p>
          <p>Filtered jobs: {filteredJobs.length}</p>
          <p>Unique locations found: {uniqueLocations.length}</p>
          <p>Search terms for this range: {salaryInfo.searchTerms.join(', ')}</p>
        </div>
      )}
    </div>
  )
}