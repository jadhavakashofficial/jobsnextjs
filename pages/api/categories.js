export default async function handler(req, res) {
  try {
    const resp = await fetch('https://www.classicjobs.in/ak/wp-json/wp/v2/categories?per_page=100');
    if (!resp.ok) throw new Error('Failed to fetch categories');
    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('Categories API error', e);
    res.status(500).json([]);
  }
}
