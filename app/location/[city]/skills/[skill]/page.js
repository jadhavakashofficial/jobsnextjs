'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { graphqlRequest } from '../../../../../lib/apollo'
import JobCard from '../../../../../components/JobCard'

// City mapping (consistent with all-locations page)
const cityMap = {
  'mumbai': { name: 'Mumbai', state: 'Maharashtra', icon: '🏙️', searchTerms: ['mumbai', 'bombay', 'Maharashtra'] },
  'bangalore': { name: 'Bangalore', state: 'Karnataka', icon: '🌆', searchTerms: ['bangalore', 'bengaluru', 'Karnataka'] },
  'delhi': { name: 'Delhi', state: 'Delhi', icon: '🏛️', searchTerms: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'noida'] },
  'pune': { name: 'Pune', state: 'Maharashtra', icon: '🏘️', searchTerms: ['pune', 'Maharashtra'] },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana', icon: '🏗️', searchTerms: ['hyderabad', 'cyberabad', 'Telangana'] },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu', icon: '🌴', searchTerms: ['chennai', 'madras', 'Tamil Nadu'] },
  'kolkata': { name: 'Kolkata', state: 'West Bengal', icon: '🏛️', searchTerms: ['kolkata', 'calcutta', 'West Bengal'] },
  'ahmedabad': { name: 'Ahmedabad', state: 'Gujarat', icon: '🏭', searchTerms: ['ahmedabad', 'Gujarat'] },
  'jaipur': { name: 'Jaipur', state: 'Rajasthan', icon: '🏰', searchTerms: ['jaipur', 'Rajasthan'] },
  'lucknow': { name: 'Lucknow', state: 'Uttar Pradesh', icon: '🏛️', searchTerms: ['lucknow', 'Uttar Pradesh'] },
  'kochi': { name: 'Kochi', state: 'Kerala', icon: '🌊', searchTerms: ['kochi', 'cochin', 'Kerala'] },
  'indore': { name: 'Indore', state: 'Madhya Pradesh', icon: '🏭', searchTerms: ['indore', 'Madhya Pradesh'] },
  'remote': { name: 'Remote', state: 'Work from Anywhere', icon: '💻', searchTerms: ['remote', 'work from home', 'wfh', 'online'] }
}

// Skill mapping (consistent with all-skills page)
const skillMap = {
  'react': { name: 'React.js', category: 'Frontend Development', icon: '⚛️', searchTerms: ['react', 'reactjs', 'react.js'] },
  'javascript': { name: 'JavaScript', category: 'Programming', icon: '🟨', searchTerms: ['javascript', 'js', 'es6'] },
  'python': { name: 'Python', category: 'Programming', icon: '🐍', searchTerms: ['python', 'django', 'flask'] },
  'java': { name: 'Java', category: 'Programming', icon: '☕', searchTerms: ['java', 'spring', 'hibernate'] },
  'nodejs': { name: 'Node.js', category: 'Backend Development', icon: '🟢', searchTerms: ['nodejs', 'node.js', 'node'] },
  'angular': { name: 'Angular', category: 'Frontend Development', icon: '🔺', searchTerms: ['angular', 'angularjs'] },
  'vue': { name: 'Vue.js', category: 'Frontend Development', icon: '💚', searchTerms: ['vue', 'vuejs', 'vue.js'] },
  'php': { name: 'PHP', category: 'Backend Development', icon: '🐘', searchTerms: ['php', 'laravel', 'codeigniter'] },
  'machine-learning': { name: 'Machine Learning', category: 'Data & AI', icon: '🤖', searchTerms: ['machine learning', 'ml', 'ai'] },
  'data-science': { name: 'Data Science', category: 'Data & AI', icon: '📊', searchTerms: ['data science', 'data scientist', 'analytics'] },
  'mysql': { name: 'MySQL', category: 'Database', icon: '🗄️', searchTerms: ['mysql', 'sql', 'database'] },
  'mongodb': { name: 'MongoDB', category: 'Database', icon: '🍃', searchTerms: ['mongodb', 'mongo', 'nosql'] },
  'aws': { name: 'AWS', category: 'Cloud & DevOps', icon: '☁️', searchTerms: ['aws', 'amazon web services', 'cloud'] },
  'docker': { name: 'Docker', category: 'Cloud & DevOps', icon: '🐳', searchTerms: ['docker', 'containerization', 'devops'] },
  'kubernetes': { name: 'Kubernetes', category: 'Cloud & DevOps', icon: '⚙️', searchTerms: ['kubernetes', 'k8s', 'orchestration'] },
  'ui-ux': { name: 'UI/UX Design', category: 'Design & Marketing', icon: '🎨', searchTerms: ['ui', 'ux', 'design', 'figma'] },
  'digital-marketing': { name: 'Digital Marketing', category: 'Design & Marketing', icon: '📱', searchTerms: ['digital marketing', 'marketing', 'seo'] },
  'android': { name: 'Android Development', category: 'Mobile Development', icon: '🤖', searchTerms: ['android', 'kotlin', 'mobile'] },
  'ios': { name: 'iOS Development', category: 'Mobile Development', icon: '📱', searchTerms: ['ios', 'swift', 'iphone'] },
  'flutter': { name: 'Flutter', category: 'Mobile Development', icon: '🦋', searchTerms: ['flutter', 'dart', 'cross platform'] }
}

