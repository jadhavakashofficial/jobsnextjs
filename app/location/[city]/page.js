'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest, GET_ALL_JOBS, filterJobsByLocation } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// City mapping
const cityMap = {
  'mumbai': { name: 'Mumbai', state: 'Maharashtra' },
  'delhi': { name: 'Delhi', state: 'Delhi' },
  'bangalore': { name: 'Bangalore', state: 'Karnataka' },
  'pune': { name: 'Pune', state: 'Maharashtra' },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana' },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu' },
  'gurgaon': { name: 'Gurgaon', state: 'Haryana' },
  'noida': { name: 'Noida', state: 'Uttar Pradesh' },
  'kolkata': { name: 'Kolkata', state: 'West Bengal' },
  'ahmedabad': { name: 'Ahmedabad', state: 'Gujarat' },
  'remote': { name: 'Remote', state: 'Work from Anywhere' }
}

export default function LocationJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filters, setFilters] = useState({
    experienceLevel: 'all',
    workMode: 'all',
    salaryRange: 'all',
    urgentOnly: false
  })

  const citySlug = params?.city
  const cityInfo = cityMap[citySlug]

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all jobs and filter client-side
        const result = await graphqlRequest(GET_ALL_JOBS, { first: 200 })
        
        if (result?.posts?.nodes) {
          setAllJobs(result.posts.nodes)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllJobs()
  }, [])

  // Filter jobs when city or filters change
  useEffect(() => {
    if (!cityInfo || !allJobs.length) return

    let filtered = filterJobsByLocation(allJobs, cityInfo.name)

    // Apply additional filters
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => 
        job.customFields?.experienceLevel?.toLowerCase() === filters.experienceLevel.toLowerCase()
      )
    }

    if (filters.workMode !== 'all') {
      filtered = filtered.filter(job => 
        job.customFields?.workMode?.toLowerCase() === filters.workMode.toLowerCase()
      )
    }

    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(job => {
        const jobMin = parseInt(job.customFields?.salaryMin) || 0
        const jobMax = parseInt(job.customFields?.salaryMax) || 999
        return jobMin >= min && jobMax <= max
      })
    }

    if (filters.urgentOnly) {
      filtered = filtered.filter(job => {
        const isUrgent = job.customFields?.isUrgent
        return isUrgent === '1' || isUrgent === true || isUrgent === 'true'
      })
    }

    setFilteredJobs(filtered)
  }, [allJobs, citySlug, cityInfo, filters])

  if (!cityInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-neutral-600">The city you're looking for doesn't exist in our listings.</p>
        </div>
      </div>
    )
  }

  // Get unique values for filters
  const getUniqueValues = (field) => {
    const locationJobs = filterJobsByLocation(allJobs, cityInfo.name)
    const values = locationJobs
      .map(job => job.customFields?.[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return values.sort()
  }

  const uniqueExperienceLevels = getUniqueValues('experienceLevel')
  const uniqueWorkModes = getUniqueValues('workMode')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-primary text-white rounded-2xl p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Jobs in {cityInfo.name}
          </h1>
          <p className="text-lg opacity-90 mb-2">
            {cityInfo.state}
          </p>
          <p className="text-sm opacity-80">
            {loading ? 'Loading...' : `${filteredJobs.length} opportunities available`}
          </p>
        </div>

        {/* Quick Stats */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">{filteredJobs.length}</div>
              <p className="text-sm text-neutral-600">Total Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">
                {filteredJobs.filter(job => job.customFields?.workMode === 'Remote').length}
              </div>
              <p className="text-sm text-neutral-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">
                {filteredJobs.filter(job => {
                  const isUrgent = job.customFields?.isUrgent
                  return isUrgent === '1' || isUrgent === true || isUrgent === 'true'
                }).length}
              </div>
              <p className="text-sm text-neutral-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {filteredJobs.filter(job => job.customFields?.experienceLevel === 'Fresher').length}
              </div>
              <p className="text-sm text-neutral-600">Fresher Jobs</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && filteredJobs.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filter Jobs in {cityInfo.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Experience Levels</option>
                  {uniqueExperienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Work Mode
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Work Modes</option>
                  {uniqueWorkModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Salary Range
                </label>
                <select
                  value={filters.salaryRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Salary Ranges</option>
                  <option value="0-3">0-3 LPA</option>
                  <option value="3-5">3-5 LPA</option>
                  <option value="5-8">5-8 LPA</option>
                  <option value="8-12">8-12 LPA</option>
                  <option value="12-999">12+ LPA</option>
                </select>
              </div>

              {/* Urgent Jobs Toggle */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Type
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.urgentOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, urgentOnly: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Urgent jobs only</span>
                </label>
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
              <div className="h-48 bg-neutral-200"></div>
              <div className="p-6">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="bg-error-50 border border-error-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-error-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-error-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-error-600 text-white px-6 py-2 rounded-lg hover:bg-error-700 transition-colors"
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
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} in {cityInfo.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-2xl font-bold text-neutral-700 mb-4">
            No jobs found in {cityInfo.name}
          </h3>
          <p className="text-neutral-600 mb-6">
            {allJobs.length > 0 
              ? 'Try adjusting your filters to see more results.'
              : `We're actively sourcing opportunities in ${cityInfo.name} for you!`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFilters({ 
                experienceLevel: 'all', 
                workMode: 'all', 
                salaryRange: 'all', 
                urgentOnly: false 
              })}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
            <a
              href="/search"
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Search All Jobs
            </a>
          </div>
        </div>
      )}
    </div>
  )
}