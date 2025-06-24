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
    acfValue: 'Mumbai', // Must match your ACF Select field options
    state: 'Maharashtra',
    stateAcfValue: 'Maharashtra',
    icon: '🏙️',
    description: 'India\'s financial capital and business hub',
    industries: ['Finance', 'IT', 'Entertainment', 'Manufacturing'],
    avgSalary: '₹8-15 LPA',
    searchTerms: ['mumbai', 'bombay'],
    seoTitle: 'Jobs in Mumbai - Latest IT & Finance Opportunities | Classic Jobs',
    metaDescription: 'Find 500+ jobs in Mumbai. IT, Finance, and Business opportunities in India\'s financial capital. Apply to top companies now!'
  },
  'bangalore': { 
    name: 'Bangalore', 
    acfValue: 'Bangalore', // Or 'Bengaluru' - check your ACF options
    state: 'Karnataka',
    stateAcfValue: 'Karnataka',
    icon: '🌆',
    description: 'India\'s Silicon Valley and IT capital',
    industries: ['IT', 'Startups', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹6-18 LPA',
    searchTerms: ['bangalore', 'bengaluru'],
    seoTitle: 'Jobs in Bangalore - IT & Tech Career Opportunities | Classic Jobs',
    metaDescription: 'Discover 450+ IT jobs in Bangalore. Software development, data science, and tech startup opportunities in India\'s Silicon Valley.'
  },
  'delhi': { 
    name: 'Delhi', 
    acfValue: 'Delhi', // Or 'New Delhi' - check your ACF options
    state: 'Delhi',
    stateAcfValue: 'Delhi',
    icon: '🏛️',
    description: 'India\'s capital and government hub',
    industries: ['Government', 'IT', 'Education', 'Healthcare'],
    avgSalary: '₹5-12 LPA',
    searchTerms: ['delhi', 'new delhi', 'ncr'],
    seoTitle: 'Jobs in Delhi NCR - Government & IT Opportunities | Classic Jobs',
    metaDescription: 'Find 400+ jobs in Delhi NCR. Government, IT, and corporate opportunities in India\'s capital region.'
  },
  'pune': { 
    name: 'Pune', 
    acfValue: 'Pune',
    state: 'Maharashtra',
    stateAcfValue: 'Maharashtra',
    icon: '🏘️',
    description: 'IT hub and educational center of Maharashtra',
    industries: ['IT', 'Automotive', 'Education', 'Manufacturing'],
    avgSalary: '₹5-14 LPA',
    searchTerms: ['pune'],
    seoTitle: 'Jobs in Pune - IT & Engineering Career Opportunities | Classic Jobs',
    metaDescription: 'Explore 350+ IT and engineering jobs in Pune. Top opportunities in software development and automotive sectors.'
  },
  'hyderabad': { 
    name: 'Hyderabad', 
    acfValue: 'Hyderabad',
    state: 'Telangana',
    stateAcfValue: 'Telangana',
    icon: '🏗️',
    description: 'Cyberabad - IT and pharmaceutical hub',
    industries: ['IT', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹5-15 LPA',
    searchTerms: ['hyderabad', 'cyberabad'],
    seoTitle: 'Jobs in Hyderabad - IT & Pharma Career Opportunities | Classic Jobs',
    metaDescription: 'Find 300+ IT and pharmaceutical jobs in Hyderabad. Microsoft, Google, and pharma giants are hiring.'
  },
  'chennai': { 
    name: 'Chennai', 
    acfValue: 'Chennai',
    state: 'Tamil Nadu',
    stateAcfValue: 'Tamil Nadu',
    icon: '🌴',
    description: 'Detroit of India and IT services hub',
    industries: ['Automotive', 'IT', 'Healthcare', 'Manufacturing'],
    avgSalary: '₹4-12 LPA',
    searchTerms: ['chennai', 'madras'],
    seoTitle: 'Jobs in Chennai - Automotive & IT Career Opportunities | Classic Jobs',
    metaDescription: 'Discover 250+ automotive and IT jobs in Chennai. Manufacturing and software services opportunities.'
  },
  'remote': { 
    name: 'Remote', 
    acfValue: 'Remote', // Or 'Work from Home' - check your ACF options
    state: 'Work from Anywhere',
    stateAcfValue: 'Remote',
    icon: '💻',
    description: 'Work from anywhere in India',
    industries: ['IT', 'Digital Marketing', 'Content', 'Consulting'],
    avgSalary: '₹4-25 LPA',
    searchTerms: ['remote', 'work from home', 'wfh'],
    seoTitle: 'Remote Jobs India - Work from Home Opportunities | Classic Jobs',
    metaDescription: 'Find 300+ remote jobs in India. Work from home opportunities in IT, digital marketing, and consulting.'
  }
}

// Primary GraphQL query using your exact ACF field structure
const GET_JOBS_BY_CITY_ACF = `
  query GetJobsByCityACF($cityValue: String!, $stateValue: String!) {
    posts(
      first: 100,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          relation: OR,
          metaArray: [
            {
              key: "city",
              value: $cityValue,
              compare: EQUAL_TO
            },
            {
              key: "state", 
              value: $stateValue,
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
        # Your ACF field groups
        jobLocationWorkDetails {
          city
          state
          workMode
        }
        salaryJobSpecifics {
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
          companySize
        }
        skillsRequirements {
          requiredSkills
          experienceLevel
          educationRequired
        }
        # Fallback to customFields
        customFields
      }
    }
  }
`

// Secondary query using LIKE comparison
const GET_JOBS_BY_CITY_LIKE = `
  query GetJobsByCityLike($cityValue: String!) {
    posts(
      first: 100,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          relation: OR,
          metaArray: [
            {
              key: "city",
              value: $cityValue,
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
        jobLocationWorkDetails {
          city
          state
          workMode
        }
        salaryJobSpecifics {
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
          companySize
        }
        skillsRequirements {
          requiredSkills
          experienceLevel
          educationRequired
        }
        customFields
      }
    }
  }
`

// Fallback search query
const GET_JOBS_BY_SEARCH = `
  query GetJobsBySearch($searchTerm: String!) {
    posts(
      first: 50,
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
        jobLocationWorkDetails {
          city
          state
          workMode
        }
        salaryJobSpecifics {
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
          companySize
        }
        skillsRequirements {
          requiredSkills
          experienceLevel
          educationRequired
        }
        customFields
      }
    }
  }
`

// Helper function to extract ACF data from your field structure
const extractACFData = (post) => {
  const acfData = {}
  
  // Extract from your ACF field groups
  if (post.jobLocationWorkDetails) {
    acfData.city = post.jobLocationWorkDetails.city
    acfData.state = post.jobLocationWorkDetails.state
    acfData.workMode = post.jobLocationWorkDetails.workMode
  }
  
  if (post.salaryJobSpecifics) {
    acfData.salaryMin = post.salaryJobSpecifics.salaryMin
    acfData.salaryMax = post.salaryJobSpecifics.salaryMax
    acfData.isUrgent = post.salaryJobSpecifics.isUrgent
    acfData.applicationDeadline = post.salaryJobSpecifics.applicationDeadline
    acfData.companySize = post.salaryJobSpecifics.companySize
  }
  
  if (post.skillsRequirements) {
    acfData.requiredSkills = post.skillsRequirements.requiredSkills
    acfData.experienceLevel = post.skillsRequirements.experienceLevel
    acfData.educationRequired = post.skillsRequirements.educationRequired
  }
  
  // Fallback to customFields parsing if ACF groups not available
  if (Object.keys(acfData).length === 0 && post.customFields) {
    try {
      const parsed = typeof post.customFields === 'string' 
        ? JSON.parse(post.customFields) 
        : post.customFields
      
      return {
        city: parsed.city,
        state: parsed.state,
        workMode: parsed.work_mode,
        salaryMin: parsed.salary_min,
        salaryMax: parsed.salary_max,
        isUrgent: parsed.is_urgent,
        applicationDeadline: parsed.application_deadline,
        companySize: parsed.company_size,
        requiredSkills: parsed.required_skills,
        experienceLevel: parsed.experience_level,
        educationRequired: parsed.education_required
      }
    } catch (error) {
      console.warn('Failed to parse customFields:', error)
      return {}
    }
  }
  
  return acfData
}

// Filter jobs by city using ACF data
const filterJobsByCity = (jobs, cityInfo) => {
  if (!jobs || !cityInfo) return []
  
  return jobs.filter(job => {
    const acfData = extractACFData(job)
    const title = (job.title || '').toLowerCase()
    const excerpt = (job.excerpt || '').toLowerCase()
    
    // Check ACF city and state fields
    const jobCity = (acfData.city || '').toLowerCase()
    const jobState = (acfData.state || '').toLowerCase()
    
    // Exact match with ACF values
    if (jobCity === cityInfo.acfValue.toLowerCase()) return true
    if (jobState === cityInfo.stateAcfValue.toLowerCase()) return true
    
    // Partial match in ACF fields
    if (jobCity.includes(cityInfo.acfValue.toLowerCase())) return true
    
    // Search terms in ACF fields
    const acfSearchMatch = cityInfo.searchTerms.some(term => 
      jobCity.includes(term.toLowerCase()) || 
      jobState.includes(term.toLowerCase())
    )
    if (acfSearchMatch) return true
    
    // Fallback: search in title and excerpt
    const titleExcerptMatch = cityInfo.searchTerms.some(term => 
      title.includes(term.toLowerCase()) || 
      excerpt.includes(term.toLowerCase())
    )
    
    return titleExcerptMatch
  })
}

export default function LocationCityPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [filters, setFilters] = useState({
    experience: 'all',
    salary: 'all',
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
        
        let allJobs = []
        
        // Strategy 1: Primary ACF meta query (exact match)
        try {
          console.log('🎯 Trying ACF meta query for:', cityInfo.acfValue)
          const acfResult = await graphqlRequest(GET_JOBS_BY_CITY_ACF, {
            cityValue: cityInfo.acfValue,
            stateValue: cityInfo.stateAcfValue
          })
          
          if (acfResult?.posts?.nodes) {
            allJobs = [...allJobs, ...acfResult.posts.nodes]
            console.log('✅ ACF meta query returned:', acfResult.posts.nodes.length, 'jobs')
          }
        } catch (err) {
          console.warn('❌ ACF meta query failed:', err.message)
        }
        
        // Strategy 2: ACF meta query with LIKE comparison
        try {
          console.log('🔍 Trying ACF LIKE query for:', cityInfo.acfValue)
          const likeResult = await graphqlRequest(GET_JOBS_BY_CITY_LIKE, {
            cityValue: cityInfo.acfValue
          })
          
          if (likeResult?.posts?.nodes) {
            allJobs = [...allJobs, ...likeResult.posts.nodes]
            console.log('✅ ACF LIKE query returned:', likeResult.posts.nodes.length, 'jobs')
          }
        } catch (err) {
          console.warn('❌ ACF LIKE query failed:', err.message)
        }
        
        // Strategy 3: Fallback search queries
        try {
          console.log('🔎 Trying fallback search for:', cityInfo.searchTerms)
          const searchPromises = cityInfo.searchTerms.map(term => 
            graphqlRequest(GET_JOBS_BY_SEARCH, { searchTerm: term })
          )
          
          const searchResults = await Promise.all(searchPromises)
          searchResults.forEach(result => {
            if (result?.posts?.nodes) {
              allJobs = [...allJobs, ...result.posts.nodes]
            }
          })
          console.log('✅ Search queries completed')
        } catch (err) {
          console.warn('❌ Search fallback failed:', err.message)
        }
        
        // Remove duplicates and sort
        const uniqueJobs = []
        const seenIds = new Set()
        allJobs.forEach(job => {
          if (!seenIds.has(job.id)) {
            seenIds.add(job.id)
            uniqueJobs.push(job)
          }
        })
        
        uniqueJobs.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        console.log('📊 Total unique jobs found:', uniqueJobs.length)
        setJobs(uniqueJobs)
        
      } catch (err) {
        console.error('💥 Error fetching city jobs:', err)
        setError('Failed to load jobs for this city. Please try again.')
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchCityJobs()
  }, [mounted, citySlug, cityInfo])

  // Filter jobs based on city and additional filters
  useEffect(() => {
    if (!jobs.length || !cityInfo) {
      setFilteredJobs([])
      return
    }

    try {
      // First filter by city using ACF data
      let cityJobs = filterJobsByCity(jobs, cityInfo)
      
      // Apply additional filters
      let filtered = cityJobs
      
      // Active filter (tabs)
      if (activeFilter !== 'all') {
        filtered = filtered.filter(job => {
          const acfData = extractACFData(job)
          const title = (job.title || '').toLowerCase()
          
          switch(activeFilter) {
            case 'urgent':
              return acfData.isUrgent === true || 
                     acfData.isUrgent === '1' || 
                     title.includes('urgent')
            case 'remote':
              return (acfData.workMode || '').toLowerCase().includes('remote') ||
                     title.includes('remote')
            case 'fresher':
              return (acfData.experienceLevel || '').toLowerCase().includes('fresher') ||
                     title.includes('fresher')
            default:
              return true
          }
        })
      }
      
      // Experience filter
      if (filters.experience !== 'all') {
        filtered = filtered.filter(job => {
          const acfData = extractACFData(job)
          const jobExperience = (acfData.experienceLevel || '').toLowerCase()
          const title = (job.title || '').toLowerCase()
          
          return jobExperience.includes(filters.experience.toLowerCase()) ||
                 title.includes(filters.experience.toLowerCase())
        })
      }
      
      // Work mode filter
      if (filters.workMode !== 'all') {
        filtered = filtered.filter(job => {
          const acfData = extractACFData(job)
          const jobWorkMode = (acfData.workMode || '').toLowerCase()
          const title = (job.title || '').toLowerCase()
          
          return jobWorkMode.includes(filters.workMode.toLowerCase()) ||
                 title.includes(filters.workMode.toLowerCase())
        })
      }
      
      // Salary filter
      if (filters.salary !== 'all') {
        filtered = filtered.filter(job => {
          const acfData = extractACFData(job)
          const salaryMin = parseInt(acfData.salaryMin) || 0
          const title = (job.title || '').toLowerCase()
          
          switch(filters.salary) {
            case '0-3': return salaryMin <= 3 || title.includes('fresher')
            case '3-5': return (salaryMin >= 3 && salaryMin <= 5) || title.includes('junior')
            case '5-8': return (salaryMin >= 5 && salaryMin <= 8) || title.includes('senior')
            case '8+': return salaryMin >= 8 || title.includes('lead')
            default: return true
          }
        })
      }
      
      // Urgent filter
      if (filters.urgent) {
        filtered = filtered.filter(job => {
          const acfData = extractACFData(job)
          const title = (job.title || '').toLowerCase()
          
          return acfData.isUrgent === true || 
                 acfData.isUrgent === '1' || 
                 title.includes('urgent')
        })
      }
      
      setFilteredJobs(filtered)
      
    } catch (error) {
      console.error('Error filtering jobs:', error)
      setFilteredJobs([])
    }
  }, [jobs, cityInfo, filters, activeFilter])

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

  if (!cityInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-4">The city you're looking for doesn't exist in our database.</p>
          <Link
            href="/location"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Cities
          </Link>
        </div>
      </div>
    )
  }

  const cityJobs = filterJobsByCity(jobs, cityInfo)
  const stats = {
    total: cityJobs.length,
    urgent: cityJobs.filter(job => {
      const acfData = extractACFData(job)
      return acfData.isUrgent === true || (job.title || '').toLowerCase().includes('urgent')
    }).length,
    remote: cityJobs.filter(job => {
      const acfData = extractACFData(job)
      return (acfData.workMode || '').toLowerCase().includes('remote')
    }).length,
    fresher: cityJobs.filter(job => {
      const acfData = extractACFData(job)
      return (acfData.experienceLevel || '').toLowerCase().includes('fresher')
    }).length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO Header */}
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
          <Link href="/location" className="hover:text-primary-600">All Cities</Link>
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

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
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
                value={filters.workMode}
                onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value }))}
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
                value={filters.salary}
                onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Salaries</option>
                <option value="0-3">0-3 LPA</option>
                <option value="3-5">3-5 LPA</option>
                <option value="5-8">5-8 LPA</option>
                <option value="8+">8+ LPA</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ experience: 'all', salary: 'all', workMode: 'all', urgent: false })}
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
                setFilters({ experience: 'all', salary: 'all', workMode: 'all', urgent: false })
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
                { skill: 'React', count: Math.floor(stats.total * 0.3) },
                { skill: 'Python', count: Math.floor(stats.total * 0.25) },
                { skill: 'Java', count: Math.floor(stats.total * 0.2) },
                { skill: 'Node.js', count: Math.floor(stats.total * 0.15) }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={`/location/${citySlug}/skills/${item.skill.toLowerCase()}`}
                  className="group p-3 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors"
                >
                  <div className="font-medium text-gray-800 group-hover:text-accent-600">
                    {item.skill} Jobs
                  </div>
                  <div className="text-sm text-gray-500">{item.count}+ openings</div>
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
                href="/location"
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
            <p><strong>City:</strong> {cityInfo.name} (ACF: {cityInfo.acfValue})</p>
            <p><strong>State:</strong> {cityInfo.state} (ACF: {cityInfo.stateAcfValue})</p>
            <p><strong>Total jobs loaded:</strong> {jobs.length}</p>
            <p><strong>City-filtered jobs:</strong> {cityJobs.length}</p>
            <p><strong>Final filtered jobs:</strong> {filteredJobs.length}</p>
            <p><strong>Search terms:</strong> {cityInfo.searchTerms.join(', ')}</p>
            <p><strong>Active filter:</strong> {activeFilter}</p>
            <p><strong>Filters:</strong> {JSON.stringify(filters)}</p>
            
            {filteredJobs.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-yellow-800">Sample ACF Data</summary>
                <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(extractACFData(filteredJobs[0]), null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  )
}