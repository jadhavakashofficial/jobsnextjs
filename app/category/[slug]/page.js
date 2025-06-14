'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'
import JobCard from '../../../components/JobCard'

const GET_CATEGORY_POSTS = `
  query GetCategoryPosts($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      description
      posts(first: 20) {
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
  }
`

export default function CategoryPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest(GET_CATEGORY_POSTS, { slug: params.slug })
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchCategory()
    }
  }, [params.slug])

  if (loading) return <div className="flex justify-center items-center min-h-96">Loading...</div>
  if (error) return <div className="text-center text-red-600">Error loading category: {error}</div>
  if (!data?.category) return <div className="text-center">Category not found</div>

  const { category } = data

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 text-lg">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.posts.nodes.map((post) => (
          <JobCard key={post.id} post={post} />
        ))}
      </div>

      {category.posts.nodes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No jobs found in this category yet.</p>
        </div>
      )}
    </div>
  )
}