'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { graphqlRequest } from '../../../lib/apollo'

const GET_POST = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
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
`

export default function JobPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest(GET_POST, { slug: params.slug })
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
      fetchPost()
    }
  }, [params.slug])

  if (loading) return <div className="flex justify-center items-center min-h-96">Loading...</div>
  if (error) return <div className="text-center text-red-600">Error loading job: {error}</div>
  if (!data?.post) return <div className="text-center">Job not found</div>

  const { post } = data

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {post.featuredImage?.node?.sourceUrl && (
        <img
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories?.nodes?.map((category) => (
            <span
              key={category.slug}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {category.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 text-sm">
          <span>Posted: {new Date(post.date).toLocaleDateString()}</span>
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 p-8 bg-blue-50 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
        <p className="text-gray-600 mb-6">
          Don't miss this opportunity! Apply now and take the next step in your career.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Apply Now
        </button>
      </div>
    </article>
  )
}