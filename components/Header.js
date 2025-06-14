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

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Classic Jobs</h1>
            <span className="ml-2 text-sm text-gray-600">Top IT Jobs For Freshers</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium">
                Batch-wise
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {batches.map((batch) => (
                  <Link
                    key={batch.name}
                    href={batch.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {batch.name}
                  </Link>
                ))}
              </div>
            </div>

            <SearchBox />
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}