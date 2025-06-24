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

// Skeleton Loading Component
const JobCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-neutral-200"></div>
    <div className="p-6">
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
        <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
      </div>
      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-neutral-200 rounded w-20"></div>
        <div className="h-10 bg-neutral-200 rounded w-24"></div>
      </div>
    </div>
  </div>
)

// Stats Component
const StatsSection = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">500+</div>
        <p className="text-neutral-600 mt-1">Active Jobs</p>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">50+</div>
        <p className="text-neutral-600 mt-1">Companies</p>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">1000+</div>
        <p className="text-neutral-600 mt-1">Successful Placements</p>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-warning bg-clip-text text-transparent">24/7</div>
        <p className="text-neutral-600 mt-1">Support</p>
      </div>
    </div>
  </div>
)

// Education Quick Access Component
const EducationQuickAccess = () => {
  const educationTypes = [
    { name: 'BCA & BSC', slug: 'bca-bsc', icon: '💻', count: '120+' },
    { name: 'BE & BTech', slug: 'be-btech', icon: '⚙️', count: '200+' },
    { name: 'MCA & MSC', slug: 'mca-msc', icon: '🎓', count: '150+' },
    { name: 'MBA', slug: 'mba', icon: '📊', count: '80+' },
    { name: 'BBA & BCom', slug: 'bba-bcom', icon: '💼', count: '90+' },
    { name: 'Diploma', slug: 'diploma', icon: '📜', count: '70+' }
  ]

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-2">Find Jobs by Education</h2>
      <p className="text-neutral-600 text-center mb-8">Opportunities tailored to your educational background</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {educationTypes.map((edu) => (
          <Link
            key={edu.slug}
            href={`/education/${edu.slug}`}
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 hover:border-primary-200"
          >
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {edu.icon}
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2 text-sm">{edu.name}</h3>
              <p className="text-primary-600 font-bold text-lg">{edu.count}</p>
              <p className="text-neutral-500 text-xs">Jobs Available</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Featured Categories Component
const FeaturedCategories = () => {
  const categories = [
    { name: 'Software Development', count: '180+', color: 'bg-gradient-primary' },
    { name: 'Data Science', count: '95+', color: 'bg-gradient-accent' },
    { name: 'Digital Marketing', count: '120+', color: 'bg-gradient-success' },
    { name: 'Business Analysis', count: '75+', color: 'bg-gradient-warning' }
  ]

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Trending Job Categories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`${category.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <h3 className="font-bold text-lg mb-2">{category.name}</h3>
            <p className="text-2xl font-bold mb-1">{category.count}</p>
            <p className="opacity-90 text-sm">Open Positions</p>
          </div>
        ))}
      </div>
    </div>
  )
}

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
        setError('Unable to load jobs at the moment. Please try again later.')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Dream IT Job
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
            Explore BCA, BSc, MCA, BE, BTech, MBA, MSc, BCom, MCom & Diploma opportunities. Start your journey now!
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/category/it-jobs"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse Latest Jobs
            </Link>
            <Link
              href="/search"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Section */}
          <StatsSection />
          
          {/* Education Quick Access */}
          <EducationQuickAccess />
          
          {/* Featured Categories */}
          <FeaturedCategories />
          
          {/* Latest Jobs Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-2">Latest Job Opportunities</h2>
            <p className="text-neutral-600 text-center mb-8">Fresh opportunities posted recently</p>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-error-50 border border-error-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-error-600 text-xl mb-4">⚠️ Oops!</div>
                <p className="text-error-700 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-error-600 text-white px-6 py-2 rounded-lg hover:bg-error-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* Loading State with Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          )}
          
          {/* Jobs Grid */}
          {!loading && !error && data?.posts?.nodes && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.posts.nodes.map((post) => (
                <JobCard key={post.id} post={post} />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && (!data?.posts?.nodes || data.posts.nodes.length === 0) && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-neutral-700 mb-4">No Jobs Found</h3>
              <p className="text-neutral-600 mb-6">We're working hard to bring you the latest opportunities!</p>
              <Link
                href="/search"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search Jobs
              </Link>
            </div>
          )}
          
          {/* Call to Action Section */}
          {!loading && !error && data?.posts?.nodes && data.posts.nodes.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/recent-posts"
                className="inline-flex items-center bg-gradient-accent text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                View All Jobs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}