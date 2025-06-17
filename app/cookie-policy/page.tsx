import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | DankDealsMN",
  description: "DankDealsMN Cookie Policy - Information about how we use cookies and tracking technologies on our website.",
  robots: "index, follow"
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Cookie Policy
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners about how their site is being used.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  DankDealsMN.com uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and provide personalized content and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Types of Cookies We Use</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Strictly Necessary Cookies</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">These cookies are essential for the basic functionality of our website and cannot be disabled:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Session cookies:</strong> Maintain your shopping cart and login session</li>
                    <li><strong>Security cookies:</strong> Protect against fraudulent activity and security threats</li>
                    <li><strong>Age verification cookies:</strong> Remember that you have verified your age (21+)</li>
                    <li><strong>Preference cookies:</strong> Remember your language and display preferences</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Performance and Analytics Cookies</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">These cookies help us understand how visitors interact with our website:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Google Analytics:</strong> Tracks website usage, page views, and user behavior</li>
                    <li><strong>Performance monitoring:</strong> Identifies technical issues and site performance</li>
                    <li><strong>Heatmap tools:</strong> Shows how users navigate and interact with pages</li>
                    <li><strong>Error tracking:</strong> Helps us identify and fix website problems</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.3 Functional Cookies</h3>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">These cookies enhance website functionality and user experience:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Location services:</strong> Remember your delivery area preferences</li>
                    <li><strong>Dark mode:</strong> Remember your theme preference</li>
                    <li><strong>Product filters:</strong> Save your menu browsing preferences</li>
                    <li><strong>Chat features:</strong> Enable customer support chat functionality</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.4 Marketing and Advertising Cookies</h3>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">These cookies help us deliver relevant marketing content (with your consent):</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Retargeting pixels:</strong> Show relevant ads on other websites</li>
                    <li><strong>Social media pixels:</strong> Track social media campaign effectiveness</li>
                    <li><strong>Email marketing:</strong> Track email campaign performance</li>
                    <li><strong>Conversion tracking:</strong> Measure marketing campaign success</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Third-Party Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website may contain content from third-party services that set their own cookies:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Analytics Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
                  <li><strong>Google Tag Manager:</strong> Manages various tracking codes</li>
                  <li><strong>Hotjar or similar:</strong> User experience analysis tools</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Social Media Platforms</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Facebook/Meta:</strong> Social sharing and advertising pixels</li>
                  <li><strong>Instagram:</strong> Social media integration</li>
                  <li><strong>Twitter:</strong> Social sharing functionality</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Payment and Security Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Payment processors:</strong> Secure transaction processing</li>
                  <li><strong>Fraud prevention:</strong> Transaction security services</li>
                  <li><strong>Identity verification:</strong> Age and identity confirmation services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. How We Use Cookie Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use information collected through cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Website functionality:</strong> Maintain your session and preferences</li>
                  <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Age verification:</strong> Ensure compliance with 21+ requirements</li>
                  <li><strong>User experience:</strong> Personalize content and improve navigation</li>
                  <li><strong>Analytics:</strong> Understand website usage and optimize performance</li>
                  <li><strong>Marketing:</strong> Deliver relevant content and measure campaign effectiveness</li>
                  <li><strong>Customer support:</strong> Provide better assistance and troubleshooting</li>
                  <li><strong>Legal compliance:</strong> Meet regulatory requirements for cannabis businesses</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Managing Your Cookie Preferences</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Cookie Consent Banner</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When you first visit our website, you'll see a cookie consent banner that allows you to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                  <li>Learn more about our cookie usage</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Browser Settings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You can control cookies through your browser settings:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Chrome:</strong> Settings > Privacy and Security > Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options > Privacy & Security > Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences > Privacy > Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings > Site permissions > Cookies and site data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.3 Opt-Out Tools</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Google Analytics:</strong> Use Google's opt-out browser add-on</li>
                  <li><strong>Advertising cookies:</strong> Visit aboutads.info or youronlinechoices.eu</li>
                  <li><strong>Do Not Track:</strong> Enable in your browser settings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Cookie Retention Periods</h2>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cookie Lifespan:</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Preference cookies:</strong> 1 year</li>
                    <li><strong>Analytics cookies:</strong> 2 years</li>
                    <li><strong>Marketing cookies:</strong> 30-90 days</li>
                    <li><strong>Age verification:</strong> 30 days</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Impact of Disabling Cookies</h2>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Important Notice:</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Disabling certain cookies may affect your ability to use our website:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Essential cookies:</strong> Cannot be disabled - required for basic functionality</li>
                    <li><strong>Shopping cart:</strong> May not save items between sessions</li>
                    <li><strong>Age verification:</strong> May need to verify age repeatedly</li>
                    <li><strong>Preferences:</strong> Settings may not be remembered</li>
                    <li><strong>Security features:</strong> May be less effective</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Mobile App Tracking</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If we develop a mobile application, similar tracking technologies may be used:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>App analytics:</strong> Track app usage and performance</li>
                  <li><strong>Push notifications:</strong> Send order updates and promotions</li>
                  <li><strong>Location services:</strong> Improve delivery experience (with permission)</li>
                  <li><strong>Device identifiers:</strong> Maintain app functionality and security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Cannabis Industry Considerations</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  As a cannabis business, we have additional considerations for data tracking:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Age verification tracking:</strong> Ensure compliance with 21+ laws</li>
                  <li><strong>Regulatory reporting:</strong> Some data may be required by Minnesota cannabis authorities</li>
                  <li><strong>Banking restrictions:</strong> Limited payment processor options may affect tracking</li>
                  <li><strong>Advertising limitations:</strong> Restrictions on cannabis advertising affect marketing cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement security measures to protect cookie and tracking data:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Encryption:</strong> Secure transmission and storage of cookie data</li>
                  <li><strong>Access controls:</strong> Limited access to tracking information</li>
                  <li><strong>Regular audits:</strong> Review of tracking implementations and data usage</li>
                  <li><strong>Secure cookies:</strong> Use of secure and httpOnly flags where appropriate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Updates to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may update this Cookie Policy periodically to reflect changes in:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Our use of cookies and tracking technologies</li>
                  <li>Legal requirements and industry standards</li>
                  <li>Website functionality and features</li>
                  <li>Third-party service integrations</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  We will notify you of significant changes through our website or other appropriate means.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Contact Us About Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions about our use of cookies or want to exercise your rights:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com Privacy Team</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Email: privacy@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Phone: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Address: Minneapolis-St. Paul, Minnesota</p>
                </div>
              </section>

              <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Consent
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings or contacting us directly. For more information about how we handle your personal data, please see our Privacy Policy.
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