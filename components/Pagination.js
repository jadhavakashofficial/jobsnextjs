import Link from 'next/link'

export default function Pagination({ current = 1, total = 1 }) {
  if (total <= 1) return null
  const pages = []
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return (
    <nav className="flex justify-center mt-8 space-x-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? '/blog' : `/blog/page/${p}`}
          className={`px-3 py-1 rounded border text-sm ${
            p === current ? 'bg-primary-600 text-white' : 'bg-white'
          }`}
          prefetch={false}
        >
          {p}
        </Link>
      ))}
    </nav>
  )
}
