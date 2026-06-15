import Layout from '../components/layout/Layout'

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 1, 2026</p>
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400">
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account Registration</h2><p>You must be 18+ to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Orders & Payment</h2><p>All prices are in USD and exclude applicable taxes. We reserve the right to cancel any order due to pricing errors, stock unavailability, or suspected fraud. Payment is due at checkout.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Shipping & Delivery</h2><p>Estimated delivery times are provided at checkout. We are not liable for delays caused by carriers or customs. Risk of loss passes to you upon delivery.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Returns & Refunds</h2><p>Our 30-day return policy applies to unused items in original packaging. Refunds are processed within 5-7 business days of receiving the return.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Intellectual Property</h2><p>All content on this site — including images, text, logos, and designs — is the property of BizRank and protected by applicable copyright laws.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Limitation of Liability</h2><p>BizRank shall not be liable for any indirect, incidental, or consequential damages arising from your use of this site or our products.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Changes to Terms</h2><p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact</h2><p>Questions? Email legal@bizrankup.com or visit our Contact page.</p></div>
        </div>
      </div>
    </Layout>
  )
}
