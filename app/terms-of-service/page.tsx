import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | DankDealsMN",
  description: "DankDealsMN Terms of Service - Legal terms and conditions for using our cannabis delivery services in Minnesota.",
  robots: "index, follow"
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Terms of Service
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Welcome to DankDealsMN.com. These Terms of Service ("Terms") govern your use of our website, mobile application, and cannabis delivery services (collectively, the "Services") operated by DankDealsMN.com ("we," "us," or "our").
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
                </p>
              </section>

              <section className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Age Requirement and Verification</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>YOU MUST BE 21 YEARS OF AGE OR OLDER TO USE THESE SERVICES.</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Valid government-issued photo identification is required for all orders</li>
                  <li>Age verification is required at the time of delivery</li>
                  <li>Failure to provide valid ID will result in order cancellation without refund</li>
                  <li>We reserve the right to refuse service to anyone who cannot provide valid identification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Minnesota Residency Requirement</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Our services are available exclusively to Minnesota residents. You must provide proof of Minnesota residency and a valid Minnesota address for delivery. Out-of-state deliveries are strictly prohibited under Minnesota law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Product Information and Availability</h2>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>All cannabis products are for adult use only</li>
                  <li>Product availability and pricing are subject to change without notice</li>
                  <li>We reserve the right to limit quantities and refuse orders</li>
                  <li>Product descriptions and potency information are provided for informational purposes</li>
                  <li>Effects may vary based on individual tolerance and consumption method</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Ordering and Payment</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Order Process</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Orders can be placed through our website or by text message</li>
                  <li>All orders are subject to verification and approval</li>
                  <li>We reserve the right to cancel any order for any reason</li>
                  <li>Order confirmation does not guarantee product availability</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Payment Terms</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Payment is due at the time of delivery</li>
                  <li>We accept cash and approved electronic payment methods</li>
                  <li>All prices include applicable taxes unless otherwise stated</li>
                  <li>Payment disputes must be raised within 24 hours of delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Delivery Terms</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.1 Delivery Areas and Schedule</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Delivery is available within our designated service areas in Minnesota</li>
                  <li>Delivery hours: 10:00 AM - 10:00 PM, seven days a week</li>
                  <li>Same-day delivery is our goal but not guaranteed</li>
                  <li>Weather and traffic conditions may affect delivery times</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.2 Delivery Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Someone 21+ must be present to receive the delivery</li>
                  <li>Valid photo ID must be presented upon delivery</li>
                  <li>Deliveries cannot be made to public places or businesses</li>
                  <li>Delivery to minors or intoxicated individuals is prohibited</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Returns and Refunds</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Due to the nature of cannabis products and regulatory requirements:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>All sales are final once delivery is completed</li>
                  <li>Returns are only accepted for defective or contaminated products</li>
                  <li>Refund requests must be made within 24 hours of delivery</li>
                  <li>Products must be unopened and in original packaging for returns</li>
                  <li>We reserve the right to inspect returned products</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Prohibited Uses</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Use our services if you are under 21 years of age</li>
                  <li>Provide false information or impersonate another person</li>
                  <li>Resell or redistribute any products purchased through our services</li>
                  <li>Use our services for illegal purposes</li>
                  <li>Interfere with or disrupt our services or servers</li>
                  <li>Use our products in public places where cannabis consumption is prohibited</li>
                  <li>Drive or operate machinery while under the influence</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Health and Safety Warnings</h2>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IMPORTANT HEALTH WARNINGS:</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Cannabis products have not been evaluated by the FDA</li>
                    <li>These products are not intended to diagnose, treat, cure, or prevent any disease</li>
                    <li>Keep all cannabis products away from children and pets</li>
                    <li>Do not use if pregnant, nursing, or if you have a medical condition</li>
                    <li>May cause drowsiness, dizziness, or impaired motor control</li>
                    <li>Do not drive or operate machinery after use</li>
                    <li>Start with low doses and wait before consuming more</li>
                    <li>Effects may be delayed, especially with edibles</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Regulatory Compliance</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We operate in full compliance with Minnesota cannabis laws and regulations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Licensed by the Minnesota Cannabis Control Board</li>
                  <li>All products are tested and tracked according to state requirements</li>
                  <li>We maintain detailed records of all transactions</li>
                  <li>Customer information may be shared with regulatory authorities as required</li>
                  <li>Compliance with federal laws remains the customer's responsibility</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Our liability is limited to the purchase price of the products</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>We do not guarantee specific effects or results from product use</li>
                  <li>You assume all risks associated with cannabis use</li>
                  <li>We are not responsible for adverse reactions or side effects</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Indemnification</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  You agree to indemnify and hold harmless DankDealsMN.com, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services, violation of these Terms, or violation of any applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Privacy and Data Protection</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information. By using our services, you consent to our privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. Termination</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use our services ceases immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. Governing Law and Disputes</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These Terms are governed by Minnesota state law. Any disputes will be resolved through:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Binding arbitration in Minneapolis, Minnesota</li>
                  <li>Arbitration conducted under Minnesota Uniform Arbitration Act</li>
                  <li>You waive the right to participate in class action lawsuits</li>
                  <li>Small claims court disputes under $10,000 may be filed in Minnesota courts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">16. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">17. Severability</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">18. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Email: legal@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Phone: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Address: Minneapolis-St. Paul, Minnesota</p>
                </div>
              </section>

              <section className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Federal Law Disclaimer
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Cannabis remains illegal under federal law. While Minnesota has legalized adult-use cannabis, federal agencies may still enforce federal cannabis prohibition. By using our services, you acknowledge this legal risk and agree that you are solely responsible for compliance with all applicable federal, state, and local laws.
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