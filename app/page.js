'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { graphqlRequest } from '../lib/apollo'
import JobCard from '../components/JobCard'

const GET_RECENT_POSTS = `
  query GetRecentPosts {
    posts(first: 8, where: {orderby: {field: DATE, order: DESC}}) {
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

export default function HomePage() {
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

  if (loading) return <div className="flex justify-center items-center min-h-96">Loading latest jobs...</div>
  
  if (error) return (
    <div className="text-center text-red-600 p-8">
      <h2>Error loading jobs</h2>
      <p>Error details: {error}</p>
    </div>
  )

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream IT Job
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explore BCA, BSc, MCA, BE, BTech, MBA, MSc, BCom, MCom & Diploma opportunities. Start your journey now!
          </p>
          <Link
            href="/category/it-jobs"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Latest Jobs
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Debug Info:</h2>
          <div className="bg-gray-100 p-4 mb-8">
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error ? 'Yes' : 'No'}</p>
            <p>Data: {data ? 'Yes' : 'No'}</p>
            <p>Posts count: {data?.posts?.nodes?.length || 0}</p>
          </div>

          <h2 className="text-3xl font-bold mb-8">Latest Job Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.posts?.nodes?.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}