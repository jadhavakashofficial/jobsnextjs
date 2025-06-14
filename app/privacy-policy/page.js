export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            At Classic Jobs, we are committed to protecting your privacy. We collect minimal information necessary to provide our job listing services:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Basic usage analytics to improve our website</li>
            <li>Email addresses for job alerts (if you subscribe)</li>
            <li>Search queries to provide better job recommendations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the collected information for:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Providing relevant job opportunities</li>
            <li>Improving our website functionality</li>
            <li>Sending job alerts (only if you opt-in)</li>
            <li>Understanding user preferences to enhance our services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Secure data transmission using HTTPS</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal information</li>
            <li>No sharing of personal data with third parties without consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies to enhance your browsing experience. These cookies help us:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Remember your preferences</li>
            <li>Analyze website traffic</li>
            <li>Provide personalized content</li>
          </ul>
          <p className="text-gray-700">
            You can disable cookies in your browser settings, but this may affect website functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
          <p className="text-gray-700 mb-4">
            Our website contains links to external job portals and company websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Unsubscribe from our communications at any time</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-2">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> contact@classicjobs.in
          </p>
          <p className="text-gray-700">
            <strong>Website:</strong> https://classicjobs.in
          </p>
        </section>
      </div>
    </div>
  )
}