// GraphQL query to get jobs
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
        customFields
      }
    }
  }
`

// Helper function to parse custom fields
const parseCustomFields = (customFieldsString) => {
  if (!customFieldsString) return {}
  
  try {
    if (typeof customFieldsString === 'object') {
      return customFieldsString
    }
    
    if (typeof customFieldsString === 'string') {
      return JSON.parse(customFieldsString)
    }
    
    return {}
  } catch (error) {
    return {}
  }
}

// Filter jobs by both city and skill
const filterJobsByCityAndSkill = (jobs, cityInfo, skillInfo) => {
  if (!jobs || !cityInfo || !skillInfo) return []
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      const skills = (customFields.requiredSkills || customFields.skills || '').toLowerCase()
      
      // Check city match
      const jobCity = (customFields.city || '').toLowerCase()
      const jobState = (customFields.state || '').toLowerCase()
      
      const cityMatch = cityInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return jobCity.includes(searchTerm) || 
               jobState.includes(searchTerm) ||
               title.includes(searchTerm) || 
               excerpt.includes(searchTerm)
      })
      
      // Check skill match
      const skillMatch = skillInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return skills.includes(searchTerm) || 
               title.includes(searchTerm) || 
               excerpt.includes(searchTerm)
      })
      
      return cityMatch && skillMatch
    } catch (error) {
      return false
    }
  })
}

export default function LocationSkillJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [mounted, setMounted] = useState(false)

  const citySlug = params?.city
  const skillSlug = params?.skill
  const cityInfo = cityMap[citySlug]
  const skillInfo = skillMap[skillSlug]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !cityInfo || !skillInfo) return

    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let allJobsData = []
        
        // Search for jobs using multiple strategies
        const searchTerms = [
          ...cityInfo.searchTerms,
          ...skillInfo.searchTerms,
          `${cityInfo.name} ${skillInfo.name}`,
          `${skillInfo.name} ${cityInfo.name}`
        ]
        
        // Execute multiple searches
        for (const searchTerm of searchTerms.slice(0, 5)) { // Limit to 5 searches
          try {
            const result = await graphqlRequest(GET_JOBS_BY_SEARCH, {
              searchTerm: searchTerm
            })
            
            if (result?.posts?.nodes) {
              allJobsData = [...allJobsData, ...result.posts.nodes]
            }
          } catch (err) {
            console.warn(`Search for "${searchTerm}" failed:`, err.message)
          }
        }
        
        // Remove duplicates
        const uniqueJobs = []
        const seenIds = new Set()
        allJobsData.forEach(job => {
          if (!seenIds.has(job.id)) {
            seenIds.add(job.id)
            uniqueJobs.push(job)
          }
        })
        
        setAllJobs(uniqueJobs)
        
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs. Please try again.')
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [mounted, citySlug, skillSlug, cityInfo, skillInfo])

  // Filter jobs by both city and skill
  useEffect(() => {
    if (!allJobs.length || !cityInfo || !skillInfo) {
      setFilteredJobs([])
      return
    }

    const filtered = filterJobsByCityAndSkill(allJobs, cityInfo, skillInfo)
    setFilteredJobs(filtered)
  }, [allJobs, cityInfo, skillInfo])

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

  // City or skill not found
  if (!cityInfo || !skillInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">
            {!cityInfo && `City "${citySlug}" not found.`}
            {!skillInfo && `Skill "${skillSlug}" not found.`}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/all-locations" className="bg-primary-600 text-white px-6 py-3 rounded-lg">
              Browse Cities
            </Link>
            <Link href="/all-skills" className="bg-accent-600 text-white px-6 py-3 rounded-lg">
              Browse Skills
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-sunset text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{skillInfo.icon}</div>
            <div className="text-4xl">{cityInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {skillInfo.name} Jobs in {cityInfo.name}
              </h1>
              <p className="text-lg opacity-90">
                {skillInfo.category} • {cityInfo.state}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {loading ? 'Loading...' : `${filteredJobs.length} opportunities`} available
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/all-locations" className="hover:text-primary-600">All Cities</Link>
          <span className="mx-2">/</span>
          <Link href={`/location/${citySlug}`} className="hover:text-primary-600">{cityInfo.name} Jobs</Link>
          <span className="mx-2">/</span>
          <Link href={`/skills/${skillSlug}`} className="hover:text-primary-600">{skillInfo.name} Jobs</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{skillInfo.name} in {cityInfo.name}</span>
        </nav>

        {/* Quick Stats */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">{filteredJobs.length}</div>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">
                {filteredJobs.filter(job => {
                  const customFields = parseCustomFields(job.customFields)
                  return (customFields.workMode || '').toLowerCase().includes('remote')
                }).length}
              </div>
              <p className="text-sm text-gray-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">
                {filteredJobs.filter(job => {
                  const customFields = parseCustomFields(job.customFields)
                  return customFields.isUrgent === '1' || customFields.isUrgent === true
                }).length}
              </div>
              <p className="text-sm text-gray-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {filteredJobs.filter(job => {
                  const customFields = parseCustomFields(job.customFields)
                  return (customFields.experienceLevel || '').toLowerCase().includes('fresher')
                }).length}
              </div>
              <p className="text-sm text-gray-600">Fresher Jobs</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Finding {skillInfo.name} jobs in {cityInfo.name}...
          </p>
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
              {filteredJobs.length} {skillInfo.name} Job{filteredJobs.length !== 1 ? 's' : ''} in {cityInfo.name}
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
          <div className="text-6xl mb-4">{skillInfo.icon} {cityInfo.icon}</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            No {skillInfo.name} jobs found in {cityInfo.name}
          </h3>
          <p className="text-gray-600 mb-6">
            We're actively sourcing {skillInfo.name} opportunities in {cityInfo.name} for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/location/${citySlug}`}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              All Jobs in {cityInfo.name}
            </Link>
            <Link
              href={`/skills/${skillSlug}`}
              className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
            >
              All {skillInfo.name} Jobs
            </Link>
          </div>
        </div>
      )}

      {/* Related Opportunities */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Related Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Other Skills in Same City */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Other Skills in {cityInfo.name}</h3>
            <div className="space-y-2">
              {Object.entries(skillMap)
                .filter(([slug]) => slug !== skillSlug)
                .slice(0, 5)
                .map(([slug, skill]) => (
                  <Link
                    key={slug}
                    href={`/location/${citySlug}/skills/${slug}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium">{skill.name} Jobs in {cityInfo.name}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Same Skill in Other Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{skillInfo.name} Jobs in Other Cities</h3>
            <div className="space-y-2">
              {Object.entries(cityMap)
                .filter(([slug]) => slug !== citySlug)
                .slice(0, 5)
                .map(([slug, city]) => (
                  <Link
                    key={slug}
                    href={`/location/${slug}/skills/${skillSlug}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{city.icon}</span>
                      <span className="font-medium">{skillInfo.name} Jobs in {city.name}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {skillInfo.name} Jobs in {cityInfo.name} - Complete Guide
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            {cityInfo.name} offers excellent opportunities for {skillInfo.name} developers and professionals. 
            With {filteredJobs.length} active job openings, the city provides a robust tech ecosystem 
            for {skillInfo.category} specialists.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Why {cityInfo.name} for {skillInfo.name}?</h4>
              <ul className="space-y-1">
                <li>• Growing tech ecosystem</li>
                <li>• Competitive salary packages</li>
                <li>• Major companies hiring</li>
                <li>• Career growth opportunities</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Job Market Insights</h4>
              <ul className="space-y-1">
                <li>• {filteredJobs.length} active openings</li>
                <li>• Multiple experience levels</li>
                <li>• Remote work options available</li>
                <li>• Diverse company sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}