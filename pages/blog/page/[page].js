import PostCard from '../../../components/PostCard'
import Pagination from '../../../components/Pagination'
import MetaSEO from '../../../components/MetaSEO'
import { getAllPosts } from '../../../lib/wp'

export default function BlogPage({ posts, totalPages, current }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title={`Page ${current}`} />
      <h1 className="text-3xl font-bold mb-6">Posts - Page {current}</h1>
      {posts.length === 0 && <p>No posts found</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Pagination current={current} total={totalPages} />
    </div>
  )
}

export async function getStaticPaths() {
  const { totalPages } = await getAllPosts(1, 10)
  const paths = []
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ params: { page: i.toString() } })
  }
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const pageNum = parseInt(params.page, 10)
  const { data, totalPages } = await getAllPosts(pageNum, 10)
  return {
    props: { posts: data || [], totalPages, current: pageNum },
    revalidate: 60,
  }
}
