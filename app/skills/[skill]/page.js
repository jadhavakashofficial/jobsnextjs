'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

// Skill mapping
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
  'digital-marketing': { name: 'Digital Marketing', category: 'Design & Marketing', icon: '📱', searchTerms: ['digital marketing', 'marketing', 'seo', 'social media'] },
  'seo': { name: 'SEO', category: 'Design & Marketing', icon: '🔍', searchTerms: ['seo', 'search engine optimization'] },
  'content-writing': { name: 'Content Writing', category: 'Design & Marketing', icon: '✍️', searchTerms: ['content writing', 'copywriting', 'writing'] }
}

const GET_SKILL_JOBS = `
  query GetSkillJobs($search: String!, $first: Int = 50) {
    posts(
      first: $first,
      where: {
        search: $search,
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

export default function SkillJobsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [mounted, setMounted] = useState(false)

  const skillSlug = params?.skill
  const skillInfo = skillMap[skillSlug]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !skillSlug) return

    const fetchSkillJobs = async () => {
      if (!skillInfo) {
        setError('Skill not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Try multiple search terms for better results
        const searchPromises = skillInfo.searchTerms.map(term => 
          graphqlRequest(GET_SKILL_JOBS, { search: term, first: 20 })
        )
        
        const results = await Promise.all(searchPromises)
        
        // Combine and deduplicate results
        const allJobs = []
        const seenIds = new Set()
        
        results.forEach(result => {
          result?.posts?.nodes?.forEach(job => {
            if (!seenIds.has(job.id)) {
              seenIds.add(job.id)
              allJobs.push(job)
            }
          })
        })
        
        // Sort by date
        allJobs.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        setData({ posts: { nodes: allJobs } })
      } catch (err) {
        console.error('Error fetching skill jobs:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSkillJobs()
  }, [mounted, skillSlug, skillInfo])

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

  if (!skillInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Skill Not Found</h1>
          <p className="text-gray-600 mb-4">The skill you're looking for doesn't exist.</p>
          <a
            href="/skills"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Skills
          </a>
        </div>
      </div>
    )
  }

  const jobs = data?.posts?.nodes || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-accent text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{skillInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {skillInfo.name} Jobs
              </h1>
              <p className="text-lg opacity-90">
                {skillInfo.category}
              </p>
              <p className="text-sm opacity-80 mt-2">
                {loading ? '...' : `${jobs.length} opportunities`} available
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/skills" className="hover:text-primary-600">Skills</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{skillInfo.name}</span>
        </nav>

        {/* Quick Stats */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-accent-600">{jobs.length}</div>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-success-600">
                {jobs.filter(job => {
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
              <div className="text-2xl font-bold text-warning-600">
                {jobs.filter(job => {
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
              <div className="text-2xl font-bold text-primary-600">
                {jobs.filter(job => {
                  try {
                    const customFields = typeof job.customFields === 'string' 
                      ? JSON.parse(job.customFields) 
                      : job.customFields || {}
                    return customFields.experienceLevel === 'Fresher'
                  } catch { return false }
                }).length}
              </div>
              <p className="text-sm text-gray-600">Fresher Jobs</p>
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
      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {jobs.length} {skillInfo.name} Job{jobs.length !== 1 ? 's' : ''} Available
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} post={job} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{skillInfo.icon}</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            No {skillInfo.name} jobs found
          </h3>
          <p className="text-gray-600 mb-6">
            We're actively sourcing {skillInfo.name} opportunities for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/skills"
              className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
            >
              Browse All Skills
            </a>
            <a
              href="/search"
              className="border border-accent-600 text-accent-600 px-6 py-3 rounded-lg hover:bg-accent-50 transition-colors"
            >
              Search All Jobs
            </a>
          </div>
        </div>
      )}

      {/* Related Skills */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Related Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(skillMap)
            .filter(([slug]) => slug !== skillSlug && skillMap[slug].category === skillInfo.category)
            .slice(0, 4)
            .map(([slug, skill]) => (
              <a
                key={slug}
                href={`/skills/${slug}`}
                className="group p-4 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <div className="font-medium text-gray-800 group-hover:text-accent-600">
                  {skill.name}
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}