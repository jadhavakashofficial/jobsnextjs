'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { graphqlRequest, GET_ALL_JOBS_WITH_ACF, extractACFFields, filterJobsBySalaryRange } from '../../../lib/apollo'
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

// Enhanced filtering function for salary ranges using ACF fields
const filterJobsBySalaryRangeACF = (jobs, minSalary, maxSalary, searchTerms = []) => {
  if (!jobs) return []
  
  return jobs.filter(job => {
    try {
      const acfFields = extractACFFields(job)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      
      // Check ACF salary fields first (primary method)
      const jobMinSalary = parseInt(acfFields.salaryMin || 0)
      const jobMaxSalary = parseInt(acfFields.salaryMax || 999)
      
      // Check if job salary range overlaps with search range
      const salaryMatch = (jobMinSalary >= minSalary && jobMinSalary <= maxSalary) ||
                         (jobMaxSalary >= minSalary && jobMaxSalary <= maxSalary) ||
                         (jobMinSalary <= minSalary && jobMaxSalary >= maxSalary)
      
      // If we have explicit salary data and it matches, return true
      if (salaryMatch && (jobMinSalary > 0 || jobMaxSalary < 999)) {
        return true
      }
      
      // Fallback to keyword matching if no explicit salary data
      const keywordMatch = searchTerms.some(term => 
        title.includes(term.toLowerCase()) || 
        excerpt.includes(term.toLowerCase())
      )
      
      return keywordMatch
    } catch (error) {
      console.warn('Error filtering job by salary range:', error)
      return false
    }
  })
}

// Get unique values from ACF fields with safe handling
const getUniqueACFValues = (jobs, fieldName) => {
  if (!jobs || !Array.isArray(jobs)) return []
  
  try {
    const values = jobs
      .map(job => {
        const acfFields = extractACFFields(job)
        return acfFields[fieldName]
      })
      .filter(value => value && value !== '' && value !== 'undefined' && value !== 'null')
      .map(value => String(value).trim())
      .filter((value, index, self) => self.indexOf(value) === index)
    
    return values.sort().slice(0, 10) // Limit to 10 for UI
  } catch (error) {
    console.warn('Error getting unique ACF values:', error)
    return []
  }
}

