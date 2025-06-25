'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { graphqlRequest, GET_ALL_JOBS, filterJobsByCity, calculateJobStats, parseCustomFields, applyMultipleFilters } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// Enhanced city mapping with comprehensive search terms
const cityMap = {
  'mumbai': { 
    name: 'Mumbai', 
    state: 'Maharashtra',
    icon: '🏙️',
    description: 'India\'s financial capital and business hub',
    industries: ['Finance', 'IT', 'Entertainment', 'Manufacturing'],
    avgSalary: '₹8-15 LPA',
    searchTerms: ['mumbai', 'bombay', 'maharashtra', 'mumbai city', 'greater mumbai'],
    category: 'metro',
    region: 'west',
    population: '20M+',
    companies: 'Google, Microsoft, HDFC, Reliance'
  },
  'bangalore': { 
    name: 'Bangalore', 
    state: 'Karnataka',
    icon: '🌆',
    description: 'India\'s Silicon Valley and IT capital',
    industries: ['IT', 'Startups', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹6-18 LPA',
    searchTerms: ['bangalore', 'bengaluru', 'karnataka', 'blr', 'silicon valley'],
    category: 'metro',
    region: 'south',
    population: '12M+',
    companies: 'Infosys, Wipro, Amazon, Flipkart'
  },
  'delhi': { 
    name: 'Delhi', 
    state: 'Delhi',
    icon: '🏛️',
    description: 'India\'s capital and government hub',
    industries: ['Government', 'IT', 'Education', 'Healthcare'],
    avgSalary: '₹5-12 LPA',
    searchTerms: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'noida', 'gurugram', 'faridabad'],
    category: 'metro',
    region: 'north',
    population: '32M+',
    companies: 'HCL, Tech Mahindra, Paytm, Ola'
  },
  'pune': { 
    name: 'Pune', 
    state: 'Maharashtra',
    icon: '🏘️',
    description: 'IT hub and educational center of Maharashtra',
    industries: ['IT', 'Automotive', 'Education', 'Manufacturing'],
    avgSalary: '₹5-14 LPA',
    searchTerms: ['pune', 'maharashtra', 'pune city', 'pimpri chinchwad'],
    category: 'tier1',
    region: 'west',
    population: '7M+',
    companies: 'TCS, Cognizant, Bajaj, Mahindra'
  },
  'hyderabad': { 
    name: 'Hyderabad', 
    state: 'Telangana',
    icon: '🏗️',
    description: 'Cyberabad - IT and pharmaceutical hub',
    industries: ['IT', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹5-15 LPA',
    searchTerms: ['hyderabad', 'cyberabad', 'telangana', 'secunderabad', 'hitech city'],
    category: 'metro',
    region: 'south',
    population: '10M+',
    companies: 'Microsoft, Google, Facebook, Dr. Reddy\'s'
  },
  'chennai': { 
    name: 'Chennai', 
    state: 'Tamil Nadu',
    icon: '🌴',
    description: 'Detroit of India and IT services hub',
    industries: ['Automotive', 'IT', 'Healthcare', 'Manufacturing'],
    avgSalary: '₹4-12 LPA',
    searchTerms: ['chennai', 'madras', 'tamil nadu', 'tn', 'chennai city'],
    category: 'metro',
    region: 'south',
    population: '11M+',
    companies: 'Ford, BMW, Zoho, Freshworks'
  },
  'kolkata': { 
    name: 'Kolkata', 
    state: 'West Bengal',
    icon: '🏛️',
    description: 'Cultural capital and emerging IT hub',
    industries: ['IT', 'Education', 'Healthcare', 'Finance'],
    avgSalary: '₹4-10 LPA',
    searchTerms: ['kolkata', 'calcutta', 'west bengal', 'wb', 'cal'],
    category: 'metro',
    region: 'east',
    population: '15M+',
    companies: 'TCS, Wipro, ITC, Coal India'
  },
  'remote': { 
    name: 'Remote', 
    state: 'Work from Anywhere',
    icon: '💻',
    description: 'Work from anywhere in India',
    industries: ['IT', 'Digital Marketing', 'Content', 'Consulting'],
    avgSalary: '₹4-25 LPA',
    searchTerms: ['remote', 'work from home', 'wfh', 'online', 'work from anywhere'],
    category: 'remote',
    region: 'all',
    population: 'Unlimited',
    companies: 'Global Tech Companies'
  }
}

// Calculate enhanced job statistics using the simple query approach
const calculateEnhancedStats = (jobs, cityInfo) => {
  const cityJobs = filterJobsByCity(jobs, cityInfo)
  
  const stats = {
    total: cityJobs.length,
    urgent: 0,
    remote: 0,
    fresher: 0,
    senior: 0,
    withSalary: 0,
    highSalary: 0
  }
  
  cityJobs.forEach(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      const content = [title, excerpt].join(' ')
      
      // Count urgent jobs
      if (customFields.isUrgent || content.includes('urgent') || content.includes('immediate')) {
        stats.urgent++
      }
      
      // Count remote jobs
      const workMode = (customFields.workMode || '').toLowerCase()
      if (workMode.includes('remote') || workMode.includes('wfh') ||
          content.includes('remote') || content.includes('wfh') || content.includes('work from home')) {
        stats.remote++
      }
      
      // Count fresher jobs
      const experienceLevel = (customFields.experienceLevel || '').toLowerCase()
      if (experienceLevel.includes('fresher') || experienceLevel.includes('0') ||
          content.includes('fresher') || content.includes('trainee') || content.includes('entry level')) {
        stats.fresher++
      }
      
      // Count senior jobs
      if (experienceLevel.includes('senior') || experienceLevel.includes('lead') ||
          content.includes('senior') || content.includes('lead') || content.includes('manager')) {
        stats.senior++
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
        } else if (content.match(/[8-9]\d*[_\s]*lpa|[1-9]\d[_\s]*lpa/i)) {
          stats.highSalary++
        }
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
    salary: 'all',
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
        
        console.log(`🎯 Fetching jobs for ${cityInfo.name} using simple query...`)
        
        const result = await graphqlRequest(GET_ALL_JOBS, { first: 300 })
        
        if (result?.posts?.nodes) {
          console.log(`✅ Successfully fetched ${result.posts.nodes.length} jobs`)
          setAllJobs(result.posts.nodes)
          
          // Test city filtering
          const cityJobs = filterJobsByCity(result.posts.nodes, cityInfo)
          console.log(`🏙️ Found ${cityJobs.length} jobs for ${cityInfo.name}`)
        } else {
          console.warn('⚠️ No jobs data received')
          setAllJobs([])
        }
        
      } catch (err) {
        console.error('💥 Error fetching jobs:', err)
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
      // Apply multiple filters using the enhanced filtering system
      const filterConfig = {
        cityInfo: cityInfo,
        experience: additionalFilters.experience,
        workMode: additionalFilters.workMode,
        urgentOnly: additionalFilters.urgent
      }
      
      // Add salary filter
      if (additionalFilters.salary !== 'all') {
        const salaryRanges = {
          '0-5': { min: 0, max: 5 },
          '5-10': { min: 5, max: 10 },
          '10-plus': { min: 10, max: 100 }
        }
        
        if (salaryRanges[additionalFilters.salary]) {
          filterConfig.salaryRange = {
            min: salaryRanges[additionalFilters.salary].min,
            max: salaryRanges[additionalFilters.salary].max,
            searchTerms: []
          }
        }
      }
      
      let filtered = applyMultipleFilters(allJobs, filterConfig)
      
      // Apply active filter (tabs)
      if (activeFilter !== 'all') {
        filtered = filtered.filter(job => {
          try {
            const customFields = parseCustomFields(job.customFields)
            const title = (job.title || '').toLowerCase()
            const content = [title, job.excerpt || ''].join(' ')
            
            switch(activeFilter) {
              case 'urgent':
                return customFields.isUrgent || content.includes('urgent') || content.includes('immediate')
              case 'remote':
                const workMode = (customFields.workMode || '').toLowerCase()
                return workMode.includes('remote') || 
                       content.includes('remote') || content.includes('wfh')
              case 'fresher':
                const experienceLevel = (customFields.experienceLevel || '').toLowerCase()
                return experienceLevel.includes('fresher') ||
                       content.includes('fresher') || content.includes('trainee')
              case 'high-salary':
                const minSal = parseFloat(customFields.salaryMin || 0)
                const maxSal = parseFloat(customFields.salaryMax || 0)
                return minSal >= 8 || maxSal >= 8 || content.match(/[8-9]\d*[_\s]*lpa|[1-9]\d[_\s]*lpa/i)
              default:
                return true
            }
          } catch {
            return false
          }
        })
      }
      
      setFilteredJobs(filtered)
      console.log(`🔍 Applied filters: ${allJobs.length} → ${filtered.length} jobs`)
      
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

  const stats = calculateEnhancedStats(allJobs, cityInfo)

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

        {/* Success Indicator */}
        {!loading && stats.total > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✅ Location Matching Active:</span>
              <span className="text-green-700">Found {stats.total} jobs in {cityInfo.name} using advanced filtering</span>
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.highSalary}</div>
              <p className="text-sm text-gray-600">High Salary (8+ LPA)</p>
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
              { key: 'fresher', label: '🌱 Fresher', count: stats.fresher },
              { key: 'high-salary', label: '💰 High Salary', count: stats.highSalary }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <select
                value={additionalFilters.salary}
                onChange={(e) => setAdditionalFilters(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Salaries</option>
                <option value="0-5">0-5 LPA</option>
                <option value="5-10">5-10 LPA</option>
                <option value="10-plus">10+ LPA</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setAdditionalFilters({ experience: 'all', workMode: 'all', salary: 'all', urgent: false })
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
          <p className="text-sm text-gray-500 mt-2">Searching through job listings...</p>
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
                setAdditionalFilters({ experience: 'all', workMode: 'all', salary: 'all', urgent: false })
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
            <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-sm text-blue-700">Total Jobs</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{stats.remote}</div>
                <p className="text-sm text-green-700">Remote Options</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
                <p className="text-sm text-orange-700">Urgent Hiring</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.highSalary}</div>
                <p className="text-sm text-purple-700">High Salary</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  href={`/search?q=${cityInfo.name} IT jobs`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  🔍 Search IT jobs in {cityInfo.name}
                </Link>
                <Link
                  href={`/search?q=${cityInfo.name} remote jobs`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors"
                >
                  💻 Remote jobs in {cityInfo.name}
                </Link>
                <Link
                  href={`/search?q=${cityInfo.name} fresher jobs`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-success-50 transition-colors"
                >
                  🌱 Fresher jobs in {cityInfo.name}
                </Link>
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
                <li>• {stats.highSalary} high-paying positions (8+ LPA)</li>
                <li>• Multiple career advancement paths</li>
                <li>• Competitive compensation packages</li>
                <li>• Performance-based increments</li>
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
    </div>
  )
}