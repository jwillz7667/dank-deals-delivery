import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility Statement | DankDealsMN",
  description: "DankDealsMN Accessibility Statement - Our commitment to digital accessibility and inclusive design for all users.",
  robots: "index, follow"
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Accessibility Statement
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Commitment to Accessibility</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  DankDealsMN.com is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to information and functionality for all our users.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe that everyone should have access to cannabis products and information, regardless of their abilities or the technologies they use to browse the web.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Standards</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">WCAG 2.1 Principles</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive</li>
                    <li><strong>Operable:</strong> User interface components and navigation must be operable by all users</li>
                    <li><strong>Understandable:</strong> Information and the operation of user interfaces must be understandable</li>
                    <li><strong>Robust:</strong> Content must be robust enough to be interpreted reliably by a wide variety of user agents</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Features</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Visual Accessibility</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>High contrast colors:</strong> We use sufficient color contrast ratios throughout the site</li>
                  <li><strong>Scalable text:</strong> Text can be resized up to 200% without loss of functionality</li>
                  <li><strong>Dark mode support:</strong> Available for users who prefer high contrast or reduced brightness</li>
                  <li><strong>Alternative text:</strong> All images include descriptive alt text</li>
                  <li><strong>Focus indicators:</strong> Clear visual indicators for keyboard navigation</li>
                  <li><strong>Color independence:</strong> Information is not conveyed by color alone</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Keyboard and Navigation</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Keyboard navigation:</strong> All functionality is accessible via keyboard</li>
                  <li><strong>Skip links:</strong> Allow users to skip to main content</li>
                  <li><strong>Logical tab order:</strong> Sequential navigation follows a logical order</li>
                  <li><strong>No keyboard traps:</strong> Users can navigate away from any interface element</li>
                  <li><strong>Consistent navigation:</strong> Navigation structure remains consistent across pages</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Screen Reader Compatibility</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Semantic HTML:</strong> Proper heading structure and landmarks</li>
                  <li><strong>ARIA labels:</strong> Additional context for screen readers where needed</li>
                  <li><strong>Form labels:</strong> All form fields have descriptive labels</li>
                  <li><strong>Status updates:</strong> Important changes are announced to screen readers</li>
                  <li><strong>Content structure:</strong> Clear document outline and organization</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Motor and Mobility</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Large click targets:</strong> Buttons and links meet minimum size requirements</li>
                  <li><strong>Sufficient spacing:</strong> Interactive elements are adequately spaced</li>
                  <li><strong>Drag alternatives:</strong> Alternative methods for drag-and-drop functionality</li>
                  <li><strong>Timeout warnings:</strong> Users are warned before sessions expire</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Assistive Technologies Supported</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website is designed to work with the following assistive technologies:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Screen Readers</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>NVDA (Windows)</li>
                  <li>JAWS (Windows)</li>
                  <li>VoiceOver (macOS/iOS)</li>
                  <li>TalkBack (Android)</li>
                  <li>Dragon NaturallySpeaking (Windows)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser Compatibility</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Chrome (latest versions)</li>
                  <li>Firefox (latest versions)</li>
                  <li>Safari (latest versions)</li>
                  <li>Edge (latest versions)</li>
                  <li>Mobile browsers (iOS Safari, Chrome Mobile)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cannabis-Specific Accessibility Considerations</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Age Verification</h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Clear instructions:</strong> Age verification process explained in simple language</li>
                    <li><strong>Multiple formats:</strong> Options for users with different abilities to verify age</li>
                    <li><strong>Screen reader compatible:</strong> Age verification forms work with assistive technologies</li>
                    <li><strong>Error handling:</strong> Clear error messages and recovery instructions</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Product Information</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Clear descriptions:</strong> Product effects and information in plain language</li>
                  <li><strong>Dosage information:</strong> Clearly formatted and accessible dosage guidelines</li>
                  <li><strong>Health warnings:</strong> Important safety information prominently displayed</li>
                  <li><strong>Alternative formats:</strong> Product information available in multiple formats</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Ordering Process</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Step-by-step guidance:</strong> Clear progression through the ordering process</li>
                  <li><strong>Error prevention:</strong> Input validation and confirmation steps</li>
                  <li><strong>Multiple contact methods:</strong> Phone, text, and online ordering options</li>
                  <li><strong>Order confirmation:</strong> Multiple ways to receive and review order details</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Testing and Evaluation</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We regularly test our website for accessibility using various methods:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Automated Testing</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Regular automated accessibility scans</li>
                  <li>Color contrast ratio testing</li>
                  <li>HTML validation and semantic structure review</li>
                  <li>ARIA implementation verification</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Manual Testing</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Keyboard navigation testing</li>
                  <li>Screen reader testing with multiple tools</li>
                  <li>User testing with people with disabilities</li>
                  <li>Mobile accessibility testing</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Audits</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Periodic professional accessibility audits</li>
                  <li>Compliance verification with accessibility experts</li>
                  <li>User experience testing with diverse user groups</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Known Limitations</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  While we strive for full accessibility, we are aware of some current limitations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Third-party content:</strong> Some embedded content may not meet our accessibility standards</li>
                  <li><strong>Complex interactions:</strong> Some advanced features may require additional assistive technology support</li>
                  <li><strong>Media content:</strong> Some videos may not have complete captions or transcripts</li>
                  <li><strong>Dynamic content:</strong> Real-time updates may not always be announced to screen readers</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  We are actively working to address these limitations in future updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ongoing Improvements</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Accessibility is an ongoing effort. Our improvement initiatives include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Regular audits:</strong> Quarterly accessibility reviews and testing</li>
                  <li><strong>Staff training:</strong> Ongoing education for our development and design teams</li>
                  <li><strong>User feedback:</strong> Continuous improvement based on user input</li>
                  <li><strong>Technology updates:</strong> Implementing new accessibility technologies as they become available</li>
                  <li><strong>Standards compliance:</strong> Staying current with evolving accessibility standards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Alternative Access Methods</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you encounter barriers while using our website, we offer alternative ways to access our services:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Phone Ordering</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Phone:</strong> (612) 930-1390</li>
                    <li><strong>Hours:</strong> 10:00 AM - 10:00 PM, 7 days a week</li>
                    <li><strong>Services:</strong> Full menu access, ordering, and customer support</li>
                    <li><strong>Assistance:</strong> Staff trained to assist customers with accessibility needs</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Text Messaging</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Order via text message at (612) 930-1390</li>
                  <li>Menu information available via text</li>
                  <li>Order confirmation and tracking via SMS</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email Support</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Email orders and inquiries: support@dankdealsmn.com</li>
                  <li>Detailed product information available via email</li>
                  <li>Personalized assistance for accessibility needs</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Feedback and Support</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We welcome your feedback on the accessibility of DankDealsMN.com. If you encounter any accessibility barriers or have suggestions for improvement, please let us know:
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accessibility Contact Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Email:</strong> accessibility@dankdealsmn.com</li>
                    <li><strong>Phone:</strong> (612) 930-1390</li>
                    <li><strong>Address:</strong> Minneapolis-St. Paul, Minnesota</li>
                    <li><strong>Response time:</strong> We aim to respond within 2 business days</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When Contacting Us, Please Include:</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Description of the accessibility barrier you encountered</li>
                  <li>The specific page or feature where you experienced the issue</li>
                  <li>Your operating system and browser information</li>
                  <li>Any assistive technology you were using</li>
                  <li>Suggestions for improvement (if any)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Legal and Compliance Information</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Americans with Disabilities Act (ADA)</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We are committed to compliance with the Americans with Disabilities Act and providing equal access to our digital services for all users.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Section 508</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our website aims to meet Section 508 standards for federal accessibility requirements.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">State and Local Laws</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We comply with Minnesota state accessibility requirements and local disability access laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Updates to This Statement</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  This accessibility statement will be updated as we make improvements to our website and as accessibility standards evolve. We review and update this statement quarterly to ensure it accurately reflects our current accessibility efforts and features.
                </p>
              </section>

              <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Our Promise
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  DankDealsMN.com is committed to providing an inclusive and accessible experience for all users. We believe that digital accessibility is not just a legal requirement, but a moral imperative that ensures everyone can access cannabis products and information with dignity and independence. We will continue to improve our accessibility features and welcome your feedback as we work toward this goal.
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