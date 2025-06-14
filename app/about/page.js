export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">About Classic Jobs</h1>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Classic Jobs is an initiative of Classic Technology, dedicated to bridging the gap between education and placements. 
            We specialize in connecting fresh graduates with top IT companies across India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="text-gray-700 mb-4">
            We provide comprehensive job opportunities for students from various educational backgrounds including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>BCA & BSc graduates</li>
            <li>BE & BTech engineers</li>
            <li>MCA & MSc post-graduates</li>
            <li>MBA professionals</li>
            <li>BBA & BCom graduates</li>
            <li>Diploma holders</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">IT Jobs</h3>
              <p className="text-blue-700">Latest opportunities in software development, data science, and technology.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Career Guidance</h3>
              <p className="text-green-700">Expert advice and resources to help you succeed in your career journey.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Industry Insights</h3>
              <p className="text-purple-700">Latest trends and insights from the IT and technology industry.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Classic Jobs?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Curated job opportunities from top companies</li>
            <li>Regular updates on latest openings</li>
            <li>Batch-wise job categorization for easy navigation</li>
            <li>Comprehensive career guidance and tips</li>
            <li>Direct application links to company portals</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-700 mb-2">
            <strong>Company:</strong> Classic Technology
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Website:</strong> classicjobs.in
          </p>
          <p className="text-gray-700">
            Follow us on social media for the latest updates and job opportunities.
          </p>
        </section>
      </div>
    </div>
  )
}