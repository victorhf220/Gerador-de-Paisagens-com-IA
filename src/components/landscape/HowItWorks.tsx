import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb, Pencil, Download, Bot } from 'lucide-react';

const steps = [
  {
    icon: Pencil,
    title: 'Describe Your Vision',
    description:
      'Write a detailed description of the landscape you want to create. Be specific about colors, mood, and elements.',
  },
  {
    icon: Lightbulb,
    title: 'Choose Style & Format',
    description:
      'Select from artistic styles like photorealistic, artistic, fantasy, or vintage. Pick your preferred aspect ratio.',
  },
  {
    icon: Bot,
    title: 'AI Generation',
    description:
      'Our advanced AI processes your request and generates a unique landscape image based on your specifications.',
  },
  {
    icon: Download,
    title: 'Download & Share',
    description:
      'View your generated landscape in high quality, download it, or share it directly from the platform.',
  },
];

export function HowItWorks() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold text-foreground">How It Works</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Creating stunning AI landscapes is simple with our four-step process.
        </p>
      </div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 h-full text-center bg-card/50 shadow-none border-border/30">
                <div className="flex justify-center mb-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-headline text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
