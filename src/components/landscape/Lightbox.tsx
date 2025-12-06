
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Download, Maximize2, Tag, Ratio, Calendar, Sparkles, Timer, Cpu } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

interface LightboxProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => Promise<boolean>;
}

export const Lightbox: React.FC<LightboxProps> = ({ 
  image, 
  isOpen, 
  onClose, 
  onDownload 
}) => {
  const handleDownload = async () => {
    if (image) {
      await onDownload(image);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { scale: 0.9, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            exit="exit"
            className="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col lg:flex-row bg-card rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative flex-grow h-1/2 lg:h-full lg:w-3/4 bg-black/50 lg:rounded-l-lg flex items-center justify-center">
              <Image
                src={image.url}
                alt={image.prompt}
                fill
                sizes="(max-width: 1024px) 90vw, 66vw"
                className="object-contain"
              />
               <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    size="icon"
                    aria-label="Baixar imagem"
                  >
                    <Download size={20} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Tela cheia"
                    onClick={() => window.open(image.url, '_blank')}
                  >
                    <Maximize2 size={20} />
                  </Button>
                </div>
            </div>

            {/* Info Panel */}
            <ScrollArea className="w-full lg:w-96 h-1/2 lg:h-full">
              <div className="p-6 flex flex-col h-full">
                <div className='flex-grow space-y-6'>
                  <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-headline font-bold">Detalhes</h2>
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={onClose}
                          className="-mr-2 -mt-2"
                          aria-label="Fechar"
                      >
                          <X className="w-6 h-6" />
                      </Button>
                  </div>
                  
                  <div className="space-y-6 text-sm">
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Sparkles className='w-4 h-4 text-primary' /> Ideia (Prompt)</h3>
                        <p className='pl-6'>{image.prompt}</p>
                    </div>
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Cpu className='w-4 h-4 text-primary' /> Modelo IA</h3>
                        <Badge variant="secondary" className='ml-6 capitalize'>Padrão</Badge>
                    </div>
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Tag className='w-4 h-4 text-primary' /> Estilo</h3>
                        <Badge variant="secondary" className='ml-6 capitalize'>{image.style}</Badge>
                    </div>
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Ratio className='w-4 h-4 text-primary' /> Proporção</h3>
                        <Badge variant="secondary" className='ml-6'>
                          {image.aspectRatio === 'landscape' ? '16:9' : image.aspectRatio === 'portrait' ? '9:16' : '1:1'}
                        </Badge>
                    </div>
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Calendar className='w-4 h-4 text-primary' /> Criado em</h3>
                        <p className='pl-6'>{format(new Date(image.createdAt), "d 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}</p>
                    </div>
                    <div className='space-y-1'>
                        <h3 className="font-semibold text-muted-foreground flex items-center gap-2"><Timer className='w-4 h-4 text-primary' /> Tempo de Geração</h3>
                        <p className='pl-6'>{image.generationTime.toFixed(2)} segundos</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-border">
                  <Button onClick={handleDownload} className='w-full'>
                    <Download className="mr-2" />
                    Baixar Imagem
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
