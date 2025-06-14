import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Classic Jobs</h3>
            <p className="text-gray-400 mb-4">
              An Initiative Of Classic Technology To Fill Gap Between Education And Placements
            </p>
            <p className="text-gray-400">
              © 2025 Classic Technology, All Rights Reserved
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/category/it-jobs" className="text-gray-400 hover:text-white">IT Jobs</Link></li>
              <li><Link href="/category/blogs" className="text-gray-400 hover:text-white">Blogs</Link></li>
              <li><Link href="/category/mba-jobs" className="text-gray-400 hover:text-white">MBA Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/classictechak" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="https://www.instagram.com/classictechak/" className="text-gray-400 hover:text-white">
                Instagram
              </a>
              <a href="https://www.youtube.com/@classictechnology" className="text-gray-400 hover:text-white">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}