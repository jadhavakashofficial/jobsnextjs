'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

const GET_BATCH_POSTS = `
  query GetBatchPosts($search: String!) {
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

export default function BatchPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // Extract year from batch param (e.g., "2022-batch" -> "2022")
  const batchYear = params.batch?.split('-')[0]
  const batchTitle = `${batchYear} Batch Jobs`

  useEffect(() => {
    const fetchBatchPosts = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest(GET_BATCH_POSTS, { 
          search: batchYear 
        })
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (batchYear) {
      fetchBatchPosts()
    }
  }, [batchYear])

  if (loading) return <div className="flex justify-center items-center min-h-96">Loading {batchTitle}...</div>
  if (error) return <div className="text-center text-red-600">Error loading batch: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{batchTitle}</h1>
        <p className="text-gray-600 text-lg">
          Job opportunities specifically for {batchYear} batch graduates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.posts?.nodes?.map((post) => (
          <JobCard key={post.id} post={post} />
        ))}
      </div>

      {(!data?.posts?.nodes || data.posts.nodes.length === 0) && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No jobs found for {batchYear} batch yet.</p>
          <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
        </div>
      )}
    </div>
  )
}