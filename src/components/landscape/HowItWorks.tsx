import React from 'react';
import { motion } from 'framer-motion';
import { howItWorksSteps } from '@/lib/mockData';

export const HowItWorks: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-headline font-bold text-foreground">
          How It Works
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Creating stunning AI landscapes is simple with our four-step process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {howItWorksSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card text-center space-y-4 hover:border-primary/50 transition-colors duration-300 p-6 bg-card/50 shadow-none border-border/30"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  Step {step.id}
                </span>
              </div>
              
              <h3 className="text-lg font-headline font-semibold text-foreground">
                {step.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
