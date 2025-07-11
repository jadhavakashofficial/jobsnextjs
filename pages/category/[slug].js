import PostCard from '../../components/PostCard'
import Pagination from '../../components/Pagination'
import MetaSEO from '../../components/MetaSEO'
import { getCategories, getPostsByCategory } from '../../lib/wp'

export default function CategoryPage({ posts, totalPages, category, slug }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <MetaSEO title={category ? category.name : slug} description={`Posts in ${slug}`} />
      <h1 className="text-3xl font-bold mb-6">{category ? category.name : slug}</h1>
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
  const cats = await getCategories()
  const paths = cats.map((c) => ({ params: { slug: c.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data, totalPages } = await getPostsByCategory(params.slug, 1, 10)
  const cats = await getCategories()
  const cat = cats.find((c) => c.slug === params.slug)
  return {
    props: { posts: data || [], totalPages, category: cat || null, slug: params.slug },
    revalidate: 60,
  }
}
