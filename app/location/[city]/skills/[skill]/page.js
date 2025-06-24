'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../../../lib/apollo'
import JobCard from '../../../../../components/JobCard'

// City and skill mappings (reuse from previous components)
const cityMap = {
  'mumbai': { name: 'Mumbai', state: 'Maharashtra' },
  'delhi': { name: 'Delhi', state: 'Delhi' },
  'bangalore': { name: 'Bangalore', state: 'Karnataka' },
  'pune': { name: 'Pune', state: 'Maharashtra' },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana' },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu' },
  'remote': { name: 'Remote', state: 'Work from Anywhere' }
}

const skillMap = {
  'react': { name: 'React.js', category: 'Frontend Development', icon: '⚛️' },
  'javascript': { name: 'JavaScript', category: 'Programming', icon: '🟨' },
  'python': { name: 'Python', category: 'Programming', icon: '🐍' },
  'java': { name: 'Java', category: 'Programming', icon: '☕' },
  'nodejs': { name: 'Node.js', category: 'Backend Development', icon: '🟢' },
  'angular': { name: 'Angular', category: 'Frontend Development', icon: '🔺' }
}

// Combined GraphQL query
const GET_LOCATION_SKILL_JOBS = `
  query GetLocationSkillJobs($city: String!, $skill: String!, $first: Int = 50) {
    posts(
      first: $first,
      where: {
        orderby: {field: DATE, order: DESC},
        metaQuery: {
          relation: AND,
          metaArray: [
            {
              key: "city",
              value: $city,
              compare: EQUAL_TO
            },
            {
              key: "required_skills",
              value: $skill,
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
        customFields {
          city
          state
          workMode
          requiredSkills
          experienceLevel
          salaryMin
          salaryMax
          isUrgent
          applicationDeadline
        }
      }
    }
  }
`

export default function LocationSkillJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const citySlug = params?.city
  const skillSlug = params?.skill
  const cityInfo = cityMap[citySlug]
  const skillInfo = skillMap[skillSlug]

  useEffect(() => {
    const fetchLocationSkillJobs = async () => {
      if (!cityInfo || !skillInfo) {
        setError('Location or skill not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const result = await graphqlRequest(GET_LOCATION_SKILL_JOBS, { 
          city: cityInfo.name,
          skill: skillInfo.name,
          first: 50
        })
        
        setData(result)
      } catch (err) {
        console.error('Error fetching location+skill jobs:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchLocationSkillJobs()
  }, [citySlug, skillSlug, cityInfo, skillInfo])

  if (!cityInfo || !skillInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-neutral-600">The location or skill you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const jobs = data?.posts?.nodes || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-sunset text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{skillInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {skillInfo.name} Jobs in {cityInfo.name}
              </h1>
              <p className="text-lg opacity-90">
                {skillInfo.category} • {cityInfo.state}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {loading ? '...' : `${jobs.length} opportunities`} available
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-neutral-600 mb-6">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span className="mx-2">/</span>
          <a href={`/location/${citySlug}`} className="hover:text-primary-600">{cityInfo.name} Jobs</a>
          <span className="mx-2">/</span>
          <a href={`/skills/${skillSlug}`} className="hover:text-primary-600">{skillInfo.name} Jobs</a>
          <span className="mx-2">/</span>
          <span className="text-neutral-800">{skillInfo.name} in {cityInfo.name}</span>
        </nav>

        {/* Quick Stats */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-primary-600">{jobs.length}</div>
              <p className="text-sm text-neutral-600">Total Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">
                {jobs.filter(job => job.customFields?.workMode === 'Remote').length}
              </div>
              <p className="text-sm text-neutral-600">Remote Options</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-warning-600">
                {jobs.filter(job => job.customFields?.isUrgent === '1').length}
              </div>
              <p className="text-sm text-neutral-600">Urgent Hiring</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">
                {jobs.filter(job => job.customFields?.experienceLevel === 'Fresher').length}
              </div>
              <p className="text-sm text-neutral-600">Fresher Jobs</p>
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
      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {jobs.length} {skillInfo.name} Job{jobs.length !== 1 ? 's' : ''} in {cityInfo.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{skillInfo.icon}</div>
          <h3 className="text-2xl font-bold text-neutral-700 mb-4">
            No {skillInfo.name} jobs found in {cityInfo.name}
          </h3>
          <p className="text-neutral-600 mb-6">
            We're actively sourcing {skillInfo.name} opportunities in {cityInfo.name} for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/location/${citySlug}`}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              All Jobs in {cityInfo.name}
            </a>
            <a
              href={`/skills/${skillSlug}`}
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              All {skillInfo.name} Jobs
            </a>
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
                .slice(0, 4)
                .map(([slug, skill]) => (
                  <a
                    key={slug}
                    href={`/location/${citySlug}/skills/${slug}`}
                    className="block p-3 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium">{skill.name} Jobs in {cityInfo.name}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Same Skill in Other Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{skillInfo.name} Jobs in Other Cities</h3>
            <div className="space-y-2">
              {Object.entries(cityMap)
                .filter(([slug]) => slug !== citySlug)
                .slice(0, 4)
                .map(([slug, city]) => (
                  <a
                    key={slug}
                    href={`/location/${slug}/skills/${skillSlug}`}
                    className="block p-3 bg-neutral-50 rounded-lg hover:bg-accent-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📍</span>
                      <span className="font-medium">{skillInfo.name} Jobs in {city.name}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      {!loading && (
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {skillInfo.name} Jobs in {cityInfo.name} - Complete Guide
          </h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-4">
              {cityInfo.name} is a major tech hub with numerous opportunities for {skillInfo.name} developers. 
              The city offers competitive salaries, excellent career growth prospects, and a vibrant tech ecosystem 
              for professionals skilled in {skillInfo.name}.
            </p>
            
            <h3 className="text-lg font-semibold mb-3">
              Why Choose {skillInfo.name} Jobs in {cityInfo.name}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600 mb-6">
              <div>
                <strong>• Tech Hub:</strong> Major companies and startups
              </div>
              <div>
                <strong>• High Demand:</strong> Growing need for {skillInfo.name} skills
              </div>
              <div>
                <strong>• Competitive Salaries:</strong> Above-average compensation
              </div>
              <div>
                <strong>• Career Growth:</strong> Multiple advancement opportunities
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">
              Top Companies Hiring {skillInfo.name} Developers in {cityInfo.name}:
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Leading technology companies, product startups, and IT services firms in {cityInfo.name} 
              are actively recruiting {skillInfo.name} professionals for both fresher and experienced roles.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              Salary Trends for {skillInfo.name} in {cityInfo.name}:
            </h3>
            <div className="text-sm text-neutral-600">
              <p><strong>Fresher (0-1 years):</strong> ₹3-5 LPA</p>
              <p><strong>Junior (1-3 years):</strong> ₹5-8 LPA</p>
              <p><strong>Senior (3-5 years):</strong> ₹8-15 LPA</p>
              <p><strong>Lead (5+ years):</strong> ₹15+ LPA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}