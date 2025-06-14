'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

const GET_EDUCATION_POSTS = `
  query GetEducationPosts($search: String!) {
    posts(first: 50, where: {search: $search, orderby: {field: DATE, order: DESC}}) {
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
          }
        }
      }
    }
  }
`

// Education mapping outside component to prevent re-creation
const educationMap = {
  'bca-bsc': { 
    search: 'BCA BSC', 
    title: 'BCA & BSC Jobs',
    description: 'Job opportunities for Bachelor of Computer Applications and Bachelor of Science graduates'
  },
  'be-btech': { 
    search: 'BE BTech Engineering', 
    title: 'BE & BTech Jobs',
    description: 'Engineering job opportunities for Bachelor of Engineering and Bachelor of Technology graduates'
  },
  'mca-msc': { 
    search: 'MCA MSC', 
    title: 'MCA & MSC Jobs',
    description: 'Job opportunities for Master of Computer Applications and Master of Science graduates'
  },
  'mba': { 
    search: 'MBA', 
    title: 'MBA Jobs',
    description: 'Management and business job opportunities for MBA graduates'
  },
  'bba-bcom': { 
    search: 'BBA BCom', 
    title: 'BBA & BCom Jobs',
    description: 'Business and commerce job opportunities for BBA and BCom graduates'
  },
  'diploma': { 
    search: 'Diploma', 
    title: 'Diploma Jobs',
    description: 'Job opportunities for Diploma holders across various fields'
  }
}

export default function EducationPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // Get current education config
  const currentEducation = educationMap[params?.slug]

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch data
  useEffect(() => {
    if (!mounted || !params?.slug) return

    const fetchEducationPosts = async () => {
      if (!currentEducation) {
        setError('Education category not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const result = await graphqlRequest(GET_EDUCATION_POSTS, { 
          search: currentEducation.search 
        })
        
        setData(result)
      } catch (err) {
        console.error('Error fetching education posts:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchEducationPosts()
  }, [mounted, params?.slug, currentEducation])

  // Don't render until mounted
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

  // Handle invalid education category
  if (!currentEducation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Education Category Not Found</h1>
          <p className="text-gray-600">The education category you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">Error Loading Jobs</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{currentEducation.title}</h1>
          <p className="text-gray-600 text-lg">{currentEducation.description}</p>
        </div>
        
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading jobs...</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle success state
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{currentEducation.title}</h1>
        <p className="text-gray-600 text-lg">{currentEducation.description}</p>
        {data?.posts?.nodes?.length > 0 && (
          <p className="text-gray-500 mt-2">{data.posts.nodes.length} opportunities found</p>
        )}
      </div>

      {data?.posts?.nodes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.posts.nodes.map((post) => (
            <JobCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">No jobs available for {currentEducation.title} at the moment.</p>
          <p className="text-gray-400">Check back soon for new opportunities!</p>
        </div>
      )}
    </div>
  )
}