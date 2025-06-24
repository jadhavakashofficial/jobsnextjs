'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// Salary range mapping for SEO-friendly URLs
const salaryRangeMap = {
  '0-3-lpa': { 
    min: 0, 
    max: 3, 
    name: '0-3 LPA', 
    description: 'Entry-level positions perfect for freshers and new graduates',
    icon: '🌱',
    searchTerms: ['fresher', '0-3', 'entry level', 'graduate']
  },
  '3-5-lpa': { 
    min: 3, 
    max: 5, 
    name: '3-5 LPA', 
    description: 'Mid-level opportunities for professionals with 1-2 years experience',
    icon: '📈',
    searchTerms: ['3-5', 'junior', '1-2 years', 'associate']
  },
  '5-8-lpa': { 
    min: 5, 
    max: 8, 
    name: '5-8 LPA', 
    description: 'Senior positions for experienced professionals',
    icon: '💼',
    searchTerms: ['5-8', 'senior', 'experienced', '3+ years']
  },
  '8-12-lpa': { 
    min: 8, 
    max: 12, 
    name: '8-12 LPA', 
    description: 'High-paying roles for senior developers and specialists',
    icon: '🚀',
    searchTerms: ['8-12', 'lead', 'specialist', '5+ years']
  },
  '12-plus-lpa': { 
    min: 12, 
    max: 100, 
    name: '12+ LPA', 
    description: 'Premium positions for team leads and architects',
    icon: '💎',
    searchTerms: ['12+', 'architect', 'manager', 'principal']
  }
}

const GET_ALL_JOBS_FOR_SALARY = `
  query GetAllJobsForSalary($first: Int = 100) {
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
    skills: 'all'
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
        
        // Get all jobs and filter client-side based on custom fields
        const result = await graphqlRequest(GET_ALL_JOBS_FOR_SALARY, { first: 200 })
        
        if (result?.posts?.nodes) {
          setAllJobs(result.posts.nodes)
        }
      } catch (err) {
        console.error('Error fetching salary range jobs:', err)
        setError('Failed to load jobs for this salary range. Please try again.')
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

    let filtered = allJobs.filter(job => {
      try {
        const customFields = typeof job.customFields === 'string' 
          ? JSON.parse(job.customFields) 
          : job.customFields || {}

        const jobMinSalary = parseInt(customFields.salaryMin) || 0
        const jobMaxSalary = parseInt(customFields.salaryMax) || 999

        // Check if job salary range overlaps with our target range
        const salaryMatch = (jobMinSalary >= salaryInfo.min && jobMinSalary <= salaryInfo.max) ||
                           (jobMaxSalary >= salaryInfo.min && jobMaxSalary <= salaryInfo.max) ||
                           (jobMinSalary <= salaryInfo.min && jobMaxSalary >= salaryInfo.max)

        // Also check for keywords in title/content if no explicit salary data
        const keywordMatch = !customFields.salaryMin && !customFields.salaryMax && 
          salaryInfo.searchTerms.some(term => 
            job.title.toLowerCase().includes(term.toLowerCase()) ||
            job.excerpt?.toLowerCase().includes(term.toLowerCase())
          )

        return salaryMatch || keywordMatch
      } catch {
        return false
      }
    })

    // Apply additional filters
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => {
        try {
          const customFields = typeof job.customFields === 'string' 
            ? JSON.parse(job.customFields) 
            : job.customFields || {}
          return customFields.city?.toLowerCase().includes(filters.location.toLowerCase())
        } catch { return false }
      })
    }

    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => {
        try {
          const customFields = typeof job.customFields === 'string' 
            ? JSON.parse(job.customFields) 
            : job.customFields || {}
          return customFields.experienceLevel?.toLowerCase() === filters.experienceLevel.toLowerCase()
        } catch { return false }
      })
    }

    if (filters.skills !== 'all') {
      filtered = filtered.filter(job => {
        try {
          const customFields = typeof job.customFields === 'string' 
            ? JSON.parse(job.customFields) 
            : job.customFields || {}
          const jobSkills = customFields.requiredSkills || ''
          return jobSkills.toLowerCase().includes(filters.skills.toLowerCase())
        } catch { return false }
      })
    }

    setFilteredJobs(filtered)
  }, [allJobs, salaryInfo, filters])

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    const values = allJobs
      .map(job => {
        try {
          const customFields = typeof job.customFields === 'string' 
            ? JSON.parse(job.customFields) 
            : job.customFields || {}
          return customFields[field]
        } catch { return null }
      })
      .filter(value => value && value.trim())
      .filter((value, index, self) => self.indexOf(value) === index)
    return values.sort()
  }

  const uniqueLocations = getUniqueValues('city')
  const popularSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'Angular']

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

        {/* Salary Insights */}
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
                    const customFields = typeof job.customFields === 'string' 
                      ? JSON.parse(job.customFields) 
                      : job.customFields || {}
                    return customFields.workMode === 'Remote'
                  } catch { return false }
                }).length}
              </div>
              <p className="text-sm text-gray-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {filteredJobs.filter(job => {
                  try {
                    const customFields = typeof job.customFields === 'string' 
                      ? JSON.parse(job.customFields) 
                      : job.customFields || {}
                    return customFields.isUrgent === '1' || customFields.isUrgent === true
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {uniqueLocations.slice(0, 10).map(location => (
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
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3+ years">3+ years</option>
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
              onClick={() => setFilters({ location: 'all', experienceLevel: 'all', skills: 'all' })}
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
    </div>
  )
}