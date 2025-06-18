"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEffect } from "react"

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | DankDealsMN"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'DankDealsMN Privacy Policy - Learn how we collect, use, and protect your personal information in compliance with Minnesota and federal privacy laws.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  DankDealsMN.com ("we," "us," "our," or "Company") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in connection with our cannabis delivery business operating in Minnesota.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By using our services, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">We may collect the following personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Name, address, phone number, and email address</li>
                  <li>Date of birth and government-issued ID information (required for age verification)</li>
                  <li>Payment information (processed securely through third-party processors)</li>
                  <li>Order history and preferences</li>
                  <li>Location data for delivery purposes</li>
                  <li>Communication records (texts, emails, customer service interactions)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Technical Information</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>IP address, browser type, and device information</li>
                  <li>Website usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Geolocation data (with your consent)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.3 Cannabis-Specific Information</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Medical recommendations or prescriptions (if applicable)</li>
                  <li>Product preferences and consumption patterns</li>
                  <li>Compliance and regulatory information as required by Minnesota law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Processing and fulfilling orders</li>
                  <li>Age verification and regulatory compliance</li>
                  <li>Payment processing and fraud prevention</li>
                  <li>Delivery coordination and logistics</li>
                  <li>Customer service and support</li>
                  <li>Marketing communications (with your consent)</li>
                  <li>Improving our products and services</li>
                  <li>Compliance with Minnesota cannabis regulations and record-keeping requirements</li>
                  <li>Legal compliance and law enforcement cooperation when required</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Information Sharing and Disclosure</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 We may share your information with:</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist with payment processing, delivery, marketing, and website analytics</li>
                  <li><strong>Regulatory Authorities:</strong> Minnesota Cannabis Control Board and other regulatory agencies as required by law</li>
                  <li><strong>Law Enforcement:</strong> When required by court order, subpoena, or applicable law</li>
                  <li><strong>Business Partners:</strong> Authorized delivery partners and vendors (under strict confidentiality agreements)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 We do not sell your personal information to third parties for their marketing purposes.</h3>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure data storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data protection</li>
                  <li>Compliance with PCI DSS standards for payment data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Retention</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with Minnesota cannabis regulations (which may require retention for up to 7 years), resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Access:</strong> Request copies of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your information (subject to legal retention requirements)</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Request transfer of your data in a readable format</li>
                  <li><strong>Restrict Processing:</strong> Request limitation of how we process your information</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  To exercise these rights, contact us at privacy@dankdealsmn.com or (612) 930-1390.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and provide personalized content. You can control cookie settings through your browser preferences. For more information, see our Cookie Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Age Verification and Minors</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Our services are strictly for adults 21 years of age or older. We do not knowingly collect personal information from minors. If we discover that a minor has provided personal information, we will promptly delete such information and terminate any associated accounts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Minnesota-Specific Disclosures</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  As a Minnesota cannabis business, we comply with all state-specific requirements:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>All transactions are reported to the Minnesota Cannabis Control Board as required</li>
                  <li>Customer information may be shared with regulatory authorities for compliance purposes</li>
                  <li>We maintain records as required by Minnesota Statutes Chapter 342</li>
                  <li>All deliveries are restricted to Minnesota residents with valid identification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Third-Party Links</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Email: privacy@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Phone: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Address: Minneapolis-St. Paul, Minnesota</p>
                </div>
              </section>

              <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Important Cannabis-Related Notice
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Cannabis remains federally illegal under the Controlled Substances Act. While Minnesota has legalized adult-use cannabis, federal law enforcement agencies may still pursue enforcement actions. By using our services, you acknowledge this legal landscape and assume any associated risks. We comply with all applicable Minnesota state laws and regulations governing cannabis businesses.
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