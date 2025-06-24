'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// City mapping with exact ACF field values
const cityMap = {
  'mumbai': { 
    name: 'Mumbai', 
    state: 'Maharashtra',
    icon: '🏙️',
    description: 'India\'s financial capital and business hub',
    industries: ['Finance', 'IT', 'Entertainment', 'Manufacturing'],
    avgSalary: '₹8-15 LPA',
    acfCityValues: ['Mumbai', 'mumbai', 'Bombay', 'bombay'],
    acfStateValues: ['Maharashtra', 'maharashtra', 'MH'],
    searchTerms: ['mumbai', 'bombay', 'Maharashtra']
  },
  'bangalore': { 
    name: 'Bangalore', 
    state: 'Karnataka',
    icon: '🌆',
    description: 'India\'s Silicon Valley and IT capital',
    industries: ['IT', 'Startups', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹6-18 LPA',
    acfCityValues: ['Bangalore', 'bangalore', 'Bengaluru', 'bengaluru'],
    acfStateValues: ['Karnataka', 'karnataka', 'KA'],
    searchTerms: ['bangalore', 'bengaluru', 'Karnataka']
  },
  'delhi': { 
    name: 'Delhi', 
    state: 'Delhi',
    icon: '🏛️',
    description: 'India\'s capital and government hub',
    industries: ['Government', 'IT', 'Education', 'Healthcare'],
    avgSalary: '₹5-12 LPA',
    acfCityValues: ['Delhi', 'delhi', 'New Delhi', 'new delhi'],
    acfStateValues: ['Delhi', 'delhi', 'NCR', 'ncr'],
    searchTerms: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'noida']
  },
  'pune': { 
    name: 'Pune', 
    state: 'Maharashtra',
    icon: '🏘️',
    description: 'IT hub and educational center of Maharashtra',
    industries: ['IT', 'Automotive', 'Education', 'Manufacturing'],
    avgSalary: '₹5-14 LPA',
    acfCityValues: ['Pune', 'pune'],
    acfStateValues: ['Maharashtra', 'maharashtra', 'MH'],
    searchTerms: ['pune', 'Maharashtra']
  },
  'hyderabad': { 
    name: 'Hyderabad', 
    state: 'Telangana',
    icon: '🏗️',
    description: 'Cyberabad - IT and pharmaceutical hub',
    industries: ['IT', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹5-15 LPA',
    acfCityValues: ['Hyderabad', 'hyderabad', 'Cyberabad', 'cyberabad'],
    acfStateValues: ['Telangana', 'telangana', 'TS'],
    searchTerms: ['hyderabad', 'cyberabad', 'Telangana']
  },
  'chennai': { 
    name: 'Chennai', 
    state: 'Tamil Nadu',
    icon: '🌴',
    description: 'Detroit of India and IT services hub',
    industries: ['Automotive', 'IT', 'Healthcare', 'Manufacturing'],
    avgSalary: '₹4-12 LPA',
    acfCityValues: ['Chennai', 'chennai', 'Madras', 'madras'],
    acfStateValues: ['Tamil Nadu', 'tamil nadu', 'TN'],
    searchTerms: ['chennai', 'madras', 'Tamil Nadu']
  },
  'remote': { 
    name: 'Remote', 
    state: 'Work from Anywhere',
    icon: '💻',
    description: 'Work from anywhere in India',
    industries: ['IT', 'Digital Marketing', 'Content', 'Consulting'],
    avgSalary: '₹4-25 LPA',
    acfCityValues: ['Remote', 'remote', 'Work from Home', 'WFH'],
    acfStateValues: ['Remote', 'remote', 'Work from Anywhere'],
    searchTerms: ['remote', 'work from home', 'wfh', 'online']
  }
}

// Working GraphQL query - uses individual ACF fields instead of field groups
const GET_JOBS_WITH_ACF_FIELDS = `
  query GetJobsWithACFFields {
    posts(
      first: 300,
      where: {
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
        # Individual ACF fields (not field groups)
        city
        state
        workMode
        salaryMin
        salaryMax
        isUrgent
        applicationDeadline
        companySize
        requiredSkills
        experienceLevel
        educationRequired
      }
    }
  }
`

// Fallback query without ACF fields
const GET_JOBS_SIMPLE = `
  query GetJobsSimple {
    posts(
      first: 300,
      where: {
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
      }
    }
  }
`

// Search-based fallback query
const GET_JOBS_BY_SEARCH = `
  query GetJobsBySearch($searchTerm: String!) {
    posts(
      first: 100,
      where: {
        search: $searchTerm,
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
      }
    }
  }
`

// Helper function to extract ACF data from direct fields
const extractACFData = (post) => {
  try {
    // Direct ACF field access (if available)
    return {
      city: post.city || '',
      state: post.state || '',
      workMode: post.workMode || '',
      salaryMin: post.salaryMin || '',
      salaryMax: post.salaryMax || '',
      isUrgent: post.isUrgent || false,
      applicationDeadline: post.applicationDeadline || '',
      companySize: post.companySize || '',
      requiredSkills: post.requiredSkills || '',
      experienceLevel: post.experienceLevel || '',
      educationRequired: post.educationRequired || ''
    }
  } catch (error) {
    console.warn('Failed to extract ACF data:', error)
    return {}
  }
}

// Enhanced filtering function with proper ACF field matching
const filterJobsByCity = (jobs, cityInfo) => {
  if (!jobs || !cityInfo) return []
  
  return jobs.filter(job => {
    try {
      const acfData = extractACFData(job)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      
      // Get ACF values safely
      const jobCity = (acfData.city || '').toString().toLowerCase().trim()
      const jobState = (acfData.state || '').toString().toLowerCase().trim()
      
      // Strategy 1: Exact ACF field matches
      const acfCityMatch = cityInfo.acfCityValues.some(acfValue => 
        jobCity === acfValue.toLowerCase().trim()
      )
      
      const acfStateMatch = cityInfo.acfStateValues.some(acfValue => 
        jobState === acfValue.toLowerCase().trim()
      )
      
      // Strategy 2: Partial ACF field matches
      const acfPartialMatch = cityInfo.acfCityValues.some(acfValue => 
        jobCity.includes(acfValue.toLowerCase()) || 
        jobState.includes(acfValue.toLowerCase())
      ) || cityInfo.acfStateValues.some(acfValue => 
        jobCity.includes(acfValue.toLowerCase()) || 
        jobState.includes(acfValue.toLowerCase())
      )
      
      // Strategy 3: Content-based matches (fallback)
      const contentMatch = cityInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return title.includes(searchTerm) || excerpt.includes(searchTerm)
      })
      
      const matched = acfCityMatch || acfStateMatch || acfPartialMatch || contentMatch
      
      // Debug logging
      if (process.env.NODE_ENV === 'development' && matched) {
        console.log(`✅ Job "${job.title}" matched for ${cityInfo.name}:`, {
          jobCity,
          jobState,
          acfCityMatch,
          acfStateMatch,
          acfPartialMatch,
          contentMatch,
          acfData
        })
      }
      
      return matched
    } catch (error) {
      console.warn('Error filtering job:', error)
      return false
    }
  })
}

