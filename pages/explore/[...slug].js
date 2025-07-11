import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import MetaSEO from '../../components/MetaSEO'
import { getPostsByFilters } from '../../lib/wp'

export default function ComboPage({ posts, slug, title }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title={title} description={`Jobs for ${title}`} />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {posts.length === 0 && <p>No posts found</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Pagination current={1} total={1} />
    </div>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const parts = params.slug || []
  const [category, location, skill] = parts
  const { data } = await getPostsByFilters({ category, location, tag: skill }, 1, 10)
  const pieces = []
  if (category) pieces.push(category.replace(/-/g, ' '))
  if (location) pieces.push(location.replace(/-/g, ' '))
  if (skill) pieces.push(skill.replace(/-/g, ' '))
  const title = pieces.join(' - ') || 'Jobs'
  return { props: { posts: data || [], slug: parts, title }, revalidate: 60 }
}
