'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { graphqlRequest } from '../../lib/apollo'

// Comprehensive skill mapping with categories and metadata
const skillsMap = {
  // Frontend Development
  'react': { 
    name: 'React.js', 
    category: 'Frontend Development', 
    icon: '⚛️', 
    searchTerms: ['react', 'reactjs', 'react.js'],
    difficulty: 'intermediate',
    avgSalary: '₹4-12 LPA',
    description: 'Popular JavaScript library for building user interfaces'
  },
  'javascript': { 
    name: 'JavaScript', 
    category: 'Frontend Development', 
    icon: '🟨', 
    searchTerms: ['javascript', 'js', 'es6', 'ecmascript'],
    difficulty: 'beginner',
    avgSalary: '₹3-10 LPA',
    description: 'Essential programming language for web development'
  },
  'angular': { 
    name: 'Angular', 
    category: 'Frontend Development', 
    icon: '🔺', 
    searchTerms: ['angular', 'angularjs', 'typescript'],
    difficulty: 'intermediate',
    avgSalary: '₹5-14 LPA',
    description: 'Powerful framework for building dynamic web applications'
  },
  'vue': { 
    name: 'Vue.js', 
    category: 'Frontend Development', 
    icon: '💚', 
    searchTerms: ['vue', 'vuejs', 'vue.js'],
    difficulty: 'beginner',
    avgSalary: '₹4-10 LPA',
    description: 'Progressive JavaScript framework for building UIs'
  },
  'html-css': { 
    name: 'HTML & CSS', 
    category: 'Frontend Development', 
    icon: '🎨', 
    searchTerms: ['html', 'css', 'html5', 'css3', 'scss', 'sass'],
    difficulty: 'beginner',
    avgSalary: '₹2-6 LPA',
    description: 'Foundation technologies for web development'
  },
  'typescript': { 
    name: 'TypeScript', 
    category: 'Frontend Development', 
    icon: '🔷', 
    searchTerms: ['typescript', 'ts'],
    difficulty: 'intermediate',
    avgSalary: '₹5-12 LPA',
    description: 'Typed superset of JavaScript for better development'
  },

  // Backend Development
  'nodejs': { 
    name: 'Node.js', 
    category: 'Backend Development', 
    icon: '🟢', 
    searchTerms: ['nodejs', 'node.js', 'node', 'express'],
    difficulty: 'intermediate',
    avgSalary: '₹5-15 LPA',
    description: 'JavaScript runtime for server-side development'
  },
  'python': { 
    name: 'Python', 
    category: 'Backend Development', 
    icon: '🐍', 
    searchTerms: ['python', 'django', 'flask', 'fastapi'],
    difficulty: 'beginner',
    avgSalary: '₹4-16 LPA',
    description: 'Versatile programming language for backend and data science'
  },
  'java': { 
    name: 'Java', 
    category: 'Backend Development', 
    icon: '☕', 
    searchTerms: ['java', 'spring', 'hibernate', 'maven'],
    difficulty: 'intermediate',
    avgSalary: '₹5-18 LPA',
    description: 'Enterprise-grade programming language for robust applications'
  },
  'php': { 
    name: 'PHP', 
    category: 'Backend Development', 
    icon: '🐘', 
    searchTerms: ['php', 'laravel', 'codeigniter', 'symfony'],
    difficulty: 'beginner',
    avgSalary: '₹3-10 LPA',
    description: 'Server-side scripting language for web development'
  },
  'dotnet': { 
    name: '.NET', 
    category: 'Backend Development', 
    icon: '🔷', 
    searchTerms: ['dotnet', '.net', 'c#', 'csharp', 'asp.net'],
    difficulty: 'intermediate',
    avgSalary: '₹5-16 LPA',
    description: 'Microsoft\'s framework for building modern applications'
  },

  // Database & Data
  'mysql': { 
    name: 'MySQL', 
    category: 'Database & Data', 
    icon: '🗄️', 
    searchTerms: ['mysql', 'sql', 'database'],
    difficulty: 'beginner',
    avgSalary: '₹3-10 LPA',
    description: 'Popular relational database management system'
  },
  'mongodb': { 
    name: 'MongoDB', 
    category: 'Database & Data', 
    icon: '🍃', 
    searchTerms: ['mongodb', 'mongo', 'nosql'],
    difficulty: 'intermediate',
    avgSalary: '₹4-12 LPA',
    description: 'NoSQL document-oriented database'
  },
  'postgresql': { 
    name: 'PostgreSQL', 
    category: 'Database & Data', 
    icon: '🐘', 
    searchTerms: ['postgresql', 'postgres', 'psql'],
    difficulty: 'intermediate',
    avgSalary: '₹4-14 LPA',
    description: 'Advanced open-source relational database'
  },

  // Cloud & DevOps
  'aws': { 
    name: 'AWS', 
    category: 'Cloud & DevOps', 
    icon: '☁️', 
    searchTerms: ['aws', 'amazon web services', 'cloud', 'ec2', 's3'],
    difficulty: 'intermediate',
    avgSalary: '₹6-20 LPA',
    description: 'Leading cloud computing platform'
  },
  'docker': { 
    name: 'Docker', 
    category: 'Cloud & DevOps', 
    icon: '🐳', 
    searchTerms: ['docker', 'containerization', 'devops'],
    difficulty: 'intermediate',
    avgSalary: '₹5-16 LPA',
    description: 'Platform for containerizing applications'
  },
  'kubernetes': { 
    name: 'Kubernetes', 
    category: 'Cloud & DevOps', 
    icon: '⚙️', 
    searchTerms: ['kubernetes', 'k8s', 'orchestration'],
    difficulty: 'advanced',
    avgSalary: '₹8-25 LPA',
    description: 'Container orchestration platform'
  },

  // Data Science & AI
  'machine-learning': { 
    name: 'Machine Learning', 
    category: 'Data Science & AI', 
    icon: '🤖', 
    searchTerms: ['machine learning', 'ml', 'ai', 'artificial intelligence'],
    difficulty: 'advanced',
    avgSalary: '₹6-25 LPA',
    description: 'AI technology for predictive analytics'
  },
  'data-science': { 
    name: 'Data Science', 
    category: 'Data Science & AI', 
    icon: '📊', 
    searchTerms: ['data science', 'data scientist', 'analytics', 'statistics'],
    difficulty: 'advanced',
    avgSalary: '₹5-22 LPA',
    description: 'Extract insights from complex data sets'
  },

  // Design & Marketing
  'ui-ux': { 
    name: 'UI/UX Design', 
    category: 'Design & Marketing', 
    icon: '🎨', 
    searchTerms: ['ui', 'ux', 'design', 'figma', 'user interface', 'user experience'],
    difficulty: 'intermediate',
    avgSalary: '₹3-12 LPA',
    description: 'Design user-friendly interfaces and experiences'
  },
  'digital-marketing': { 
    name: 'Digital Marketing', 
    category: 'Design & Marketing', 
    icon: '📱', 
    searchTerms: ['digital marketing', 'marketing', 'seo', 'social media', 'ppc'],
    difficulty: 'beginner',
    avgSalary: '₹2-10 LPA',
    description: 'Promote products through digital channels'
  },

  // Mobile Development
  'android': { 
    name: 'Android Development', 
    category: 'Mobile Development', 
    icon: '🤖', 
    searchTerms: ['android', 'kotlin', 'java', 'mobile'],
    difficulty: 'intermediate',
    avgSalary: '₹4-15 LPA',
    description: 'Build native Android applications'
  },
  'ios': { 
    name: 'iOS Development', 
    category: 'Mobile Development', 
    icon: '📱', 
    searchTerms: ['ios', 'swift', 'iphone', 'mobile'],
    difficulty: 'intermediate',
    avgSalary: '₹5-18 LPA',
    description: 'Develop native iOS applications'
  },
  'flutter': { 
    name: 'Flutter', 
    category: 'Mobile Development', 
    icon: '🦋', 
    searchTerms: ['flutter', 'dart', 'cross platform', 'mobile'],
    difficulty: 'intermediate',
    avgSalary: '₹4-14 LPA',
    description: 'Cross-platform mobile app development'
  }
}

