const API_BASE = 'https://www.classicjobs.in/ak/wp-json/wp/v2'

async function fetcher(path) {
  try {
    const res = await fetch(path)
    if (!res.ok) throw new Error('Request failed')
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10)
    const data = await res.json()
    return { data, totalPages }
  } catch (e) {
    console.error('WP fetch error:', e)
    return { data: null, totalPages: 0 }
  }
}

export async function getAllPosts(page = 1, perPage = 10) {
  return fetcher(`${API_BASE}/posts?_embed&per_page=${perPage}&page=${page}`)
}

export async function getPostBySlug(slug) {
  const { data } = await fetcher(`${API_BASE}/posts?slug=${slug}&_embed`)
  return data && data.length > 0 ? data[0] : null
}

export async function getAllSlugs() {
  const { data } = await fetcher(`${API_BASE}/posts?per_page=100&_embed`)
  return data ? data.map((p) => p.slug) : []
}

export async function getCategories() {
  const { data } = await fetcher(`${API_BASE}/categories?per_page=100`)
  return data || []
}

export async function getPostsByCategory(slug, page = 1, perPage = 10) {
  const cats = await fetcher(`${API_BASE}/categories?slug=${slug}`)
  const id = cats.data && cats.data[0] ? cats.data[0].id : null
  if (!id) return { data: [], totalPages: 0 }
  return fetcher(`${API_BASE}/posts?_embed&categories=${id}&per_page=${perPage}&page=${page}`)
}

export async function getPostsByTag(slug, page = 1, perPage = 10) {
  const tags = await fetcher(`${API_BASE}/tags?slug=${slug}`)
  const id = tags.data && tags.data[0] ? tags.data[0].id : null
  if (!id) return { data: [], totalPages: 0 }
  return fetcher(`${API_BASE}/posts?_embed&tags=${id}&per_page=${perPage}&page=${page}`)
}

export async function getPostsByLocation(slug, page = 1, perPage = 10) {
  const locs = await fetcher(`${API_BASE}/location?slug=${slug}`)
  const id = locs.data && locs.data[0] ? locs.data[0].id : null
  if (!id) return { data: [], totalPages: 0 }
  return fetcher(`${API_BASE}/posts?_embed&location=${id}&per_page=${perPage}&page=${page}`)
}

export async function searchPosts(query, page = 1, perPage = 10) {
  const encoded = encodeURIComponent(query)
  return fetcher(`${API_BASE}/posts?_embed&search=${encoded}&per_page=${perPage}&page=${page}`)
}

// Fetch posts matching multiple taxonomies (category, tag, location)
export async function getPostsByFilters(
  { category, tag, location } = {},
  page = 1,
  perPage = 10
) {
  const params = new URLSearchParams({ _embed: '', per_page: perPage, page })

  if (category) {
    const cat = await fetcher(`${API_BASE}/categories?slug=${category}`)
    const id = cat.data && cat.data[0] ? cat.data[0].id : null
    if (id) params.append('categories', id)
  }

  if (tag) {
    const t = await fetcher(`${API_BASE}/tags?slug=${tag}`)
    const id = t.data && t.data[0] ? t.data[0].id : null
    if (id) params.append('tags', id)
  }

  if (location) {
    const loc = await fetcher(`${API_BASE}/location?slug=${location}`)
    const id = loc.data && loc.data[0] ? loc.data[0].id : null
    if (id) params.append('location', id)
  }

  return fetcher(`${API_BASE}/posts?${params.toString()}`)
}
