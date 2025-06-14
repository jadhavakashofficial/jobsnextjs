'use client'
import { useState, useEffect } from 'react'
import { graphqlRequest } from '../../lib/apollo'
import JobCard from '../../components/JobCard'

const GET_RECENT_POSTS = `
  query GetRecentPosts {
    posts(first: 20, where: {orderby: {field: DATE, order: DESC}}) {
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

export default function RecentPostsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest(GET_RECENT_POSTS)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <div className="flex justify-center items-center min-h-96">Loading recent posts...</div>
  if (error) return <div className="text-center text-red-600">Error loading posts: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Recent Posts</h1>
        <p className="text-gray-600 text-lg">Latest job opportunities and career updates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.posts?.nodes?.map((post) => (
          <JobCard key={post.id} post={post} />
        ))}
      </div>

      {(!data?.posts?.nodes || data.posts.nodes.length === 0) && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No posts found.</p>
        </div>
      )}
    </div>
  )
}