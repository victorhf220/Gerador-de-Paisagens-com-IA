'use client';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/landscape/AppHeader';
import { ControlPanel } from '@/components/landscape/ControlPanel';
import { ImageGallery } from '@/components/landscape/ImageGallery';
import { LoadingOverlay } from '@/components/landscape/LoadingOverlay';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useLightbox } from '@/hooks/useLightbox';
import { Lightbox } from '@/components/landscape/Lightbox';
import { HowItWorks } from '@/components/landscape/HowItWorks';
import { FAQ } from '@/components/landscape/FAQ';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const {
    generationState,
    generatedImages,
    generateImage,
    resetGallery,
    isGenerating,
  } = useImageGeneration();
  
  const { selectedImage, isOpen, openLightbox, closeLightbox, downloadImage } = useLightbox();

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {isGenerating && (
          <LoadingOverlay
            status={generationState.status}
            progress={generationState.progress}
            message={generationState.message}
          />
        )}
      </AnimatePresence>
      
      <AppHeader />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel onGenerate={generateImage} onReset={resetGallery} isLoading={isGenerating} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <ImageGallery images={generatedImages} onSelectImage={openLightbox} />
          </div>
        </div>
        
        <Separator className="bg-border/40" />

        <HowItWorks />

        <Separator className="bg-border/40" />

        <FAQ />
      </main>

      <AnimatePresence>
        {isOpen && selectedImage && (
            <Lightbox 
                image={selectedImage} 
                onClose={closeLightbox} 
                onDownload={() => downloadImage(selectedImage)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
}
