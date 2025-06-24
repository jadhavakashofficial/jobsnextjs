import Link from 'next/link'

const SEONavigation = () => {
  const popularCities = [
    { slug: 'mumbai', name: 'Mumbai', icon: '🏙️' },
    { slug: 'bangalore', name: 'Bangalore', icon: '🌆' },
    { slug: 'delhi', name: 'Delhi', icon: '🏛️' },
    { slug: 'pune', name: 'Pune', icon: '🏘️' },
    { slug: 'hyderabad', name: 'Hyderabad', icon: '🏗️' },
    { slug: 'remote', name: 'Remote', icon: '💻' }
  ]

  const popularSkills = [
    { slug: 'react', name: 'React.js', icon: '⚛️' },
    { slug: 'python', name: 'Python', icon: '🐍' },
    { slug: 'javascript', name: 'JavaScript', icon: '🟨' },
    { slug: 'java', name: 'Java', icon: '☕' },
    { slug: 'nodejs', name: 'Node.js', icon: '🟢' },
    { slug: 'angular', name: 'Angular', icon: '🔺' }
  ]

  const salaryRanges = [
    { slug: '0-3-lpa', name: '0-3 LPA', icon: '🌱' },
    { slug: '3-5-lpa', name: '3-5 LPA', icon: '📈' },
    { slug: '5-8-lpa', name: '5-8 LPA', icon: '💼' },
    { slug: '8-12-lpa', name: '8-12 LPA', icon: '🚀' },
    { slug: '12-plus-lpa', name: '12+ LPA', icon: '💎' }
  ]

  return (
    <div className="bg-neutral-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Explore Jobs by Categories
          </h2>
          <p className="text-lg text-neutral-600">
            Find opportunities tailored to your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Jobs by Location */}
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              Jobs by Location
            </h3>
            <div className="space-y-3">
              {popularCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/location/${city.slug}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors border border-neutral-200 hover:border-primary-200"
                >
                  <span className="text-xl">{city.icon}</span>
                  <span className="font-medium text-neutral-800 hover:text-primary-600">
                    Jobs in {city.name}
                  </span>
                  <span className="ml-auto text-sm text-neutral-500">→</span>
                </Link>
              ))}
            </div>
            <Link
              href="/search?type=location"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              View all locations →
            </Link>
          </div>

          {/* Jobs by Skills */}
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              Jobs by Skills
            </h3>
            <div className="space-y-3">
              {popularSkills.map((skill) => (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-accent-50 transition-colors border border-neutral-200 hover:border-accent-200"
                >
                  <span className="text-xl">{skill.icon}</span>
                  <span className="font-medium text-neutral-800 hover:text-accent-600">
                    {skill.name} Jobs
                  </span>
                  <span className="ml-auto text-sm text-neutral-500">→</span>
                </Link>
              ))}
            </div>
            <Link
              href="/search?type=skills"
              className="inline-block mt-4 text-accent-600 hover:text-accent-700 font-medium"
            >
              View all skills →
            </Link>
          </div>

          {/* Jobs by Salary */}
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Jobs by Salary
            </h3>
            <div className="space-y-3">
              {salaryRanges.map((range) => (
                <Link
                  key={range.slug}
                  href={`/salary/${range.slug}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-success-50 transition-colors border border-neutral-200 hover:border-success-200"
                >
                  <span className="text-xl">{range.icon}</span>
                  <span className="font-medium text-neutral-800 hover:text-success-600">
                    {range.name} Jobs
                  </span>
                  <span className="ml-auto text-sm text-neutral-500">→</span>
                </Link>
              ))}
            </div>
            <Link
              href="/search?type=salary"
              className="inline-block mt-4 text-success-600 hover:text-success-700 font-medium"
            >
              View all salary ranges →
            </Link>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-neutral-800 mb-6 text-center">
            Popular Job Combinations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Popular combinations */}
            {[
              { href: '/location/mumbai/skills/react', label: 'React in Mumbai', icon: '⚛️🏙️' },
              { href: '/location/bangalore/skills/python', label: 'Python in Bangalore', icon: '🐍🌆' },
              { href: '/location/delhi/skills/java', label: 'Java in Delhi', icon: '☕🏛️' },
              { href: '/location/remote/skills/javascript', label: 'JS Remote', icon: '🟨💻' },
              { href: '/skills/react/salary/5-8-lpa', label: 'React 5-8L', icon: '⚛️💼' },
              { href: '/skills/python/salary/3-5-lpa', label: 'Python 3-5L', icon: '🐍📈' }
            ].map((combo, index) => (
              <Link
                key={index}
                href={combo.href}
                className="group p-4 bg-white rounded-lg hover:bg-gradient-primary hover:text-white transition-all duration-300 border border-neutral-200 hover:border-primary-300 text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {combo.icon}
                </div>
                <div className="text-sm font-medium">
                  {combo.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SEONavigation