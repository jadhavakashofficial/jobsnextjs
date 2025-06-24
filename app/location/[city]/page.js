import Link from 'next/link'

const locations = [
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', icon: '🏙️', jobs: '500+' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', icon: '🌆', jobs: '450+' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi', icon: '🏛️', jobs: '400+' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', icon: '🏘️', jobs: '350+' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', icon: '🏗️', jobs: '300+' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', icon: '🌴', jobs: '250+' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana', icon: '🏢', jobs: '200+' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh', icon: '🏬', jobs: '180+' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', icon: '🎭', jobs: '150+' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', icon: '🕌', jobs: '120+' },
  { slug: 'remote', name: 'Remote', state: 'Work from Anywhere', icon: '💻', jobs: '300+' }
]

const stateGroups = {
  'Maharashtra': ['mumbai', 'pune'],
  'Karnataka': ['bangalore'],
  'Delhi': ['delhi'],
  'Telangana': ['hyderabad'],
  'Tamil Nadu': ['chennai'],
  'Haryana': ['gurgaon'],
  'Uttar Pradesh': ['noida'],
  'West Bengal': ['kolkata'],
  'Gujarat': ['ahmedabad'],
  'Remote': ['remote']
}

export default function LocationsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Jobs by Location
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover job opportunities across major cities in India. Find your perfect role 
          in the city you want to work in.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">11+</div>
          <p className="text-gray-600">Cities</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">2500+</div>
          <p className="text-gray-600">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-accent-600 mb-2">300+</div>
          <p className="text-gray-600">Remote Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">10</div>
          <p className="text-gray-600">States</p>
        </div>
      </div>

      {/* All Cities Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">All Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/location/${location.slug}`}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-primary-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {location.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{location.state}</p>
                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {location.jobs} Jobs
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cities by State */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Cities by State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(stateGroups).map(([state, citySlugs]) => (
            <div key={state} className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                {state}
              </h3>
              <div className="space-y-3">
                {citySlugs.map(slug => {
                  const location = locations.find(loc => loc.slug === slug)
                  return (
                    <Link
                      key={slug}
                      href={`/location/${slug}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <span className="text-2xl">{location.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 hover:text-primary-600">
                          {location.name}
                        </div>
                        <div className="text-sm text-gray-500">{location.jobs} opportunities</div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Cities Highlight */}
      <div className="bg-gradient-primary text-white rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">🔥 Top Job Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {locations.slice(0, 4).map((location) => (
            <Link
              key={location.slug}
              href={`/location/${location.slug}`}
              className="text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {location.icon}
              </div>
              <div className="font-semibold group-hover:underline">{location.name}</div>
              <div className="text-sm opacity-90">{location.jobs}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Search by Location Type */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Find Jobs by Location Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <div className="text-4xl mb-4">🏙️</div>
            <h3 className="font-bold mb-2">Metro Cities</h3>
            <p className="text-sm text-gray-600 mb-4">Mumbai, Delhi, Bangalore, Chennai</p>
            <div className="space-y-2">
              <Link href="/location/mumbai" className="block text-primary-600 hover:underline">Mumbai Jobs</Link>
              <Link href="/location/delhi" className="block text-primary-600 hover:underline">Delhi Jobs</Link>
              <Link href="/location/bangalore" className="block text-primary-600 hover:underline">Bangalore Jobs</Link>
            </div>
          </div>
          
          <div className="text-center p-6 bg-success-50 rounded-lg">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="font-bold mb-2">IT Hubs</h3>
            <p className="text-sm text-gray-600 mb-4">Bangalore, Pune, Hyderabad, Gurgaon</p>
            <div className="space-y-2">
              <Link href="/location/bangalore" className="block text-success-600 hover:underline">Bangalore Tech</Link>
              <Link href="/location/pune" className="block text-success-600 hover:underline">Pune IT Jobs</Link>
              <Link href="/location/hyderabad" className="block text-success-600 hover:underline">Hyderabad Tech</Link>
            </div>
          </div>
          
          <div className="text-center p-6 bg-accent-50 rounded-lg">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="font-bold mb-2">Remote Work</h3>
            <p className="text-sm text-gray-600 mb-4">Work from anywhere in India</p>
            <div className="space-y-2">
              <Link href="/location/remote" className="block text-accent-600 hover:underline">All Remote Jobs</Link>
              <Link href="/location/remote" className="block text-accent-600 hover:underline">WFH Opportunities</Link>
              <Link href="/location/remote" className="block text-accent-600 hover:underline">Hybrid Roles</Link>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Find Your Dream Job by Location</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            India's job market is diverse and dynamic, with different cities offering unique 
            opportunities across various industries. Whether you're looking for tech jobs in 
            Bangalore, finance roles in Mumbai, or government positions in Delhi, we've got 
            opportunities across all major Indian cities.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">Why Location Matters in Your Job Search:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div>
              <strong>• Industry Clusters:</strong> Different cities specialize in different industries
            </div>
            <div>
              <strong>• Cost of Living:</strong> Salary expectations vary by location
            </div>
            <div>
              <strong>• Career Growth:</strong> Some cities offer better advancement opportunities
            </div>
            <div>
              <strong>• Work-Life Balance:</strong> Location affects commute and lifestyle
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Top Employment Cities in India:</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Technology:</strong> Bangalore, Pune, Hyderabad, Chennai</p>
            <p><strong>Finance:</strong> Mumbai, Delhi, Bangalore, Chennai</p>
            <p><strong>Startups:</strong> Bangalore, Mumbai, Delhi, Pune</p>
            <p><strong>Government:</strong> Delhi, various state capitals</p>
          </div>
        </div>
      </div>
    </div>
  )
}