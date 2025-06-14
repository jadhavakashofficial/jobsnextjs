import Link from 'next/link'

export default function Footer() {
  const categories = [
    { name: 'IT Jobs', href: '/category/it-jobs' },
    { name: 'Blogs', href: '/category/blogs' },
    { name: 'MBA Jobs', href: '/category/mba-jobs' },
  ]

  const batches = [
    { name: '2025 Batch', href: '/batch-wise/2025-batch' },
    { name: '2024 Batch', href: '/batch-wise/2024-batch' },
    { name: '2023 Batch', href: '/batch-wise/2023-batch' },
    { name: '2022 Batch', href: '/batch-wise/2022-batch' },
  ]

  const education = [
    { name: 'BCA & BSC', href: '/education/bca-bsc' },
    { name: 'BE & BTech', href: '/education/be-btech' },
    { name: 'MCA & MSC', href: '/education/mca-msc' },
    { name: 'MBA', href: '/education/mba' },
    { name: 'BBA & BCom', href: '/education/bba-bcom' },
    { name: 'Diploma', href: '/education/diploma' },
  ]

  const pages = [
    { name: 'Recent Posts', href: '/recent-posts' },
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Search', href: '/search' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Classic Jobs</h3>
            <p className="text-gray-400 mb-4">
              An Initiative Of Classic Technology To Fill Gap Between Education And Placements
            </p>
            <p className="text-gray-400 mb-4">
              Find top IT jobs for freshers. Explore BCA, BSc, MCA, BE, BTech, MBA opportunities and start your career journey with us.
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 Classic Technology, All Rights Reserved
            </p>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Job Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h5 className="text-md font-semibold mt-6 mb-3">Batch-wise Jobs</h5>
            <ul className="space-y-2">
              {batches.slice(0, 2).map((batch) => (
                <li key={batch.name}>
                  <Link 
                    href={batch.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {batch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Education</h4>
            <ul className="space-y-2">
              {education.map((edu) => (
                <li key={edu.name}>
                  <Link 
                    href={edu.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {edu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 mb-6">
              {pages.map((page) => (
                <li key={page.name}>
                  <Link 
                    href={page.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/classictechak" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/classictechak/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.182 14.498 2.29 12.892 2.29 11.987c0-2.981 2.445-5.425 5.425-5.425c2.981 0 5.425 2.444 5.425 5.425c0 2.981-2.444 5.425-5.425 5.425z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@classictechnology" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            <div className="mt-6">
              <Link 
                href="/search" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Search Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-gray-400 text-sm">
              <p>Made with ❤️ for job seekers across India</p>
            </div>
            <div className="text-gray-400 text-sm md:text-right">
              <p>🚀 Lightning fast job search powered by Next.js</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}