// Calculate salary statistics using ACF fields
const calculateSalaryStats = (jobs, salaryInfo) => {
  if (!jobs || !Array.isArray(jobs)) return {
    total: 0,
    remote: 0,
    urgent: 0,
    fresher: 0,
    withExplicitSalary: 0,
    avgSalaryMin: 0,
    avgSalaryMax: 0
  }
  
  try {
    // Filter jobs by salary range first
    const salaryJobs = filterJobsBySalaryRangeACF(jobs, salaryInfo.min, salaryInfo.max, salaryInfo.searchTerms)
    
    const stats = {
      total: salaryJobs.length,
      remote: 0,
      urgent: 0,
      fresher: 0,
      withExplicitSalary: 0,
      avgSalaryMin: 0,
      avgSalaryMax: 0
    }
    
    let salaryMinSum = 0, salaryMaxSum = 0, salaryCount = 0
    
    salaryJobs.forEach(job => {
      try {
        const acfFields = extractACFFields(job)
        const title = (job.title || '').toLowerCase()
        
        // Count remote jobs using ACF work mode
        const workMode = (acfFields.workMode || '').toLowerCase()
        if (workMode.includes('remote') || workMode.includes('wfh') ||
            title.includes('remote') || title.includes('wfh')) {
          stats.remote++
        }
        
        // Count urgent jobs using ACF field
        if (acfFields.isUrgent === true || acfFields.isUrgent === '1' || 
            acfFields.isUrgent === 1 || title.includes('urgent')) {
          stats.urgent++
        }
        
        // Count fresher jobs using ACF experience level
        const experienceLevel = (acfFields.experienceLevel || '').toLowerCase()
        if (experienceLevel.includes('fresher') || experienceLevel.includes('0') ||
            title.includes('fresher') || title.includes('trainee')) {
          stats.fresher++
        }
        
        // Calculate salary averages
        const minSal = parseInt(acfFields.salaryMin || 0)
        const maxSal = parseInt(acfFields.salaryMax || 0)
        
        if (minSal > 0 || maxSal > 0) {
          stats.withExplicitSalary++
          if (minSal > 0) {
            salaryMinSum += minSal
            salaryCount++
          }
          if (maxSal > 0) {
            salaryMaxSum += maxSal
          }
        }
      } catch (error) {
        console.warn('Error processing job stats:', error)
      }
    })
    
    // Calculate averages
    if (salaryCount > 0) {
      stats.avgSalaryMin = Math.round(salaryMinSum / salaryCount)
      stats.avgSalaryMax = Math.round(salaryMaxSum / salaryCount)
    }
    
    return stats
  } catch (error) {
    console.warn('Error calculating salary stats:', error)
    return { total: 0, remote: 0, urgent: 0, fresher: 0, withExplicitSalary: 0, avgSalaryMin: 0, avgSalaryMax: 0 }
  }
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
  const [debugInfo, setDebugInfo] = useState(null)

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
        
        console.log(`🎯 Fetching jobs for salary range ${salaryInfo.name} using ACF fields...`)
        
        // Use ACF-enabled query
        const result = await graphqlRequest(GET_ALL_JOBS_WITH_ACF, { first: 300 })
        
        if (result?.posts?.nodes) {
          console.log(`✅ Successfully fetched ${result.posts.nodes.length} jobs with ACF fields`)
          
          // Debug: Check ACF field availability for salary
          const sampleJob = result.posts.nodes[0]
          if (sampleJob) {
            const sampleACF = extractACFFields(sampleJob)
            setDebugInfo({
              totalJobs: result.posts.nodes.length,
              sampleACF: sampleACF,
              acfFieldsAvailable: {
                salaryMin: !!sampleJob.salaryMin,
                salaryMax: !!sampleJob.salaryMax,
                workMode: !!sampleJob.workMode,
                experienceLevel: !!sampleJob.experienceLevel,
                city: !!sampleJob.city,
                isUrgent: !!sampleJob.isUrgent,
                requiredSkills: !!sampleJob.requiredSkills
              }
            })
            
            console.log('📊 Sample ACF salary data:', {
              salaryMin: sampleJob.salaryMin,
              salaryMax: sampleJob.salaryMax,
              workMode: sampleJob.workMode,
              experienceLevel: sampleJob.experienceLevel
            })
          }
          
          setAllJobs(result.posts.nodes)
        } else {
          console.warn('⚠️ No jobs data received')
          setAllJobs([])
        }
      } catch (err) {
        console.error('💥 Error fetching salary range jobs:', err)
        setError('Failed to load jobs for this salary range. Please try again.')
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllJobs()
  }, [mounted, rangeSlug, salaryInfo])

  // Filter jobs based on salary range and additional filters using ACF
  useEffect(() => {
    if (!allJobs.length || !salaryInfo) {
      setFilteredJobs([])
      return
    }

    try {
      // First filter by salary range using ACF fields
      let filtered = filterJobsBySalaryRangeACF(
        allJobs, 
        salaryInfo.min, 
        salaryInfo.max, 
        salaryInfo.searchTerms
      )
      
      console.log(`💰 Salary filtering: ${allJobs.length} → ${filtered.length} jobs for ${salaryInfo.name}`)

      // Apply additional filters using ACF fields
      if (filters.location !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const acfFields = extractACFFields(job)
            const jobLocation = (acfFields.city || '').toLowerCase()
            return jobLocation.includes(filters.location.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.location.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.experienceLevel !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const acfFields = extractACFFields(job)
            const jobExperience = (acfFields.experienceLevel || '').toLowerCase()
            return jobExperience.includes(filters.experienceLevel.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.experienceLevel.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.skills !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const acfFields = extractACFFields(job)
            const jobSkills = (acfFields.requiredSkills || '').toLowerCase()
            return jobSkills.includes(filters.skills.toLowerCase()) ||
                   (job.title || '').toLowerCase().includes(filters.skills.toLowerCase())
          } catch { return false }
        })
      }

      if (filters.workMode !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const acfFields = extractACFFields(job)
            const jobWorkMode = (acfFields.workMode || '').toLowerCase()
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

  // Get unique values for filter options using ACF fields
  const uniqueLocations = getUniqueACFValues(allJobs, 'city')
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
          <Link
            href="/search"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search All Jobs
          </Link>
        </div>
      </div>
    )
  }

  const stats = calculateSalaryStats(allJobs, salaryInfo)

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
                {loading ? '...' : `${stats.total} opportunities`} available using ACF salary field matching
              </p>
            </div>
          </div>
        </div>

        {/* ACF Status Indicator */}
        {!loading && debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">🔍 ACF Salary Matching:</span>
              <span className="text-green-600">✅ Active</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>• Using direct ACF salaryMin and salaryMax fields for precise salary matching</p>
              <p>• {debugInfo.totalJobs} jobs analyzed with ACF fields</p>
              <p>• Salary Min field: {debugInfo.acfFieldsAvailable.salaryMin ? '✅' : '❌'} | Salary Max field: {debugInfo.acfFieldsAvailable.salaryMax ? '✅' : '❌'}</p>
              <p>• {stats.withExplicitSalary} jobs have explicit salary data</p>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-primary-600">Salary Ranges</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{salaryInfo.name}</span>
        </nav>

        {/* Quick Stats */}
        {!loading && stats.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Positions</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.remote}</div>
              <p className="text-sm text-gray-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">{stats.urgent}</div>
              <p className="text-sm text-gray-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">{stats.withExplicitSalary}</div>
              <p className="text-sm text-gray-600">With Salary Data</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.fresher}</div>
              <p className="text-sm text-gray-600">Fresher Friendly</p>
            </div>
          </div>
        )}

        {/* Salary Insights */}
        {!loading && stats.withExplicitSalary > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              💰 Salary Insights for {salaryInfo.name} Range
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">ACF Based</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  ₹{stats.avgSalaryMin}L - ₹{stats.avgSalaryMax}L
                </div>
                <p className="text-sm text-green-700">Average Salary Range</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {Math.round((stats.withExplicitSalary / stats.total) * 100)}%
                </div>
                <p className="text-sm text-blue-700">Jobs with Salary Data</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {Math.round((stats.remote / stats.total) * 100)}%
                </div>
                <p className="text-sm text-purple-700">Remote Work Options</p>
              </div>
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
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Finding {salaryInfo.name} jobs using ACF salary fields...
          </p>
          <p className="text-sm text-gray-500 mt-2">Analyzing salaryMin and salaryMax data</p>
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
            {stats.total > 0 
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
            <Link
              href="/search"
              className="border border-success-600 text-success-600 px-6 py-3 rounded-lg hover:bg-success-50 transition-colors"
            >
              Search All Jobs
            </Link>
          </div>
        </div>
      )}

      {/* Salary Range Navigation */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Explore Other Salary Ranges</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(salaryRangeMap).map(([slug, range]) => (
            <Link
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
            </Link>
          ))}
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">🔧 ACF Debug Info:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Total jobs loaded:</strong> {debugInfo.totalJobs}</p>
            <p><strong>Filtered jobs:</strong> {filteredJobs.length}</p>
            <p><strong>Jobs with explicit salary:</strong> {stats.withExplicitSalary}</p>
            <p><strong>Unique locations found:</strong> {uniqueLocations.length}</p>
            <p><strong>Search terms for this range:</strong> {salaryInfo.searchTerms.join(', ')}</p>
            <p><strong>ACF Fields Available:</strong></p>
            <ul className="ml-4">
              <li>Salary Min: {debugInfo.acfFieldsAvailable.salaryMin ? '✅' : '❌'}</li>
              <li>Salary Max: {debugInfo.acfFieldsAvailable.salaryMax ? '✅' : '❌'}</li>
              <li>Work Mode: {debugInfo.acfFieldsAvailable.workMode ? '✅' : '❌'}</li>
              <li>Experience Level: {debugInfo.acfFieldsAvailable.experienceLevel ? '✅' : '❌'}</li>
              <li>City: {debugInfo.acfFieldsAvailable.city ? '✅' : '❌'}</li>
              <li>Is Urgent: {debugInfo.acfFieldsAvailable.isUrgent ? '✅' : '❌'}</li>
            </ul>
            <p><strong>Sample ACF salary data:</strong></p>
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(debugInfo.sampleACF, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}