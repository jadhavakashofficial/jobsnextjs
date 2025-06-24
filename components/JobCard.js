import Link from 'next/link'

export default function JobCard({ post }) {
  // Parse custom fields from JSON string
  const parseCustomFields = (customFieldsString) => {
    if (!customFieldsString) return {}
    
    try {
      // If it's already an object, return it
      if (typeof customFieldsString === 'object') {
        return customFieldsString
      }
      
      // If it's a string, try to parse it as JSON
      if (typeof customFieldsString === 'string') {
        return JSON.parse(customFieldsString)
      }
      
      return {}
    } catch (error) {
      console.warn('Failed to parse custom fields for post:', post.id, error)
      return {}
    }
  }

  // Get parsed custom fields
  const customFields = parseCustomFields(post.customFields)
  
  // Helper function to format salary
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed'
    if (min && max) return `₹${min}L - ₹${max}L per annum`
    if (min) return `₹${min}L+ per annum`
    if (max) return `Up to ₹${max}L per annum`
  }

  // Helper function to parse skills
  const parseSkills = (skillsString) => {
    if (!skillsString) return []
    try {
      // Handle both array and comma-separated string formats
      if (Array.isArray(skillsString)) return skillsString
      return skillsString.split(',').map(skill => skill.trim()).filter(Boolean)
    } catch {
      return []
    }
  }

  // Helper function to check if job is urgent
  const isUrgent = customFields.isUrgent === '1' || customFields.isUrgent === true || customFields.isUrgent === 'true'

  // Helper function to check if deadline is approaching
  const isDeadlineApproaching = () => {
    if (!customFields.applicationDeadline) return false
    const deadline = new Date(customFields.applicationDeadline)
    const today = new Date()
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const skills = parseSkills(customFields.requiredSkills)
  const deadlineApproaching = isDeadlineApproaching()

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-primary-200 group">
      {/* Urgent/Deadline Badge */}
      {(isUrgent || deadlineApproaching) && (
        <div className="bg-gradient-warning text-white px-3 py-1 text-xs font-semibold">
          {isUrgent ? '🔥 URGENT HIRING' : '⏰ DEADLINE APPROACHING'}
        </div>
      )}

      {/* Featured Image */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Work Mode Badge */}
          {customFields.workMode && (
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                customFields.workMode === 'Remote' 
                  ? 'bg-success-100 text-success-700' 
                  : customFields.workMode === 'Hybrid'
                  ? 'bg-accent-100 text-accent-700'
                  : 'bg-neutral-100 text-neutral-700'
              }`}>
                {customFields.workMode}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories?.nodes?.map((category) => (
            <span
              key={category.slug}
              className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
        
        {/* Job Title */}
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link href={`/job/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        {/* Location & Experience */}
        <div className="flex flex-wrap gap-4 mb-3 text-sm text-neutral-600">
          {customFields.city && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{customFields.city}{customFields.state && `, ${customFields.state}`}</span>
            </div>
          )}
          
          {customFields.experienceLevel && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <span>{customFields.experienceLevel}</span>
            </div>
          )}
        </div>

        {/* Company Size */}
        {customFields.companySize && (
          <div className="flex items-center gap-1 mb-3 text-sm text-neutral-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{customFields.companySize}</span>
          </div>
        )}

        {/* Salary Information */}
        {(customFields.salaryMin || customFields.salaryMax) && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-success-700 font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>{formatSalary(customFields.salaryMin, customFields.salaryMax)}</span>
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-accent-50 text-accent-700 text-xs px-2 py-1 rounded border border-accent-200"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-neutral-500 text-xs px-2 py-1">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Excerpt */}
        <div
          className="text-neutral-600 text-sm mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-500">
            {new Date(post.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          
          <Link
            href={`/job/${post.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
              isUrgent || deadlineApproaching
                ? 'bg-gradient-warning text-white shadow-warning'
                : 'bg-gradient-success text-white shadow-success'
            }`}
          >
            {isUrgent ? 'Apply Now!' : 'View Details'}
          </Link>
        </div>

        {/* Application Deadline */}
        {customFields.applicationDeadline && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Apply by: {new Date(customFields.applicationDeadline).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-3 text-xs text-neutral-500">
            <summary>Debug: Custom Fields</summary>
            <pre className="mt-1 p-2 bg-neutral-50 rounded text-xs overflow-auto">
              {JSON.stringify(customFields, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </article>
  )
}