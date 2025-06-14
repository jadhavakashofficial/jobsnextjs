'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search jobs..."
        className="px-3 py-1 text-sm border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 text-sm rounded-r-md hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  )
}