import MetaSEO from '../../components/MetaSEO'
import { getPostBySlug, getAllSlugs } from '../../lib/wp'

export default function PostPage({ post }) {
  if (!post) return <p className="p-8">No post found</p>
  const image = post?._embedded?.['wp:featuredmedia']?.[0]
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <MetaSEO title={post.title.rendered} description={post.excerpt.rendered.replace(/<[^>]+>/g, '')} />
      <h1 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      {image && <img src={image.source_url} alt={image.alt_text || ''} className="w-full mb-6" />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  )
}

export async function getStaticPaths() {
  const slugs = await getAllSlugs()
  const paths = slugs.map((slug) => ({ params: { slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return { props: { post: null }, notFound: true, revalidate: 60 }
  }
  return { props: { post }, revalidate: 60 }
}
