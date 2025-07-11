import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import MetaSEO from '../../components/MetaSEO'
import { searchPosts } from '../../lib/wp'

export default function BatchPage({ posts, totalPages, year }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title={`Batch ${year}`} description={`Jobs for ${year} batch graduates`} />
      <h1 className="text-3xl font-bold mb-6">Batch: {year}</h1>
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
  const years = [2026, 2025, 2024, 2023, 2022, 2021]
  return { paths: years.map((y) => ({ params: { year: y.toString() } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data, totalPages } = await searchPosts(params.year, 1, 10)
  return {
    props: { posts: data || [], totalPages, year: params.year },
    revalidate: 60,
  }
}