// Calculate job statistics
const calculateStats = (jobs, cityInfo) => {
  const cityJobs = filterJobsByCity(jobs, cityInfo)
  
  const stats = {
    total: cityJobs.length,
    urgent: 0,
    remote: 0,
    fresher: 0,
    senior: 0
  }
  
  cityJobs.forEach(job => {
    try {
      const acfData = extractACFData(job)
      const title = (job.title || '').toLowerCase()
      
      // Count urgent jobs (check boolean and string values)
      if (acfData.isUrgent === true || acfData.isUrgent === 'true' || 
          acfData.isUrgent === '1' || acfData.isUrgent === 1 ||
          title.includes('urgent')) {
        stats.urgent++
      }
      
      // Count remote jobs
      const workMode = (acfData.workMode || '').toString().toLowerCase()
      if (workMode.includes('remote') || workMode.includes('wfh') ||
          title.includes('remote') || title.includes('wfh')) {
        stats.remote++
      }
      
      // Count fresher jobs
      const experienceLevel = (acfData.experienceLevel || '').toString().toLowerCase()
      if (experienceLevel.includes('fresher') || 
          title.includes('fresher') || title.includes('trainee')) {
        stats.fresher++
      }
      
      // Count senior jobs
      if (experienceLevel.includes('senior') || 
          title.includes('senior') || title.includes('lead')) {
        stats.senior++
      }
    } catch (error) {
      // Skip if parsing fails
    }
  })
  
  return stats
}

