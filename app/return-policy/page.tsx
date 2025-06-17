import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return & Refund Policy | DankDealsMN",
  description: "DankDealsMN Return & Refund Policy - Information about returns, refunds, and product satisfaction guarantees.",
  robots: "index, follow"
}

export default function ReturnPolicyPage() {
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
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Refund Process</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Reporting Issues</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Time Limit:</strong> Issues must be reported within 24 hours of delivery</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Contact Methods:</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Phone: (612) 930-1390</li>
                    <li>Text: (612) 930-1390</li>
                    <li>Email: support@dankdealsmn.com</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Required Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When reporting an issue, please provide:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Order number and delivery date</li>
                  <li>Detailed description of the problem</li>
                  <li>Photos of defective or damaged products (if applicable)</li>
                  <li>Product batch numbers (found on packaging)</li>
                  <li>Your contact information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Investigation Process</h3>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300">
                  <li>We will review your complaint within 24 hours</li>
                  <li>Photos and documentation will be examined</li>
                  <li>We may request additional information or clarification</li>
                  <li>Products may be tested or inspected by our quality team</li>
                  <li>Decision will be communicated within 48-72 hours</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Refund Methods and Timeline</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Refund Methods</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Cash refunds:</strong> For cash payments, in-person or through delivery driver</li>
                  <li><strong>Account credit:</strong> Applied to your customer account for future orders</li>
                  <li><strong>Bank transfer:</strong> Direct deposit to your bank account (if payment method allows)</li>
                  <li><strong>Store credit:</strong> Credit for future purchases with extended validity</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Refund Timeline</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Cash refunds:</strong> 1-2 business days</li>
                    <li><strong>Account credit:</strong> Immediate upon approval</li>
                    <li><strong>Bank transfers:</strong> 3-5 business days</li>
                    <li><strong>Store credit:</strong> Immediate upon approval</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.3 Refund Amounts</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Full refund:</strong> Purchase price plus taxes</li>
                  <li><strong>Delivery fees:</strong> Refunded if error was on our part</li>
                  <li><strong>Partial refunds:</strong> For partial order issues</li>
                  <li><strong>Processing fees:</strong> No additional processing fees charged</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Product Replacement Policy</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 When Replacements Are Offered</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Defective products (subject to availability)</li>
                  <li>Order errors on our part</li>
                  <li>Damaged products during delivery</li>
                  <li>Incorrect product specifications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Replacement Process</h3>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300">
                  <li>Product evaluation and approval for replacement</li>
                  <li>Schedule new delivery at no additional charge</li>
                  <li>Same product replaced (if available) or equivalent substitute</li>
                  <li>Customer approval required for substitutions</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.3 Product Availability</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  If the exact product is not available for replacement, we will offer:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Equivalent product of similar type and potency</li>
                  <li>Product of equal or greater value</li>
                  <li>Full refund if no suitable replacement is available</li>
                  <li>Customer choice between replacement options</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Order Cancellation Policy</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.1 Before Order Processing</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Full refund available if cancelled before order is prepared and dispatched:</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Order confirmation stage</li>
                    <li>Payment processing stage</li>
                    <li>Before products are pulled from inventory</li>
                    <li>Before driver is dispatched</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.2 After Order Processing</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Order prepared:</strong> Cancellation fee may apply</li>
                  <li><strong>Driver dispatched:</strong> Delivery fee charged</li>
                  <li><strong>En route to customer:</strong> Minimum delivery fee charged</li>
                  <li><strong>Delivery attempted:</strong> Full delivery fee charged</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.3 Customer No-Show Policy</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Customer must be available during delivery window</li>
                  <li>Failed delivery due to customer unavailability: delivery fee charged</li>
                  <li>Products returned to inventory if delivery cannot be completed</li>
                  <li>Refund issued minus delivery and handling fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Quality Guarantee</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.1 Product Quality Standards</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We guarantee that all products meet the following standards:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Safety testing:</strong> All products tested for contaminants</li>
                  <li><strong>Potency accuracy:</strong> THC/CBD content within regulatory tolerance</li>
                  <li><strong>Freshness:</strong> Products within expiration dates</li>
                  <li><strong>Proper storage:</strong> Maintained at appropriate conditions</li>
                  <li><strong>Packaging integrity:</strong> Sealed and tamper-evident packaging</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.2 Customer Satisfaction</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  While we cannot accept returns for preference-based reasons, we value customer feedback and will work with you to ensure satisfaction within the bounds of regulatory compliance and safety requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Dispute Resolution</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.1 Internal Resolution</h3>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Contact customer service within 24 hours of delivery</li>
                  <li>Provide detailed complaint with supporting documentation</li>
                  <li>Allow 48-72 hours for investigation and response</li>
                  <li>Work with our team to find a satisfactory resolution</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.2 Escalation Process</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Manager review:</strong> Escalation to management team</li>
                  <li><strong>Third-party mediation:</strong> Independent dispute resolution</li>
                  <li><strong>Regulatory complaint:</strong> Contact Minnesota Cannabis Control Board</li>
                  <li><strong>Legal remedies:</strong> As outlined in Terms of Service</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.3 Documentation Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Keep all original packaging and products until issue is resolved</li>
                  <li>Take photos of any defects or damage</li>
                  <li>Preserve order confirmation and delivery records</li>
                  <li>Document all communications with our team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Special Circumstances</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.1 Medical Hardship</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  In cases of documented medical hardship or severe adverse reactions, we may consider exceptions to our return policy on a case-by-case basis.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.2 Product Recalls</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Full refund for recalled products</li>
                  <li>Immediate notification to affected customers</li>
                  <li>Coordination with regulatory authorities</li>
                  <li>Safe disposal instructions provided</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.3 Emergency Situations</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  In emergency situations (natural disasters, health emergencies, etc.), special refund and return accommodations may be made at management discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For all return, refund, and product quality issues:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com Customer Service</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Phone/Text: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Email: support@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Hours: 10:00 AM - 10:00 PM, 7 days a week</p>
                  <p className="text-gray-700 dark:text-gray-300">Response Time: Within 24 hours</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Emergency Contact</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  For urgent product safety issues or adverse reactions, contact us immediately at (612) 930-1390 or seek appropriate medical attention.
                </p>
              </section>

              <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Our Commitment to You
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  While regulatory requirements limit our ability to accept returns, we are committed to providing high-quality products and excellent customer service. We stand behind our products and will work diligently to resolve any legitimate quality or safety concerns.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We appreciate your understanding of the unique challenges in the cannabis industry and thank you for choosing DankDealsMN for your cannabis needs.
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