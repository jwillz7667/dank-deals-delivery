import Header from "@/components/header"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery Policy | DankDealsMN",
  description: "DankDealsMN Delivery Policy - Information about our cannabis delivery service, areas, schedules, and requirements.",
  robots: "index, follow"
}

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Delivery Policy
            </h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Delivery Service Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  DankDealsMN.com provides legal cannabis delivery services throughout the Minneapolis-St. Paul metropolitan area and surrounding Minnesota communities. Our delivery service operates in full compliance with Minnesota cannabis laws and regulations.
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Licensed cannabis delivery service</li>
                  <li>Professional, discreet delivery drivers</li>
                  <li>Secure, tracked delivery process</li>
                  <li>Same-day and next-day delivery options</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Delivery Areas</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Primary Service Areas</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Twin Cities Metro Area:</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Minneapolis</li>
                    <li>St. Paul</li>
                    <li>Bloomington</li>
                    <li>Plymouth</li>
                    <li>Minnetonka</li>
                    <li>Edina</li>
                    <li>Burnsville</li>
                    <li>Eagan</li>
                    <li>Brooklyn Park</li>
                    <li>Woodbury</li>
                    <li>Maple Grove</li>
                    <li>Coon Rapids</li>
                    <li>Blaine</li>
                    <li>Lakeville</li>
                    <li>And surrounding communities</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Service Area Verification</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Enter your address during checkout to confirm delivery availability</li>
                  <li>Service areas may expand over time - check our website for updates</li>
                  <li>Special arrangements may be available for areas outside our standard zone</li>
                  <li>All deliveries must be within Minnesota state boundaries</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Delivery Schedule and Hours</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Operating Hours</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Monday - Sunday:</strong> 10:00 AM - 10:00 PM</li>
                    <li><strong>Holidays:</strong> Modified hours may apply</li>
                    <li><strong>Same-day delivery:</strong> Orders placed before 8:00 PM</li>
                    <li><strong>Next-day delivery:</strong> Orders placed after 8:00 PM</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Delivery Windows</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Standard delivery:</strong> 2-4 hour delivery window</li>
                  <li><strong>Express delivery:</strong> 1-2 hour delivery window (additional fee applies)</li>
                  <li><strong>Scheduled delivery:</strong> Choose specific time slots (when available)</li>
                  <li>We will contact you 30-60 minutes before arrival</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Ordering Process</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 How to Order</h3>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Browse our online menu at DankDealsMN.com</li>
                  <li>Add items to your cart</li>
                  <li>Proceed to checkout and verify your delivery address</li>
                  <li>Provide required customer information</li>
                  <li>Confirm your order and delivery preferences</li>
                  <li>Receive order confirmation via text/email</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Alternative Ordering Methods</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Text orders:</strong> Send your order via text to (612) 930-1390</li>
                  <li><strong>Phone orders:</strong> Call during business hours</li>
                  <li>All orders require customer verification regardless of ordering method</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Delivery Requirements</h2>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Mandatory Age Verification</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Valid government-issued photo ID required</strong></li>
                    <li>Customer must be 21 years of age or older</li>
                    <li>ID will be checked and verified at delivery</li>
                    <li>Expired IDs will not be accepted</li>
                    <li>The person receiving delivery must match the ID</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Delivery Location Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Private residences only</strong> - no public places or businesses</li>
                  <li>Customer must be present to receive delivery personally</li>
                  <li>Safe, accessible location for our delivery driver</li>
                  <li>Well-lit area if delivering after dark</li>
                  <li>Clear address markings and delivery instructions</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.3 Customer Availability</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Customer must be available during delivery window</li>
                  <li>Phone must be accessible for driver contact</li>
                  <li>If customer is unavailable, delivery will be rescheduled</li>
                  <li>Multiple failed delivery attempts may result in order cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Delivery Fees and Minimums</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.1 Delivery Charges</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li><strong>Standard delivery:</strong> $5.00 delivery fee</li>
                    <li><strong>Express delivery:</strong> $10.00 delivery fee</li>
                    <li><strong>Free delivery:</strong> Orders over $100</li>
                    <li><strong>Distance charges:</strong> May apply for deliveries outside primary zones</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.2 Order Minimums</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Minimum order:</strong> $25.00 (before taxes and fees)</li>
                  <li><strong>Express delivery minimum:</strong> $50.00</li>
                  <li>Minimums help ensure efficient delivery operations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Payment Methods</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.1 Accepted Payment Methods</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Cash:</strong> Exact change preferred</li>
                  <li><strong>Debit cards:</strong> Pin-based transactions</li>
                  <li><strong>Digital payments:</strong> Venmo, CashApp (when available)</li>
                  <li><strong>Credit cards:</strong> Limited availability due to federal restrictions</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7.2 Payment at Delivery</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Payment is collected at time of delivery</li>
                  <li>Tips are appreciated but not required</li>
                  <li>Receipt provided for all transactions</li>
                  <li>No payment = no delivery (order will be cancelled)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Delivery Safety and Security</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.1 Driver Safety Protocols</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Professional, trained delivery drivers</li>
                  <li>Background checked and licensed staff</li>
                  <li>GPS tracking on all delivery vehicles</li>
                  <li>Drivers carry minimal cash for safety</li>
                  <li>Real-time communication with dispatch</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.2 Product Security</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Products transported in secure, locked containers</li>
                  <li>Tamper-evident packaging maintained until delivery</li>
                  <li>Chain of custody documentation</li>
                  <li>Products stored at appropriate temperatures during transport</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Delivery Cancellations and Changes</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.1 Customer Cancellations</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Before dispatch:</strong> Full refund available</li>
                  <li><strong>After dispatch:</strong> Cancellation fees may apply</li>
                  <li><strong>En route:</strong> Customer responsible for delivery fee</li>
                  <li>Contact us immediately at (612) 930-1390 to cancel</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.2 Order Modifications</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Changes possible before order is dispatched</li>
                  <li>Additional items may extend delivery time</li>
                  <li>Removing items may affect delivery minimums</li>
                  <li>Address changes require verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Weather and Emergency Delays</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10.1 Weather-Related Delays</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Severe weather may cause delivery delays</li>
                  <li>Safety of drivers and customers is our priority</li>
                  <li>Customers will be notified of weather delays</li>
                  <li>Orders may be rescheduled for safety reasons</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10.2 Emergency Situations</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Service may be suspended during emergencies</li>
                  <li>Public safety emergencies take priority</li>
                  <li>Customers notified as soon as possible</li>
                  <li>Make-up deliveries scheduled when safe</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Delivery Tracking and Communication</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11.1 Order Tracking</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Real-time order status updates</li>
                  <li>SMS notifications at key delivery milestones</li>
                  <li>Estimated arrival time updates</li>
                  <li>Driver contact information when en route</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11.2 Customer Communication</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Pre-delivery confirmation calls/texts</li>
                  <li>30-60 minute arrival window notifications</li>
                  <li>Driver arrival announcements</li>
                  <li>Post-delivery confirmation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Special Delivery Instructions</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12.1 Apartment and Condo Deliveries</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Provide building entry codes or gate access</li>
                  <li>Include specific unit numbers and floor</li>
                  <li>Customer must meet driver at building entrance if required</li>
                  <li>Doorman/concierge cannot accept deliveries</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12.2 Discretion and Privacy</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Unmarked delivery vehicles for discretion</li>
                  <li>Professional, discrete delivery service</li>
                  <li>Privacy respected during all interactions</li>
                  <li>Products delivered in plain, sealed bags</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Customer Service and Support</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For delivery-related questions, concerns, or support:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300"><strong>DankDealsMN.com Customer Service</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Phone/Text: (612) 930-1390</p>
                  <p className="text-gray-700 dark:text-gray-300">Email: support@dankdealsmn.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Hours: 10:00 AM - 10:00 PM, 7 days a week</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">13.1 Common Issues</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Delivery delays:</strong> Weather, traffic, high demand</li>
                  <li><strong>Product issues:</strong> Damaged or incorrect items</li>
                  <li><strong>Payment problems:</strong> Card declined, cash shortage</li>
                  <li><strong>Access issues:</strong> Gated communities, apartment buildings</li>
                </ul>
              </section>

              <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-400">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Commitment to Excellence
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  At DankDealsMN.com, we are committed to providing safe, reliable, and professional cannabis delivery services. Our goal is to exceed your expectations while maintaining full compliance with Minnesota cannabis laws and regulations. Thank you for choosing DankDealsMN for your cannabis delivery needs.
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