import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Download, Tag, Ratio, Calendar, Sparkles, Timer } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type LightboxProps = {
  image: GeneratedImage;
  onClose: () => void;
  onDownload: () => void;
};

export function Lightbox({ image, onClose, onDownload }: LightboxProps) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { scale: 0.9, opacity: 0 },
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        exit="exit"
        className="relative w-[90vw] h-[90vh] flex flex-col lg:flex-row gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-grow h-1/2 lg:h-full lg:w-3/4 bg-black/50 rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            sizes="90vw"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full lg:w-1/4 h-1/2 lg:h-full bg-card p-6 rounded-lg shadow-2xl flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-headline font-bold mb-4">Details</h2>
          
          <div className="space-y-6 text-sm flex-grow">
            <div className='space-y-1'>
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Sparkles className='w-4 h-4 text-primary' /> Prompt</h3>
                <p className='pl-6'>{image.prompt}</p>
            </div>
            <div className='space-y-1'>
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Tag className='w-4 h-4 text-primary' /> Style</h3>
                <Badge variant="secondary" className='ml-6'>{image.style}</Badge>
            </div>
            <div className='space-y-1'>
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Ratio className='w-4 h-4 text-primary' /> Aspect Ratio</h3>
                <Badge variant="secondary" className='ml-6'>{image.aspectRatio}</Badge>
            </div>
            <div className='space-y-1'>
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Calendar className='w-4 h-4 text-primary' /> Created</h3>
                <p className='pl-6'>{format(new Date(image.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
            </div>
            <div className='space-y-1'>
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Timer className='w-4 h-4 text-primary' /> Generation Time</h3>
                <p className='pl-6'>{(image.generationTime / 1000).toFixed(2)} seconds</p>
            </div>
          </div>

          <Button onClick={onDownload} className='mt-6 w-full'>
            <Download className="mr-2" />
            Download
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 lg:top-0 lg:-right-12 text-white/80 hover:text-white"
        >
          <X className="w-8 h-8" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
