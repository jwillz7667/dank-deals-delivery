import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cannabis Compliance Notice | DankDealsMN",
  description: "DankDealsMN Cannabis Compliance Notice - Information about Minnesota cannabis laws, regulations, and safety requirements.",
  robots: "index, follow"
}

export default function CannabisCompliancePage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Cannabis Compliance Notice
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Minnesota Cannabis Legal Status</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  As of August 1, 2023, adult-use cannabis is legal in Minnesota for individuals 21 years of age and older under Minnesota Statutes Chapter 342. DankDealsMN.com operates as a licensed cannabis delivery service in full compliance with all applicable state laws and regulations.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>License Information:</strong> Licensed by the Minnesota Cannabis Control Board
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Legal Requirements for Customers</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.1 Age Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Must be 21 years of age or older</li>
                  <li>Valid government-issued photo identification required</li>
                  <li>Age verification conducted at time of delivery</li>
                  <li>No exceptions - even medical patients must be 21+ for adult-use products</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.2 Residency Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Must be a Minnesota resident with valid Minnesota address</li>
                  <li>Proof of residency may be required</li>
                  <li>Out-of-state deliveries are prohibited under Minnesota law</li>
                  <li>Temporary visitors cannot purchase adult-use cannabis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Purchase Limits and Restrictions</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Daily Purchase Limits (Per Minnesota Law)</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Flower:</strong> Up to 2 ounces (56 grams) per day</li>
                    <li><strong>Edibles:</strong> Up to 800mg THC per day</li>
                    <li><strong>Concentrates:</strong> Up to 8 grams per day</li>
                    <li><strong>Pre-rolls:</strong> Counted toward flower limit</li>
                    <li><strong>Combination purchases:</strong> Must not exceed equivalent limits</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Possession Limits</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>At home:</strong> Up to 2 pounds (32 ounces) of flower</li>
                  <li><strong>In public:</strong> Up to 2 ounces of flower or equivalent</li>
                  <li><strong>In vehicle:</strong> Must be in sealed, unopened package in trunk or rear area</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Consumption Restrictions</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Where Cannabis Use is Prohibited</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Any public place including parks, sidewalks, restaurants, bars</li>
                  <li>Any place open to the public</li>
                  <li>In any motor vehicle (driver or passenger)</li>
                  <li>On any form of public transportation</li>
                  <li>In any correctional facility</li>
                  <li>On school grounds or at school events</li>
                  <li>In any licensed child care facility</li>
                  <li>On federal property</li>
                  <li>In workplaces (unless specifically permitted by employer)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Where Cannabis Use is Permitted</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Private residences and private property</li>
                  <li>Licensed cannabis consumption establishments (when available)</li>
                  <li>Private events on private property (with permission)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Transportation and Storage</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Vehicle Transportation</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Products must remain in original, sealed packaging</li>
                  <li>Must be stored in trunk or rear cargo area</li>
                  <li>Cannot be accessible to driver or passengers</li>
                  <li>Open containers are prohibited in vehicles</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Home Storage Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Must be kept in a secure location away from minors</li>
                  <li>Locked storage recommended for households with children</li>
                  <li>Original packaging with labels must be maintained</li>
                  <li>Proper storage conditions to maintain product integrity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Driving and Cannabis</h2>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">ZERO TOLERANCE FOR IMPAIRED DRIVING</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>It is illegal to drive while under the influence of cannabis</li>
                    <li>No legal limit - any impairment can result in DUI charges</li>
                    <li>Blood or urine tests may be administered</li>
                    <li>Penalties include license suspension, fines, and potential jail time</li>
                    <li>Enhanced penalties for multiple offenses</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Health and Safety Warnings</h2>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Required Health Warnings</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Pregnancy and Nursing:</strong> Cannabis use during pregnancy may harm fetal development</li>
                    <li><strong>Mental Health:</strong> May worsen anxiety, depression, or other mental health conditions</li>
                    <li><strong>Impairment:</strong> Can impair judgment, coordination, and reaction time</li>
                    <li><strong>Addiction Risk:</strong> Cannabis can be habit-forming and may lead to dependency</li>
                    <li><strong>Youth Risk:</strong> Particularly harmful to developing brains (under 25)</li>
                    <li><strong>Respiratory:</strong> Smoking cannabis may harm lung health</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Product Safety and Testing</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.1 Mandatory Testing Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>All products tested for potency (THC/CBD levels)</li>
                  <li>Tested for harmful pesticides and contaminants</li>
                  <li>Heavy metals testing (lead, mercury, arsenic, cadmium)</li>
                  <li>Microbial testing for bacteria, yeast, and mold</li>
                  <li>Residual solvents testing for concentrates</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.2 Packaging and Labeling</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Child-resistant packaging required by law</li>
                  <li>Clear labeling of THC/CBD content</li>
                  <li>Batch tracking numbers for product traceability</li>
                  <li>Required health warnings on all packages</li>
                  <li>Expiration dates and storage instructions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Regulatory Compliance</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.1 Minnesota Cannabis Control Board Oversight</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Licensed and regulated by the Minnesota Cannabis Control Board</li>
                  <li>Subject to regular inspections and audits</li>
                  <li>Seed-to-sale tracking of all products</li>
                  <li>Mandatory reporting of all transactions</li>
                  <li>Compliance with all state regulations and guidelines</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.2 Record Keeping</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Customer information maintained for regulatory compliance</li>
                  <li>Transaction records kept for minimum 3 years</li>
                  <li>Product batch information tracked from cultivation to sale</li>
                  <li>Delivery logs and verification records maintained</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Federal Law Considerations</h2>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border-l-4 border-orange-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Federal vs. State Law Conflict</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Cannabis remains federally illegal under the Controlled Substances Act</li>
                    <li>Federal agencies may enforce federal laws regardless of state legalization</li>
                    <li>Banking and financial services may be limited due to federal restrictions</li>
                    <li>Travel across state lines with cannabis is federally prohibited</li>
                    <li>Federal property (airports, military bases) remain off-limits</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Penalties for Violations</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10.1 Minnesota State Penalties</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Underage possession:</strong> Misdemeanor, fines up to $300</li>
                  <li><strong>Public consumption:</strong> Petty misdemeanor, $300 fine</li>
                  <li><strong>Driving under influence:</strong> Gross misdemeanor to felony</li>
                  <li><strong>Providing to minors:</strong> Felony charges possible</li>
                  <li><strong>Exceeding possession limits:</strong> Misdemeanor to felony based on amount</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10.2 License Violations</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Selling to unlicensed retailers</li>
                  <li>Operating without proper licensing</li>
                  <li>Failure to track products in state system</li>
                  <li>Violations can result in license suspension or revocation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Social Equity and Expungement</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Minnesota's cannabis law includes provisions for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Automatic expungement of certain cannabis-related convictions</li>
                  <li>Social equity programs for communities disproportionately impacted by prohibition</li>
                  <li>Priority licensing for social equity applicants</li>
                  <li>Community reinvestment programs</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Resources and Support</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12.1 Regulatory Information</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Minnesota Cannabis Control Board:</strong> mn.gov/cannabis</li>
                  <li><strong>Laws and Regulations:</strong> Minnesota Statutes Chapter 342</li>
                  <li><strong>License Lookup:</strong> Verify licensed businesses on state website</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12.2 Health and Safety Resources</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Minnesota Department of Health:</strong> Cannabis health information</li>
                  <li><strong>Substance abuse resources:</strong> 1-800-WORKPLACE</li>
                  <li><strong>Mental health support:</strong> Crisis Text Line - Text HOME to 741741</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact for Compliance Questions</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For questions about cannabis laws, regulations, or compliance issues:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com Compliance Officer</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Email: compliance@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Phone: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Address: Minneapolis-St. Paul, Minnesota</p>
                </div>
              </section>

              <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Important Notice
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This compliance notice is for informational purposes only and does not constitute legal advice. Cannabis laws are complex and subject to change. Customers are responsible for understanding and complying with all applicable federal, state, and local laws.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  For the most current information on Minnesota cannabis laws, please visit the Minnesota Cannabis Control Board website at mn.gov/cannabis.
                </p>
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