import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import MetaSEO from '../../components/MetaSEO'
import SEONavigation from '../../components/SEONavigation'
import { getAllPosts } from '../../lib/wp'

export default function BlogIndex({ posts, totalPages }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title="Blog" description="Latest job posts" />
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      {posts.length === 0 && <p>No posts found</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Pagination current={1} total={totalPages} />
      <div className="mt-12">
        <SEONavigation />
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const { data, totalPages } = await getAllPosts(1, 10)
  return {
    props: { posts: data || [], totalPages },
    revalidate: 60,
  }
}
