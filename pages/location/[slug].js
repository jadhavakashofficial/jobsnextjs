import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import MetaSEO from '../../components/MetaSEO'
import { getPostsByLocation } from '../../lib/wp'

export default function LocationPage({ posts, totalPages, slug }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title={slug} description={`Jobs in ${slug}`} />
      <h1 className="text-3xl font-bold mb-6">Location: {slug}</h1>
      {posts.length === 0 && <p>No posts found</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Pagination current={1} total={totalPages} />
    </div>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data, totalPages } = await getPostsByLocation(params.slug, 1, 10)
  return {
    props: { posts: data || [], totalPages, slug: params.slug },
    revalidate: 60,
  }
}
