import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'How does the AI landscape generator work?',
    answer:
      'Our AI uses advanced machine learning models trained on millions of landscape images to understand and generate new landscapes based on your text descriptions. The AI interprets your prompt and creates unique, high-quality landscape images.',
  },
  {
    question: 'What image formats are supported for download?',
    answer:
      'We generate images in a web-optimized format. You can download them as high-quality JPG files directly from the lightbox view.',
  },
  {
    question: 'How long does it take to generate an image?',
    answer:
      'Image generation typically takes 10-30 seconds depending on the complexity of your prompt and the selected style. You\'ll see real-time progress updates during the generation process.',
  },
  {
    question: 'Can I use the generated images commercially?',
    answer:
      "Yes, all images generated through our platform can be used for personal and commercial purposes. We don't claim copyright on AI-generated content.",
  },
];

export function FAQ() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Everything you need to know about our AI landscape generator.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/50 border border-border/30 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
