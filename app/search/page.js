'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { graphqlRequest } from '../../lib/apollo'
import JobCard from '../../components/JobCard'

const SEARCH_POSTS = `
  query SearchPosts($search: String!) {
    posts(first: 50, where: {search: $search}) {
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(query)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    try {
      setLoading(true)
      setError(null)
      const result = await graphqlRequest(SEARCH_POSTS, { search: searchTerm })
      setData(result)
      
      // Update URL without reload
      window.history.pushState({}, '', `?q=${encodeURIComponent(searchTerm)}`)
    } catch (err) {
      setError(err.message)
      console.error('Search Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Search on initial load if query exists
  useEffect(() => {
    if (query) {
      setSearchTerm(query)
      const initialSearch = async () => {
        try {
          setLoading(true)
          const result = await graphqlRequest(SEARCH_POSTS, { search: query })
          setData(result)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      initialSearch()
    }
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Jobs & Content</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for jobs, companies, skills..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results count */}
        {searchTerm && data && !loading && (
          <p className="text-gray-600 mb-4">
            {data?.posts?.nodes?.length || 0} result{data?.posts?.nodes?.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Searching...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 py-16">
          <h2 className="text-xl font-semibold mb-2">Search Error</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-8">
          {data.posts?.nodes?.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Job Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.posts.nodes.map((post) => (
                  <JobCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ) : searchTerm ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-4">No results found</h2>
              <p className="text-gray-600 mb-4">No jobs found for "{searchTerm}"</p>
              <p className="text-gray-500">Try different keywords or browse our categories</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Popular Searches - show when no search term */}
      {!searchTerm && !loading && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Software Engineer', 'Data Scientist', 'Frontend Developer',
              'Backend Developer', 'Full Stack', 'Python Developer',
              'Java Developer', 'React Developer', 'Node.js', 'Angular'
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term)
                  handleSearch({ preventDefault: () => {} })
                }}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-gray-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}