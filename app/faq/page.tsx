import Header from "@/components/header"
import Footer from "@/components/footer"
import JsonLd from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ - DankDealsMN.com | Cannabis Delivery Questions",
  description:
    "Find answers to frequently asked questions about cannabis delivery, payment, ID verification, and our services at DankDealsMN.com in Minneapolis & St. Paul.",
  alternates: {
    canonical: "/faq",
  },
}

const faqs = [
  {
    question: "Is cannabis delivery legal in Minnesota?",
    answer:
      "Yes. We operate as a fully licensed and compliant cannabis delivery service in accordance with Minnesota state law. All products are sourced from licensed producers.",
  },
  {
    question: "How do I place an order?",
    answer:
      "It's simple! Browse our online menu, choose your products, and text your complete order to us at (612) 930-1390. We'll reply to confirm and arrange payment.",
  },
  {
    question: "Why do I have to pay before delivery?",
    answer:
      "We require pre-payment for all orders to ensure the safety and security of our drivers. This allows them to carry minimal cash and reduces risk. We accept various secure online payment methods.",
  },
  {
    question: "What are the ID requirements?",
    answer:
      "You must be 21 or older. Upon delivery, our driver will need to see a valid, non-expired state-issued ID. The name and address on the ID must match the name and address on the order.",
  },
  {
    question: "What is your delivery area?",
    answer:
      "We deliver to the entire Minneapolis-St. Paul metro area and many surrounding suburbs. Check our 'Service Areas' in the footer for a list of cities we serve.",
  },
]

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <Header />
      <main className="pt-20 pb-24">
        <section id="faq" className="py-16">
          <JsonLd data={faqSchema} />
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get answers to common questions about our cannabis delivery service in the Twin Cities
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full animate-slide-up">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white/10 backdrop-blur-sm border border-app-green-200/30 mb-4 rounded-xl px-6 hover:bg-white/20 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline text-foreground py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* CTA Section */}
            <div className="mt-16 text-center animate-fade-in">
              <div className="bg-gradient-to-r from-app-green-600/20 to-app-green-800/20 border border-app-green-300/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h3>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our friendly team is here to help! Text or call us directly for personalized assistance with your cannabis delivery order.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="sms:+16129301390?&body=Hi! I have a question about your delivery service.">
                    <Button className="primary-button px-8 py-3 text-lg">
                      Text Your Question
                    </Button>
                  </a>
                  <a href="tel:+16129301390">
                    <Button variant="outline" className="secondary-button px-8 py-3 text-lg">
                      Call (612) 930-1390
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
