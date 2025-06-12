import Header from "@/components/header"
import Footer from "@/components/footer"
import JsonLd from "@/components/json-ld"
import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ - DankDeals.org | Cannabis Delivery Questions",
  description:
    "Find answers to frequently asked questions about cannabis delivery, payment, ID verification, and our services at DankDeals.org in Minneapolis & St. Paul.",
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section id="faq" className="py-24 bg-neutral-900">
          <JsonLd data={faqSchema} />
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glassmorphic-card mb-4 rounded-xl border-none px-6"
                >
                  <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
