
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SearchBox from './SearchBox'

const DEFAULT_EDU = [
  { name: 'BCA & BSC', slug: 'bca-bsc' },
  { name: 'BE & BTech', slug: 'be-btech' },
  { name: 'MCA & MSC', slug: 'mca-msc' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const [education, setEducation] = useState(DEFAULT_EDU)

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) return
        const data = await res.json()
        const extra = data
          .filter((c) => !DEFAULT_EDU.some((d) => d.slug === c.slug))
          .map((c) => ({ name: c.name, slug: c.slug, count: c.count }))
        setEducation([...DEFAULT_EDU, ...extra])
      } catch (e) {
        console.error('Failed to load categories', e)
      }
    }
    loadCats()
  }, [])

  const batches = [
    { name: '2026 Batch', href: '/batch/2026' },
    { name: '2025 Batch', href: '/batch/2025' },
    { name: '2024 Batch', href: '/batch/2024' },
    { name: '2023 Batch', href: '/batch/2023' },
    { name: '2022 Batch', href: '/batch/2022' },
    { name: '2021 Batch', href: '/batch/2021' },
  ]

  const locations = [
    { name: 'Bengaluru', href: '/location/bengaluru' },
    { name: 'Pune', href: '/location/pune' },
    { name: 'Hyderabad', href: '/location/hyderabad' },
    { name: 'Delhi NCR', href: '/location/delhi-ncr' },
    { name: 'Mumbai', href: '/location/mumbai' },
    { name: 'Chennai', href: '/location/chennai' },
    { name: 'Kolkata', href: '/location/kolkata' },
  ]

  // Updated skill-based navigation
  const skills = [
    { name: 'React Jobs', href: '/skills/react' },
    { name: 'Python Jobs', href: '/skills/python' },
    { name: 'Java Jobs', href: '/skills/java' },
    { name: 'JavaScript Jobs', href: '/skills/javascript' },
    { name: 'Node.js Jobs', href: '/skills/nodejs' },
  ]

  // Updated salary-based navigation
  const salaryRanges = [
    { name: '0-3 LPA', href: '/salary/0-3-lpa' },
    { name: '3-5 LPA', href: '/salary/3-5-lpa' },
    { name: '5-8 LPA', href: '/salary/5-8-lpa' },
    { name: '8-12 LPA', href: '/salary/8-12-lpa' },
    { name: '12+ LPA', href: '/salary/12-plus-lpa' },
  ]

  const pages = [
    { name: 'Recent Posts', href: '/recent-posts' },
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Classic Jobs
            </div>
            <div className="hidden sm:block text-sm text-neutral-600">Top IT Jobs For Freshers</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            
            {/* Jobs by Education */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                Jobs by Education
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {education.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                    {cat.count ? ` (${cat.count})` : ''}
                  </Link>
                ))}
              </div>
            </div>

            {/* Location Dropdown - UPDATED LINKS */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                By Location
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {locations.map((location) => (
                  <Link
                    key={location.name}
                    href={location.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {location.name}
                  </Link>
                ))}
                <div className="border-t border-neutral-100 mt-2 pt-2">
                  <Link
                    href="/all-locations"
                    className="block px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                  >
                    View All Cities →
                  </Link>
                </div>
              </div>
            </div>

            {/* Skills Dropdown - UPDATED LINKS */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                By Skills
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {skills.map((skill) => (
                  <Link
                    key={skill.name}
                    href={skill.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                  >
                    {skill.name}
                  </Link>
                ))}
                <div className="border-t border-neutral-100 mt-2 pt-2">
                  <Link
                    href="/all-skills"
                    className="block px-4 py-2 text-accent-600 hover:bg-accent-50 transition-colors font-medium"
                  >
                    View All Skills →
                  </Link>
                </div>
              </div>
            </div>

            {/* Salary Dropdown */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                By Salary
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {salaryRanges.map((range) => (
                  <Link
                    key={range.name}
                    href={range.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-success-50 hover:text-success-600 transition-colors"
                  >
                    {range.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Batch Dropdown */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                Jobs by Batch
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {batches.map((batch) => (
                  <Link
                    key={batch.href}
                    href={batch.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {batch.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <SearchBox />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - UPDATED LINKS */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200">
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="mb-4">
                <SearchBox />
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">By Location</p>
                {locations.slice(0, 4).map((location) => (
                  <Link
                    key={location.name}
                    href={location.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {location.name}
                  </Link>
                ))}
                <Link
                  href="/all-locations"
                  className="block py-1 pl-4 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View All Cities →
                </Link>
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">By Skills</p>
                {skills.slice(0, 4).map((skill) => (
                  <Link
                    key={skill.name}
                    href={skill.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-accent-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {skill.name}
                  </Link>
                ))}
                <Link
                  href="/all-skills"
                  className="block py-1 pl-4 text-accent-600 hover:text-accent-700 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View All Skills →
                </Link>
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">Jobs by Education</p>
                {education.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block py-1 pl-4 text-neutral-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">Jobs by Batch</p>
                {batches.map((batch) => (
                  <Link
                    key={batch.href}
                    href={batch.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {batch.name}
                  </Link>
                ))}
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">By Salary</p>
                {salaryRanges.slice(0, 3).map((range) => (
                  <Link
                    key={range.name}
                    href={range.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-success-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {range.name}
                  </Link>
                ))}
              </div>

              <div>
                <p className="font-medium text-neutral-900 py-2">Pages</p>
                {pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}