'use client'
import Link from 'next/link'
import { useState } from 'react'
import SearchBox from './SearchBox'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { name: 'IT Jobs', href: '/category/it-jobs' },
    { name: 'Blogs', href: '/category/blogs' },
    { name: 'MBA Jobs', href: '/category/mba-jobs' },
  ]

  const batches = [
    { name: '2025 Batch', href: '/batch-wise/2025-batch' },
    { name: '2024 Batch', href: '/batch-wise/2024-batch' },
    { name: '2023 Batch', href: '/batch-wise/2023-batch' },
    { name: '2022 Batch', href: '/batch-wise/2022-batch' },
  ]

  const education = [
    { name: 'BCA & BSC', href: '/education/bca-bsc' },
    { name: 'BE & BTech', href: '/education/be-btech' },
    { name: 'MCA & MSC', href: '/education/mca-msc' },
    { name: 'MBA', href: '/education/mba' },
    { name: 'BBA & BCom', href: '/education/bba-bcom' },
    { name: 'Diploma', href: '/education/diploma' },
  ]

  // New location-based navigation
  const locations = [
    { name: 'Mumbai Jobs', href: '/location/mumbai' },
    { name: 'Delhi Jobs', href: '/location/delhi' },
    { name: 'Bangalore Jobs', href: '/location/bangalore' },
    { name: 'Pune Jobs', href: '/location/pune' },
    { name: 'Remote Jobs', href: '/location/remote' },
  ]

  // New skill-based navigation
  const skills = [
    { name: 'React Jobs', href: '/skills/react' },
    { name: 'Python Jobs', href: '/skills/python' },
    { name: 'Java Jobs', href: '/skills/java' },
    { name: 'JavaScript Jobs', href: '/skills/javascript' },
    { name: 'Node.js Jobs', href: '/skills/nodejs' },
  ]

  // New salary-based navigation
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
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Location Dropdown */}
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
                    href="/location"
                    className="block px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                  >
                    View All Cities →
                  </Link>
                </div>
              </div>
            </div>

            {/* Skills Dropdown */}
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
                    href="/skills"
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

            {/* Education Dropdown */}
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
                Education
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {education.map((edu) => (
                  <Link
                    key={edu.name}
                    href={edu.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {edu.name}
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

        {/* Mobile Navigation */}
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
                <p className="font-medium text-neutral-900 py-2">Education</p>
                {education.map((edu) => (
                  <Link
                    key={edu.name}
                    href={edu.href}
                    className="block py-1 pl-4 text-neutral-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {edu.name}
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