export default function LocationCityPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [additionalFilters, setAdditionalFilters] = useState({
    experience: 'all',
    workMode: 'all',
    urgent: false
  })

  const citySlug = params?.city
  const cityInfo = cityMap[citySlug]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !cityInfo) return

    const fetchCityJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let allJobsData = []
        
        // Strategy 1: Try individual ACF fields
        try {
          console.log('🎯 Attempting to fetch jobs with individual ACF fields...')
          const acfResult = await graphqlRequest(GET_JOBS_WITH_ACF_FIELDS)
          
          if (acfResult?.posts?.nodes) {
            allJobsData = acfResult.posts.nodes
            console.log(`✅ Successfully fetched ${acfResult.posts.nodes.length} jobs with ACF fields`)
            
            // Log sample ACF structure for debugging
            if (acfResult.posts.nodes.length > 0) {
              const sampleJob = acfResult.posts.nodes[0]
              const sampleACF = extractACFData(sampleJob)
              console.log('📊 Sample ACF data structure:', {
                directFields: {
                  city: sampleJob.city,
                  state: sampleJob.state,
                  workMode: sampleJob.workMode,
                  salaryMin: sampleJob.salaryMin,
                  salaryMax: sampleJob.salaryMax,
                  isUrgent: sampleJob.isUrgent,
                  requiredSkills: sampleJob.requiredSkills,
                  experienceLevel: sampleJob.experienceLevel
                },
                extractedACF: sampleACF
              })
            }
          }
        } catch (err) {
          console.warn('❌ Individual ACF fields query failed:', err.message)
          
          // Strategy 2: Fallback to simple query without ACF fields
          try {
            console.log('🔄 Fallback: Trying simple query without ACF fields...')
            const simpleResult = await graphqlRequest(GET_JOBS_SIMPLE)
            
            if (simpleResult?.posts?.nodes) {
              allJobsData = simpleResult.posts.nodes
              console.log(`✅ Fallback successful: ${simpleResult.posts.nodes.length} jobs fetched`)
            }
          } catch (simpleErr) {
            console.warn('❌ Simple query also failed:', simpleErr.message)
          }
        }
        
        // Strategy 3: Additional search-based queries if we have few results
        if (allJobsData.length < 50) {
          try {
            console.log('🔍 Adding search-based results...')
            for (const searchTerm of cityInfo.searchTerms.slice(0, 2)) {
              const searchResult = await graphqlRequest(GET_JOBS_BY_SEARCH, {
                searchTerm: searchTerm
              })
              
              if (searchResult?.posts?.nodes) {
                allJobsData = [...allJobsData, ...searchResult.posts.nodes]
              }
            }
            console.log(`🔍 Search results added. Total: ${allJobsData.length}`)
          } catch (searchErr) {
            console.warn('❌ Search queries failed:', searchErr.message)
          }
        }
        
        // Remove duplicates and sort
        const uniqueJobs = []
        const seenIds = new Set()
        allJobsData.forEach(job => {
          if (!seenIds.has(job.id)) {
            seenIds.add(job.id)
            uniqueJobs.push(job)
          }
        })
        
        uniqueJobs.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        console.log(`📈 Final result: ${uniqueJobs.length} unique jobs`)
        setAllJobs(uniqueJobs)
        
      } catch (err) {
        console.error('💥 Fatal error fetching jobs:', err)
        setError('Failed to load jobs for this city. Please try again.')
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchCityJobs()
  }, [mounted, citySlug, cityInfo])

  // Filter jobs based on city and additional filters
  useEffect(() => {
    if (!allJobs.length || !cityInfo) {
      setFilteredJobs([])
      return
    }

    try {
      // Filter by city using enhanced ACF matching
      let cityJobs = filterJobsByCity(allJobs, cityInfo)
      console.log(`🏙️ City filtering: ${allJobs.length} → ${cityJobs.length} jobs for ${cityInfo.name}`)
      
      // Apply active filter (tabs)
      if (activeFilter !== 'all') {
        cityJobs = cityJobs.filter(job => {
          try {
            const acfData = extractACFData(job)
            const title = (job.title || '').toLowerCase()
            
            switch(activeFilter) {
              case 'urgent':
                return acfData.isUrgent === true || 
                       acfData.isUrgent === 'true' ||
                       acfData.isUrgent === '1' || 
                       acfData.isUrgent === 1 ||
                       title.includes('urgent')
              case 'remote':
                const workMode = (acfData.workMode || '').toString().toLowerCase()
                return workMode.includes('remote') || 
                       title.includes('remote') || title.includes('wfh')
              case 'fresher':
                const experienceLevel = (acfData.experienceLevel || '').toString().toLowerCase()
                return experienceLevel.includes('fresher') ||
                       title.includes('fresher') || title.includes('trainee')
              default:
                return true
            }
          } catch {
            return false
          }
        })
      }
      
      // Apply additional filters
      if (additionalFilters.experience !== 'all') {
        cityJobs = cityJobs.filter(job => {
          try {
            const acfData = extractACFData(job)
            const jobExperience = (acfData.experienceLevel || '').toString().toLowerCase()
            const title = (job.title || '').toLowerCase()
            
            return jobExperience.includes(additionalFilters.experience.toLowerCase()) ||
                   title.includes(additionalFilters.experience.toLowerCase())
          } catch {
            return false
          }
        })
      }
      
      if (additionalFilters.workMode !== 'all') {
        cityJobs = cityJobs.filter(job => {
          try {
            const acfData = extractACFData(job)
            const jobWorkMode = (acfData.workMode || '').toString().toLowerCase()
            const title = (job.title || '').toLowerCase()
            
            return jobWorkMode.includes(additionalFilters.workMode.toLowerCase()) ||
                   title.includes(additionalFilters.workMode.toLowerCase())
          } catch {
            return false
          }
        })
      }
      
      if (additionalFilters.urgent) {
        cityJobs = cityJobs.filter(job => {
          try {
            const acfData = extractACFData(job)
            const title = (job.title || '').toLowerCase()
            
            return acfData.isUrgent === true || 
                   acfData.isUrgent === 'true' ||
                   acfData.isUrgent === '1' || 
                   acfData.isUrgent === 1 ||
                   title.includes('urgent')
          } catch {
            return false
          }
        })
      }
      
      setFilteredJobs(cityJobs)
      
    } catch (error) {
      console.error('Error applying filters:', error)
      setFilteredJobs([])
    }
  }, [allJobs, cityInfo, activeFilter, additionalFilters])

  // Loading state
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

  // City not found
  if (!cityInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-4">The city you're looking for doesn't exist in our database.</p>
          <Link
            href="/all-locations"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Cities
          </Link>
        </div>
      </div>
    )
  }

  const stats = calculateStats(allJobs, cityInfo)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-primary text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{cityInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Jobs in {cityInfo.name}
              </h1>
              <p className="text-lg opacity-90">
                {cityInfo.description} • {cityInfo.state}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {loading ? 'Loading...' : `${stats.total} opportunities`} from top companies
              </p>
            </div>
          </div>
          
          {/* City Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{cityInfo.avgSalary}</div>
              <p className="text-sm opacity-80">Avg Salary</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{cityInfo.industries.length}+</div>
              <p className="text-sm opacity-80">Industries</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}+</div>
              <p className="text-sm opacity-80">Live Jobs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.remote}</div>
              <p className="text-sm opacity-80">Remote Jobs</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/all-locations" className="hover:text-primary-600">All Cities</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{cityInfo.name} Jobs</span>
        </nav>

        {/* Quick Stats */}
        {!loading && stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">{stats.remote}</div>
              <p className="text-sm text-gray-600">Remote Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">{stats.urgent}</div>
              <p className="text-sm text-gray-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">{stats.fresher}</div>
              <p className="text-sm text-gray-600">Fresher Jobs</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All Jobs', count: stats.total },
              { key: 'urgent', label: '🔥 Urgent', count: stats.urgent },
              { key: 'remote', label: '💻 Remote', count: stats.remote },
              { key: 'fresher', label: '🌱 Fresher', count: stats.fresher }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={additionalFilters.experience}
                onChange={(e) => setAdditionalFilters(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Experience</option>
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
              <select
                value={additionalFilters.workMode}
                onChange={(e) => setAdditionalFilters(prev => ({ ...prev, workMode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Work Modes</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setAdditionalFilters({ experience: 'all', workMode: 'all', urgent: false })
                  setActiveFilter('all')
                }}
                className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading jobs in {cityInfo.name}...</p>
          <p className="text-sm text-gray-500 mt-2">Searching through ACF fields and content...</p>
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
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found in {cityInfo.name}
            </h2>
            <div className="text-sm text-gray-500">
              {activeFilter !== 'all' && `Showing ${activeFilter} jobs`}
            </div>
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
          <div className="text-6xl mb-4">{cityInfo.icon}</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            No jobs found in {cityInfo.name}
          </h3>
          <p className="text-gray-600 mb-6">
            {stats.total > 0 
              ? 'Try adjusting your filters to see more results.'
              : `We're actively sourcing job opportunities in ${cityInfo.name} for you!`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAdditionalFilters({ experience: 'all', workMode: 'all', urgent: false })
                setActiveFilter('all')
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/search"
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Search All Jobs
            </Link>
          </div>
        </div>
      )}

      {/* Industry Insights */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Job Market Insights for {cityInfo.name}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Industries</h3>
            <div className="space-y-3">
              {cityInfo.industries.map((industry, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="font-medium">{industry}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Salary Range</h4>
              <div className="bg-success-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-success-600">{cityInfo.avgSalary}</div>
                <p className="text-sm text-success-700">Average salary for IT professionals</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Job Search</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { skill: 'React', path: `/location/${citySlug}/skills/react` },
                { skill: 'Python', path: `/location/${citySlug}/skills/python` },
                { skill: 'Java', path: `/location/${citySlug}/skills/java` },
                { skill: 'Node.js', path: `/location/${citySlug}/skills/nodejs` }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="group p-3 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors"
                >
                  <div className="font-medium text-gray-800 group-hover:text-accent-600">
                    {item.skill} Jobs
                  </div>
                  <div className="text-sm text-gray-500">In {cityInfo.name}</div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  `${cityInfo.name} IT Jobs`,
                  `${cityInfo.name} Remote Jobs`,
                  `${cityInfo.name} Fresher Jobs`,
                  `${cityInfo.name} Senior Jobs`
                ].map((search, index) => (
                  <Link
                    key={index}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Cities */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Jobs in Other Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(cityMap)
            .filter(([slug]) => slug !== citySlug)
            .slice(0, 6)
            .map(([slug, city]) => (
              <Link
                key={slug}
                href={`/location/${slug}`}
                className="group p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {city.icon}
                </div>
                <div className="font-medium text-gray-800 group-hover:text-primary-600 text-sm">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{city.state}</div>
              </Link>
            ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">
          Complete Guide to Finding Jobs in {cityInfo.name}
        </h2>
        
        <div className="prose prose-gray max-w-none">
          <h3 className="text-lg font-semibold mb-4">
            Why {cityInfo.name} is Great for Your Career
          </h3>
          <p className="text-gray-600 mb-6">
            {cityInfo.name} offers exceptional career opportunities across {cityInfo.industries.join(', ')} sectors. 
            With {stats.total}+ active job openings and an average salary range of {cityInfo.avgSalary}, 
            it's an ideal destination for both freshers and experienced professionals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3 text-primary-600">Career Opportunities</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {stats.total}+ live job openings</li>
                <li>• {stats.remote} remote work opportunities</li>
                <li>• {stats.fresher} fresher-friendly positions</li>
                <li>• {stats.urgent} urgent hiring requirements</li>
                <li>• Top companies actively recruiting</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-success-600">Salary & Growth</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Average salary: {cityInfo.avgSalary}</li>
                <li>• Multiple career advancement paths</li>
                <li>• Competitive compensation packages</li>
                <li>• Performance-based increments</li>
                <li>• Industry-leading benefits</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Popular Job Categories in {cityInfo.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              'Software Development',
              'Data Science & Analytics',
              'Digital Marketing',
              'UI/UX Design',
              'Product Management',
              'Business Analysis',
              'DevOps & Cloud',
              'Quality Assurance'
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-primary text-white p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-2">Ready to Start Your Career in {cityInfo.name}?</h4>
            <p className="mb-4">
              Browse through {filteredJobs.length} carefully curated job opportunities and find your perfect match. 
              From startups to Fortune 500 companies, {cityInfo.name} has something for everyone.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/search?q=${cityInfo.name} jobs`}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Search All Jobs
              </Link>
              <Link
                href="/all-locations"
                className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Other Cities
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-yellow-800">🔧 Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>City:</strong> {cityInfo.name}</p>
            <p><strong>Expected ACF City Values:</strong> {cityInfo.acfCityValues.join(', ')}</p>
            <p><strong>Expected ACF State Values:</strong> {cityInfo.acfStateValues.join(', ')}</p>
            <p><strong>Total jobs loaded:</strong> {allJobs.length}</p>
            <p><strong>City-filtered jobs:</strong> {stats.total}</p>
            <p><strong>Final filtered jobs:</strong> {filteredJobs.length}</p>
            <p><strong>Search terms:</strong> {cityInfo.searchTerms.join(', ')}</p>
            <p><strong>Active filter:</strong> {activeFilter}</p>
            <p><strong>Additional filters:</strong> {JSON.stringify(additionalFilters)}</p>
            
            {filteredJobs.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-yellow-800">Sample Job with ACF Data</summary>
                <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify({
                    title: filteredJobs[0].title,
                    directACFFields: {
                      city: filteredJobs[0].city,
                      state: filteredJobs[0].state,
                      workMode: filteredJobs[0].workMode,
                      salaryMin: filteredJobs[0].salaryMin,
                      salaryMax: filteredJobs[0].salaryMax,
                      isUrgent: filteredJobs[0].isUrgent,
                      requiredSkills: filteredJobs[0].requiredSkills,
                      experienceLevel: filteredJobs[0].experienceLevel
                    },
                    extractedACF: extractACFData(filteredJobs[0])
                  }, null, 2)}
                </pre>
              </details>
            )}
            
            {allJobs.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-yellow-800">GraphQL Response Structure</summary>
                <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify({
                    sampleJob: {
                      id: allJobs[0].id,
                      title: allJobs[0].title,
                      city: allJobs[0].city,
                      state: allJobs[0].state,
                      workMode: allJobs[0].workMode,
                      salaryMin: allJobs[0].salaryMin,
                      salaryMax: allJobs[0].salaryMax,
                      isUrgent: allJobs[0].isUrgent,
                      requiredSkills: allJobs[0].requiredSkills,
                      experienceLevel: allJobs[0].experienceLevel
                    },
                    fieldsAvailable: {
                      hasCity: !!allJobs[0].city,
                      hasState: !!allJobs[0].state,
                      hasWorkMode: !!allJobs[0].workMode,
                      hasSalaryMin: !!allJobs[0].salaryMin,
                      hasIsUrgent: !!allJobs[0].isUrgent,
                      hasRequiredSkills: !!allJobs[0].requiredSkills,
                      hasExperienceLevel: !!allJobs[0].experienceLevel
                    }
                  }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  )
}