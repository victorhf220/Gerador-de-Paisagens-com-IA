import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { GenerationStatus } from '@/lib/types';
import { Loader } from 'lucide-react';

type LoadingOverlayProps = {
  status: GenerationStatus;
  progress: number;
  message: string;
};

const statusHierarchy: GenerationStatus[] = ['prepping', 'generating', 'finalizing', 'complete'];

export function LoadingOverlay({ status, progress, message }: LoadingOverlayProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 1 } },
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="w-full max-w-md text-center p-8">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
        >
            <Loader className="w-16 h-16 text-primary mx-auto animate-spin" />
        </motion.div>
        
        <div className="mt-8 space-y-4">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
                {statusHierarchy.slice(0, -1).map(s => (
                    <motion.span
                        key={s}
                        animate={{ color: statusHierarchy.indexOf(status) >= statusHierarchy.indexOf(s) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                        className="capitalize"
                    >
                        {s}
                    </motion.span>
                ))}
            </div>
            <Progress value={progress} className="h-2" />
            <motion.p 
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-foreground"
            >
                {message}
            </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
