import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import JsonLd from "./json-ld"

const faqs = [
  {
    question: "Is this legal in Minnesota?",
    answer:
      "Yes. Following recent legislation, we operate a legal gifting model. We do not sell cannabis products. We offer them as a gift in exchange for a donation to our organization.",
  },
  {
    question: "How does the 'gifting' process work?",
    answer:
      "Simply browse our online showcase, then call or text us at 612-930-1390 to inquire about receiving a gift. We'll guide you through the simple and discreet process.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We primarily serve the Minneapolis-St. Paul (Twin Cities) metropolitan area. Please contact us to confirm if we can deliver to your specific location.",
  },
  {
    question: "Do I need a medical card?",
    answer:
      "No, you do not need a medical card. You must be 21 years of age or older with a valid ID to receive a gift.",
  },
  {
    question: "What is the AI Budtender?",
    answer:
      "Our AI Budtender is a unique feature that provides personalized product recommendations from our menu based on your desired effects, mood, or occasion. It's like having a cannabis expert at your fingertips!",
  },
]

export default function FaqSection() {
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
    <section id="faq" className="py-24 bg-neutral-50 dark:bg-neutral-900">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glassmorphic-card mb-4 rounded-xl border-none px-6"
            >
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline text-gray-900 dark:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-700 dark:text-gray-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
