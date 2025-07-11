import Link from 'next/link'

export default function PostCard({ post }) {
  const image = post?._embedded?.['wp:featuredmedia']?.[0]
  return (
    <article className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden">
      {image && (
        <img
          src={image.source_url}
          alt={image.alt_text || post.title.rendered}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-2">
          <Link href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
        </h2>
        <div
          className="prose text-sm text-neutral-700 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
      </div>
    </article>
  )
}
