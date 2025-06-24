'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest, GET_JOBS_BY_SALARY_RANGE } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// Salary range mapping for SEO-friendly URLs
const salaryRangeMap = {
  '0-3-lpa': { 
    min: 0, 
    max: 3, 
    name: '0-3 LPA', 
    description: 'Entry-level positions perfect for freshers and new graduates',
    icon: '🌱'
  },
  '3-5-lpa': { 
    min: 3, 
    max: 5, 
    name: '3-5 LPA', 
    description: 'Mid-level opportunities for professionals with 1-2 years experience',
    icon: '📈'
  },
  '5-8-lpa': { 
    min: 5, 
    max: 8, 
    name: '5-8 LPA', 
    description: 'Senior positions for experienced professionals',
    icon: '💼'
  },
  '8-12-lpa': { 
    min: 8, 
    max: 12, 
    name: '8-12 LPA', 
    description: 'High-paying roles for senior developers and specialists',
    icon: '🚀'
  },
  '12-plus-lpa': { 
    min: 12, 
    max: 100, 
    name: '12+ LPA', 
    description: 'Premium positions for team leads and architects',
    icon: '💎'
  }
}

export default function SalaryRangeJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    location: 'all',
    experienceLevel: 'all',
    skills: 'all'
  })

  const rangeSlug = params?.range
  const salaryInfo = salaryRangeMap[rangeSlug]

  useEffect(() => {
    const fetchSalaryJobs = async () => {
      if (!salaryInfo) {
        setError('Salary range not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const result = await graphqlRequest(GET_JOBS_BY_SALARY_RANGE, { 
          minSalary: salaryInfo.min,
          maxSalary: salaryInfo.max,
          first: 50
        })
        
        setData(result)
      } catch (err) {
        console.error('Error fetching salary range jobs:', err)
        setError('Failed to load jobs for this salary range. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSalaryJobs()
  }, [rangeSlug, salaryInfo])

  // Filter jobs based on selected filters
  const getFilteredJobs = () => {
    if (!data?.posts?.nodes) return []
    
    return data.posts.nodes.filter(job => {
      const customFields = job.customFields || {}
      
      // Location filter
      if (filters.location !== 'all' && customFields.city !== filters.location) {
        return false
      }
      
      // Experience Level filter
      if (filters.experienceLevel !== 'all' && customFields.experienceLevel !== filters.experienceLevel) {
        return false
      }
      
      // Skills filter
      if (filters.skills !== 'all') {
        const jobSkills = customFields.requiredSkills || ''
        if (!jobSkills.toLowerCase().includes(filters.skills.toLowerCase())) {
          return false
        }
      }
      
      return true
    })
  }

  const filteredJobs = getFilteredJobs()

  // Get unique locations and skills from jobs
  const getUniqueValues = (field) => {
    if (!data?.posts?.nodes) return []
    const values = data.posts.nodes
      .map(job => job.customFields?.[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return values.sort()
  }

  const uniqueLocations = getUniqueValues('city')
  const popularSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'Angular']

  if (!salaryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salary Range Not Found</h1>
          <p className="text-neutral-600">The salary range you're looking for doesn't exist.</p>
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

        {/* Salary Insights */}
        {!loading && data?.posts?.nodes && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">{data.posts.nodes.length}</div>
              <p className="text-sm text-neutral-600">Total Positions</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">
                {data.posts.nodes.filter(job => job.customFields?.workMode === 'Remote').length}
              </div>
              <p className="text-sm text-neutral-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {data.posts.nodes.filter(job => job.customFields?.isUrgent === '1').length}
              </div>
              <p className="text-sm text-neutral-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">
                {uniqueLocations.length}
              </div>
              <p className="text-sm text-neutral-600">Cities Available</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && data?.posts?.nodes && data.posts.nodes.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filter {salaryInfo.name} Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Skills
                </label>
                <select
                  value={filters.skills}
                  onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
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
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found in {salaryInfo.name} Range
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
          <div className="text-6xl mb-4">{salaryInfo.icon}</div>
          <h3 className="text-2xl font-bold text-neutral-700 mb-4">
            No jobs found in {salaryInfo.name} range
          </h3>
          <p className="text-neutral-600 mb-6">
            {data?.posts?.nodes?.length > 0 
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
                  : 'bg-neutral-50 hover:bg-success-50 border-neutral-200 hover:border-success-200'
              }`}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {range.icon}
              </div>
              <h3 className="font-medium text-neutral-800 group-hover:text-success-700">
                {range.name}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      {!loading && (
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            About {salaryInfo.name} Jobs in India
          </h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-4">
              Jobs in the {salaryInfo.name} salary range represent {salaryInfo.description.toLowerCase()}. 
              These positions are available across major cities in India including Mumbai, Bangalore, 
              Delhi, Pune, and Hyderabad.
            </p>
            
            <h3 className="text-lg font-semibold mb-3">What to Expect in {salaryInfo.name} Range:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
              <div>
                <strong>• Competitive Benefits:</strong> Health insurance, PF, bonuses
              </div>
              <div>
                <strong>• Growth Opportunities:</strong> Skill development programs
              </div>
              <div>
                <strong>• Work Flexibility:</strong> Remote and hybrid options
              </div>
              <div>
                <strong>• Industry Exposure:</strong> Work with leading technologies
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 mt-6">
              Popular Skills for {salaryInfo.name} Range:
            </h3>
            <p className="text-sm text-neutral-600">
              Common technical skills in this salary range include programming languages like 
              Python, Java, JavaScript, frameworks like React and Angular, and technologies 
              like AWS, Docker, and various databases.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}