// Query to get all jobs for counting
const GET_ALL_JOBS = `
  query GetAllJobs {
    posts(first: 300, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        title
        excerpt
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

// Count jobs for each skill
const countJobsForSkill = (jobs, skillInfo) => {
  if (!jobs || !skillInfo) return 0
  
  return jobs.filter(job => {
    try {
      const customFields = parseCustomFields(job.customFields)
      const title = (job.title || '').toLowerCase()
      const excerpt = (job.excerpt || '').toLowerCase()
      const skills = (customFields.requiredSkills || customFields.skills || '').toLowerCase()
      
      return skillInfo.searchTerms.some(term => {
        const searchTerm = term.toLowerCase()
        return skills.includes(searchTerm) || 
               title.includes(searchTerm) || 
               excerpt.includes(searchTerm)
      })
    } catch (error) {
      return false
    }
  }).length
}

export default function AllSkillsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobCounts, setJobCounts] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest(GET_ALL_JOBS)
        
        if (result?.posts?.nodes) {
          const counts = {}
          Object.entries(skillsMap).forEach(([slug, skillInfo]) => {
            counts[slug] = countJobsForSkill(result.posts.nodes, skillInfo)
          })
          setJobCounts(counts)
        }
      } catch (err) {
        setError('Failed to load job counts')
      } finally {
        setLoading(false)
      }
    }

    fetchJobCounts()
  }, [])

  // Get unique categories
  const categories = [...new Set(Object.values(skillsMap).map(skill => skill.category))]

  // Filter skills
  const filteredSkills = Object.entries(skillsMap).filter(([slug, skill]) => {
    const categoryMatch = selectedCategory === 'all' || skill.category === selectedCategory
    const searchMatch = searchTerm === '' || 
                       skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  const totalJobs = Object.values(jobCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Browse Jobs by <span className="text-gradient-accent">Skills</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Find your next opportunity based on your technical expertise. 
          From beginner to expert level, discover jobs that match your skills.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-accent-600">{Object.keys(skillsMap).length}</div>
            <p className="text-gray-600 text-sm">Skills</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-success-600">{totalJobs}</div>
            <p className="text-gray-600 text-sm">Jobs</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-primary-600">{categories.length}</div>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-warning-600">Live</div>
            <p className="text-gray-600 text-sm">Updates</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchTerm('')
              }}
              className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid by Category */}
      {categories.map(category => {
        const categorySkills = filteredSkills.filter(([_, skill]) => skill.category === category)
        
        if (categorySkills.length === 0) return null
        
        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categorySkills.map(([slug, skill]) => (
                <Link
                  key={slug}
                  href={`/skills/${slug}`}
                  className="group bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border hover:border-accent-200"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-accent-600">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-600 font-semibold">
                      {loading ? '...' : jobCounts[slug] || 0} jobs
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      skill.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      skill.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {skill.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {skill.avgSalary}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {/* Popular Skills */}
      <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Most In-Demand Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(jobCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 12)
            .map(([slug, count]) => {
              const skill = skillsMap[slug]
              if (!skill) return null
              
              return (
                <Link
                  key={slug}
                  href={`/skills/${slug}`}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-accent-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <div className="font-medium text-sm">{skill.name}</div>
                  <div className="text-xs text-accent-600">{count} jobs</div>
                </Link>
              )
            })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-accent text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Find Your Perfect Tech Job</h2>
        <p className="mb-6">Explore {totalJobs}+ opportunities across all skill levels</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="bg-white text-accent-600 px-6 py-3 rounded-lg font-semibold">
            Search All Jobs
          </Link>
          <Link href="/all-locations" className="border border-white text-white px-6 py-3 rounded-lg font-semibold">
            Browse by Location
          </Link>
        </div>
      </div>
    </div>
  )
}