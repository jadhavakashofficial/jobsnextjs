import Link from 'next/link'

export default function LocationOverviewPage() {
  const locations = [
    { 
      slug: 'mumbai', 
      name: 'Mumbai', 
      state: 'Maharashtra',
      jobs: '500+',
      icon: '🏙️',
      description: 'Financial capital with major IT companies and startups'
    },
    { 
      slug: 'delhi', 
      name: 'Delhi', 
      state: 'Delhi NCR',
      jobs: '450+',
      icon: '🏛️',
      description: 'Capital region with government and private sector opportunities'
    },
    { 
      slug: 'bangalore', 
      name: 'Bangalore', 
      state: 'Karnataka',
      jobs: '800+',
      icon: '💻',
      description: 'Silicon Valley of India with top tech companies'
    },
    { 
      slug: 'pune', 
      name: 'Pune', 
      state: 'Maharashtra',
      jobs: '400+',
      icon: '🎓',
      description: 'Educational hub with growing IT sector'
    },
    { 
      slug: 'hyderabad', 
      name: 'Hyderabad', 
      state: 'Telangana',
      jobs: '350+',
      icon: '🏢',
      description: 'HITEC City with global tech companies'
    },
    { 
      slug: 'chennai', 
      name: 'Chennai', 
      state: 'Tamil Nadu',
      jobs: '300+',
      icon: '🌊',
      description: 'Detroit of India with automotive and IT industries'
    },
    { 
      slug: 'gurgaon', 
      name: 'Gurgaon', 
      state: 'Haryana',
      jobs: '280+',
      icon: '🏗️',
      description: 'Millennium City with corporate headquarters'
    },
    { 
      slug: 'noida', 
      name: 'Noida', 
      state: 'Uttar Pradesh',
      jobs: '250+',
      icon: '🏭',
      description: 'Planned city with IT and media companies'
    },
    { 
      slug: 'kolkata', 
      name: 'Kolkata', 
      state: 'West Bengal',
      jobs: '200+',
      icon: '🎭',
      description: 'Cultural capital with emerging tech sector'
    },
    { 
      slug: 'ahmedabad', 
      name: 'Ahmedabad', 
      state: 'Gujarat',
      jobs: '180+',
      icon: '🏛️',
      description: 'Commercial hub with growing IT opportunities'
    },
    { 
      slug: 'remote', 
      name: 'Remote Work', 
      state: 'Work from Anywhere',
      jobs: '600+',
      icon: '🌐',
      description: 'Work from home opportunities across India'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Jobs by Location
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          Find your dream job in India's top cities. Explore opportunities across major tech hubs 
          and emerging markets.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">11</div>
          <p className="text-neutral-600">Cities</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">3000+</div>
          <p className="text-neutral-600">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-accent-600 mb-2">600+</div>
          <p className="text-neutral-600">Remote Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">500+</div>
          <p className="text-neutral-600">Companies</p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={`/location/${location.slug}`}
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 hover:border-primary-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {location.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                  {location.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-2">{location.state}</p>
                <p className="text-neutral-700 text-sm mb-3">{location.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm font-medium">
                    {location.jobs} Jobs
                  </span>
                  <svg className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Combinations */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Location + Skill Combinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/location/mumbai/skills/react" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">React Jobs in Mumbai</span>
          </Link>
          <Link href="/location/bangalore/skills/python" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">Python Jobs in Bangalore</span>
          </Link>
          <Link href="/location/delhi/skills/java" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">Java Jobs in Delhi</span>
          </Link>
          <Link href="/location/pune/skills/javascript" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">JavaScript Jobs in Pune</span>
          </Link>
          <Link href="/location/hyderabad/skills/nodejs" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">Node.js Jobs in Hyderabad</span>
          </Link>
          <Link href="/location/remote/skills/react" className="p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
            <span className="font-medium">Remote React Jobs</span>
          </Link>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Find Jobs Across India's Top Tech Cities</h2>
        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-600 mb-4">
            India's technology sector spans across multiple cities, each offering unique opportunities 
            for freshers and experienced professionals. From Bangalore's startup ecosystem to Mumbai's 
            financial technology sector, every city has its distinct advantages.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">Why Location Matters for Your Career:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
            <div>
              <strong>• Cost of Living:</strong> Different cities offer varying lifestyle costs
            </div>
            <div>
              <strong>• Industry Focus:</strong> Each city specializes in different tech domains
            </div>
            <div>
              <strong>• Growth Opportunities:</strong> Career advancement varies by location
            </div>
            <div>
              <strong>• Work Culture:</strong> Different cities have unique professional environments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}