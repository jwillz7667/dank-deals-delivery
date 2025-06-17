import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return & Refund Policy | DankDealsMN",
  description: "DankDealsMN Return & Refund Policy - Information about returns, refunds, and product satisfaction guarantees.",
  robots: "index, follow"
}

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Return & Refund Policy
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Important Notice</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Due to the nature of cannabis products and regulatory requirements, our return and refund policy differs from traditional retail businesses. This policy complies with Minnesota cannabis laws and ensures product safety and integrity.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Please read this policy carefully before placing your order.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. General Return Policy</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.1 Final Sale Policy</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>All cannabis product sales are final once delivery is completed and accepted.</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Cannabis products cannot be returned for refund or exchange after delivery</li>
                    <li>This policy is in place for health, safety, and regulatory compliance reasons</li>
                    <li>Products are considered accepted once payment is completed and delivery is made</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.2 Regulatory Requirements</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Minnesota cannabis regulations prohibit the return of cannabis products to retail establishments once they leave our possession. This is to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Maintain product integrity and chain of custody</li>
                  <li>Prevent contamination and ensure consumer safety</li>
                  <li>Comply with state tracking and inventory requirements</li>
                  <li>Meet health department standards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Exceptions to Final Sale Policy</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Defective Products</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">We will provide refunds or replacements for products that are:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Contaminated:</strong> Visible mold, bacteria, or foreign substances</li>
                    <li><strong>Damaged packaging:</strong> Broken seals, damaged containers, or compromised packaging</li>
                    <li><strong>Incorrect potency:</strong> Significant deviation from labeled THC/CBD content</li>
                    <li><strong>Expired products:</strong> Products past their expiration date</li>
                    <li><strong>Manufacturing defects:</strong> Vape cartridges that don't function, broken edibles</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Order Errors</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If we make an error with your order, we will make it right:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Wrong products delivered:</strong> Different items than what you ordered</li>
                  <li><strong>Incorrect quantities:</strong> More or fewer items than ordered</li>
                  <li><strong>Missing items:</strong> Items paid for but not received</li>
                  <li><strong>Delivery errors:</strong> Products intended for another customer</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For all return, refund, and product quality issues:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com Customer Service</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Phone/Text: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Email: support@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Hours: 10:00 AM - 10:00 PM, 7 days a week</p>
                  <p className="text-gray-700 dark:text-gray-300">Response Time: Within 24 hours</p>
                </div>
              </section>

              <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Our Commitment to You
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  While regulatory requirements limit our ability to accept returns, we are committed to providing high-quality products and excellent customer service. We stand behind our products and will work diligently to resolve any legitimate quality or safety concerns.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 