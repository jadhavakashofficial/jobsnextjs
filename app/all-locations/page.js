'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { graphqlRequest, GET_ALL_JOBS, filterJobsByCity, calculateJobStats } from '../../lib/apollo'

// Complete city mapping with enhanced search terms for perfect matching
const cityMap = {
  'mumbai': { 
    name: 'Mumbai', 
    state: 'Maharashtra',
    icon: '🏙️',
    description: 'India\'s financial capital and business hub',
    industries: ['Finance', 'IT', 'Entertainment', 'Manufacturing'],
    avgSalary: '₹8-15 LPA',
    searchTerms: ['mumbai', 'bombay', 'maharashtra', 'mumbai city', 'greater mumbai'],
    category: 'metro',
    region: 'west',
    population: '20M+',
    companies: 'Google, Microsoft, HDFC, Reliance'
  },
  'bangalore': { 
    name: 'Bangalore', 
    state: 'Karnataka',
    icon: '🌆',
    description: 'India\'s Silicon Valley and IT capital',
    industries: ['IT', 'Startups', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹6-18 LPA',
    searchTerms: ['bangalore', 'bengaluru', 'karnataka', 'blr', 'silicon valley'],
    category: 'metro',
    region: 'south',
    population: '12M+',
    companies: 'Infosys, Wipro, Amazon, Flipkart'
  },
  'delhi': { 
    name: 'Delhi', 
    state: 'Delhi',
    icon: '🏛️',
    description: 'India\'s capital and government hub',
    industries: ['Government', 'IT', 'Education', 'Healthcare'],
    avgSalary: '₹5-12 LPA',
    searchTerms: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'noida', 'gurugram', 'faridabad'],
    category: 'metro',
    region: 'north',
    population: '32M+',
    companies: 'HCL, Tech Mahindra, Paytm, Ola'
  },
  'pune': { 
    name: 'Pune', 
    state: 'Maharashtra',
    icon: '🏘️',
    description: 'IT hub and educational center of Maharashtra',
    industries: ['IT', 'Automotive', 'Education', 'Manufacturing'],
    avgSalary: '₹5-14 LPA',
    searchTerms: ['pune', 'maharashtra', 'pune city', 'pimpri chinchwad'],
    category: 'tier1',
    region: 'west',
    population: '7M+',
    companies: 'TCS, Cognizant, Bajaj, Mahindra'
  },
  'hyderabad': { 
    name: 'Hyderabad', 
    state: 'Telangana',
    icon: '🏗️',
    description: 'Cyberabad - IT and pharmaceutical hub',
    industries: ['IT', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    avgSalary: '₹5-15 LPA',
    searchTerms: ['hyderabad', 'cyberabad', 'telangana', 'secunderabad', 'hitech city'],
    category: 'metro',
    region: 'south',
    population: '10M+',
    companies: 'Microsoft, Google, Facebook, Dr. Reddy\'s'
  },
  'chennai': { 
    name: 'Chennai', 
    state: 'Tamil Nadu',
    icon: '🌴',
    description: 'Detroit of India and IT services hub',
    industries: ['Automotive', 'IT', 'Healthcare', 'Manufacturing'],
    avgSalary: '₹4-12 LPA',
    searchTerms: ['chennai', 'madras', 'tamil nadu', 'tn', 'chennai city'],
    category: 'metro',
    region: 'south',
    population: '11M+',
    companies: 'Ford, BMW, Zoho, Freshworks'
  },
  'kolkata': { 
    name: 'Kolkata', 
    state: 'West Bengal',
    icon: '🏛️',
    description: 'Cultural capital and emerging IT hub',
    industries: ['IT', 'Education', 'Healthcare', 'Finance'],
    avgSalary: '₹4-10 LPA',
    searchTerms: ['kolkata', 'calcutta', 'west bengal', 'wb', 'cal'],
    category: 'metro',
    region: 'east',
    population: '15M+',
    companies: 'TCS, Wipro, ITC, Coal India'
  },
  'ahmedabad': { 
    name: 'Ahmedabad', 
    state: 'Gujarat',
    icon: '🏭',
    description: 'Commercial capital of Gujarat',
    industries: ['Manufacturing', 'Textiles', 'Chemicals', 'IT'],
    avgSalary: '₹4-12 LPA',
    searchTerms: ['ahmedabad', 'gujarat', 'amdavad', 'gandhinagar'],
    category: 'tier1',
    region: 'west',
    population: '8M+',
    companies: 'Adani, Torrent, Zydus, Gift City'
  },
  'jaipur': { 
    name: 'Jaipur', 
    state: 'Rajasthan',
    icon: '🏰',
    description: 'Pink city with growing IT sector',
    industries: ['IT', 'Tourism', 'Handicrafts', 'Textiles'],
    avgSalary: '₹3-8 LPA',
    searchTerms: ['jaipur', 'rajasthan', 'pink city'],
    category: 'tier2',
    region: 'north',
    population: '3M+',
    companies: 'Genpact, IBM, Accenture'
  },
  'lucknow': { 
    name: 'Lucknow', 
    state: 'Uttar Pradesh',
    icon: '🏛️',
    description: 'Capital of UP with emerging opportunities',
    industries: ['Government', 'IT', 'Education', 'Agriculture'],
    avgSalary: '₹3-8 LPA',
    searchTerms: ['lucknow', 'uttar pradesh', 'up', 'lucknow city'],
    category: 'tier2',
    region: 'north',
    population: '3M+',
    companies: 'HCL, Tech Mahindra, Wipro'
  },
  'kochi': { 
    name: 'Kochi', 
    state: 'Kerala',
    icon: '🌊',
    description: 'Queen of Arabian Sea and IT hub',
    industries: ['IT', 'Marine', 'Spices', 'Tourism'],
    avgSalary: '₹4-10 LPA',
    searchTerms: ['kochi', 'cochin', 'kerala', 'ernakulam'],
    category: 'tier2',
    region: 'south',
    population: '2M+',
    companies: 'Infosys, TCS, UST Global'
  },
  'indore': { 
    name: 'Indore', 
    state: 'Madhya Pradesh',
    icon: '🏭',
    description: 'Commercial center of Central India',
    industries: ['Manufacturing', 'IT', 'Textiles', 'Agriculture'],
    avgSalary: '₹3-8 LPA',
    searchTerms: ['indore', 'madhya pradesh', 'mp'],
    category: 'tier2',
    region: 'central',
    population: '3M+',
    companies: 'Impetus, Persistent, TCS'
  },
  'chandigarh': { 
    name: 'Chandigarh', 
    state: 'Punjab/Haryana',
    icon: '🌹',
    description: 'Planned city and IT services center',
    industries: ['IT', 'Government', 'Education', 'Healthcare'],
    avgSalary: '₹4-10 LPA',
    searchTerms: ['chandigarh', 'punjab', 'haryana', 'tricity'],
    category: 'tier2',
    region: 'north',
    population: '1M+',
    companies: 'Infosys, Wipro, Tech Mahindra'
  },
  'bhubaneswar': { 
    name: 'Bhubaneswar', 
    state: 'Odisha',
    icon: '🏛️',
    description: 'Temple city with emerging IT sector',
    industries: ['IT', 'Education', 'Government', 'Mining'],
    avgSalary: '₹3-8 LPA',
    searchTerms: ['bhubaneswar', 'odisha', 'orissa', 'bbsr'],
    category: 'tier2',
    region: 'east',
    population: '1M+',
    companies: 'Infosys, TCS, Mindtree'
  },
  'remote': { 
    name: 'Remote Work', 
    state: 'Work from Anywhere',
    icon: '💻',
    description: 'Work from anywhere in India',
    industries: ['IT', 'Digital Marketing', 'Content', 'Consulting'],
    avgSalary: '₹4-25 LPA',
    searchTerms: ['remote', 'work from home', 'wfh', 'online', 'work from anywhere'],
    category: 'remote',
    region: 'all',
    population: 'Unlimited',
    companies: 'Global Tech Companies'
  }
}

export default function AllLocationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobCounts, setJobCounts] = useState({})
  const [allJobs, setAllJobs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        setLoading(true)
        console.log('🚀 Fetching all jobs for location analysis...')
        
        const result = await graphqlRequest(GET_ALL_JOBS, { first: 300 })
        
        if (result?.posts?.nodes) {
          console.log(`✅ Fetched ${result.posts.nodes.length} jobs successfully`)
          
          setAllJobs(result.posts.nodes)
          
          // Calculate job counts for each city using enhanced filtering
          const counts = {}
          Object.entries(cityMap).forEach(([slug, cityInfo]) => {
            const cityJobs = filterJobsByCity(result.posts.nodes, cityInfo)
            counts[slug] = cityJobs.length
            
            console.log(`📊 ${cityInfo.name}: ${cityJobs.length} jobs found`)
          })
          
          setJobCounts(counts)
          
          // Log overall statistics
          const totalJobsFound = Object.values(counts).reduce((sum, count) => sum + count, 0)
          console.log(`📈 Total jobs distributed across cities: ${totalJobsFound}`)
          
        } else {
          console.warn('⚠️ No jobs data received from GraphQL')
          setJobCounts({})
          setAllJobs([])
        }
      } catch (err) {
        console.error('💥 Error fetching job counts:', err)
        setError('Failed to load job counts. Please try refreshing the page.')
        setJobCounts({})
        setAllJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobCounts()
  }, [])

  // Filter cities based on user selections
  const filteredCities = Object.entries(cityMap).filter(([slug, city]) => {
    const categoryMatch = selectedCategory === 'all' || city.category === selectedCategory
    const regionMatch = selectedRegion === 'all' || city.region === selectedRegion
    const searchMatch = searchTerm === '' || 
                       city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       city.industries.some(industry => 
                         industry.toLowerCase().includes(searchTerm.toLowerCase())
                       )
    
    return categoryMatch && regionMatch && searchMatch
  })

  const totalJobs = Object.values(jobCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Browse Jobs by <span className="text-gradient-primary">Location</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover career opportunities across India's top cities. From metro hubs to emerging tech centers, 
          find your ideal work location with our advanced matching system.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-primary-600">{Object.keys(cityMap).length}</div>
            <p className="text-gray-600 text-sm">Cities</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-success-600">{loading ? '...' : totalJobs}</div>
            <p className="text-gray-600 text-sm">Total Jobs</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-accent-600">5</div>
            <p className="text-gray-600 text-sm">Regions</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-warning-600">{loading ? '...' : jobCounts.remote || 0}</div>
            <p className="text-gray-600 text-sm">Remote Jobs</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading jobs with advanced location matching...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing job data across all cities</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Success Indicator */}
      {!loading && !error && totalJobs > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">✅ Location Matching Active:</span>
            <span className="text-green-700">Successfully analyzed {allJobs.length} jobs across {Object.keys(cityMap).length} cities</span>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cities..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="metro">Metro Cities</option>
                <option value="tier1">Tier 1 Cities</option>
                <option value="tier2">Tier 2 Cities</option>
                <option value="remote">Remote Work</option>
              </select>
            </div>
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Regions</option>
                <option value="north">North India</option>
                <option value="south">South India</option>
                <option value="west">West India</option>
                <option value="east">East India</option>
                <option value="central">Central India</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedRegion('all')
                  setSearchTerm('')
                }}
                className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Metro Cities */}
      {!loading && !error && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">🏙️</span>
            Featured Metro Cities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities
              .filter(([slug, city]) => city.category === 'metro')
              .slice(0, 6)
              .map(([slug, city]) => (
                <Link
                  key={slug}
                  href={`/location/${slug}`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border hover:border-primary-200 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {city.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{city.state} • {city.population}</p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {city.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="font-semibold text-primary-600">
                            {loading ? '...' : jobCounts[slug] || 0} jobs
                          </span>
                          <span className="text-gray-500 ml-2">{city.avgSalary}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Top: {city.companies}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {city.industries.slice(0, 3).map((industry, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* All Cities by Category */}
      {!loading && !error && ['tier1', 'tier2', 'remote'].map(category => {
        const categoryName = {
          'tier1': 'Tier 1 Cities',
          'tier2': 'Tier 2 & Emerging Cities',
          'remote': 'Remote Work'
        }[category]
        
        const categoryIcon = {
          'tier1': '🏘️',
          'tier2': '🌟',
          'remote': '💻'
        }[category]
        
        const categoryCities = filteredCities.filter(([_, city]) => city.category === category)
        
        if (categoryCities.length === 0) return null
        
        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">{categoryIcon}</span>
              {categoryName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categoryCities.map(([slug, city]) => (
                <Link
                  key={slug}
                  href={`/location/${slug}`}
                  className="group bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center border hover:border-primary-200"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {city.icon}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary-600">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{city.state}</p>
                  <div className="text-sm font-medium text-primary-600">
                    {loading ? '...' : jobCounts[slug] || 0} jobs
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {city.avgSalary}
                  </div>
                  {city.population && (
                    <div className="text-xs text-gray-400 mt-1">
                      {city.population}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {/* Regional Overview */}
      {!loading && !error && (
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Regional Job Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: 'North', cities: ['Delhi', 'Jaipur', 'Lucknow', 'Chandigarh'], icon: '🏔️' },
              { region: 'South', cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Kochi'], icon: '🌴' },
              { region: 'West', cities: ['Mumbai', 'Pune', 'Ahmedabad'], icon: '🌊' },
              { region: 'East', cities: ['Kolkata', 'Bhubaneswar'], icon: '🏛️' }
            ].map((regionInfo, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">{regionInfo.icon}</div>
                <h3 className="font-bold text-lg mb-2">{regionInfo.region} India</h3>
                <div className="space-y-1 mb-3">
                  {regionInfo.cities.map((cityName, idx) => (
                    <div key={idx} className="text-sm text-gray-600">{cityName}</div>
                  ))}
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {Object.entries(cityMap)
                    .filter(([_, city]) => regionInfo.cities.includes(city.name))
                    .reduce((sum, [slug]) => sum + (jobCounts[slug] || 0), 0)} total jobs
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Active Cities */}
      {!loading && !error && totalJobs > 0 && (
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Most Active Job Markets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(jobCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 12)
              .map(([slug, count]) => {
                const city = cityMap[slug]
                if (!city) return null
                
                return (
                  <Link
                    key={slug}
                    href={`/location/${slug}`}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">{city.icon}</div>
                    <div className="font-medium text-sm">{city.name}</div>
                    <div className="text-xs text-primary-600 font-medium">{count} jobs</div>
                  </Link>
                )
              })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-gradient-primary text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Find Your Ideal Work Location</h2>
        <p className="mb-6">Explore {totalJobs}+ opportunities across {Object.keys(cityMap).length} cities with precise location matching</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold">
            Search All Jobs
          </Link>
          <Link href="/all-skills" className="border border-white text-white px-6 py-3 rounded-lg font-semibold">
            Browse by Skills
          </Link>
        </div>
      </div>
    </div>
  )
}