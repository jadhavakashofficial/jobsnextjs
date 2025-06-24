'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
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
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Image */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-10">
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

        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>

        <div className="text-sm text-gray-500">
          Posted on{' '}
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </div>
      </header>

      {/* Main Post Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* CTA Box */}
      <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-8 shadow-lg text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Apply?</h3>
        <p className="mb-6">Take the next step in your career today.</p>
        <button className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
          Apply Now
        </button>
      </div>
    </article>
  )
}
