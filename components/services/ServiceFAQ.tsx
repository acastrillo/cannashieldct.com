import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type ServiceFAQProps = {
  faqs: {
    question: string
    answer: string
  }[]
}

export function ServiceFAQ({ faqs }: ServiceFAQProps) {
  return (
    <section className="section-shell">
      <p className="section-label">FAQ</p>
      <h2 className="section-heading">Questions operators ask first.</h2>
      <Accordion type="single" collapsible className="mt-10 max-w-4xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
