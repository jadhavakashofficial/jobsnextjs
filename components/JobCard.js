import Link from 'next/link'

export default function JobCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {post.featuredImage?.node?.sourceUrl && (
        <img
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories?.nodes?.map((category) => (
            <span
              key={category.slug}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">
          <Link href={`/job/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        
        <div
          className="text-gray-600 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </span>
          <Link
            href={`/job/${post.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </article>
  )
}