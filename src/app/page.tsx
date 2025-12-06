
'use client';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/landscape/AppHeader';
import { ControlPanel } from '@/components/landscape/ControlPanel';
import { ImageGallery } from '@/components/landscape/ImageGallery';
import { Loading } from '@/components/landscape/Loading';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useLightbox } from '@/hooks/useLightbox';
import { Lightbox } from '@/components/landscape/Lightbox';
import { HowItWorks } from '@/components/landscape/HowItWorks';
import { FAQ } from '@/components/landscape/FAQ';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const {
    generationProgress,
    generatedImages,
    generateImage,
    resetGallery,
    isGenerating,
  } = useImageGeneration();
  
  const { selectedImage, isOpen, openLightbox, closeLightbox, downloadImage } = useLightbox();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel onGenerate={generateImage} onReset={resetGallery} isLoading={isGenerating} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            {isGenerating ? (
              <div className="flex items-center justify-center min-h-[70vh]">
                <Loading progress={generationProgress} />
              </div>
            ) : (
              <ImageGallery images={generatedImages} onImageClick={openLightbox} />
            )}
          </div>
        </div>
        
        <Separator className="bg-border/40" />

        <HowItWorks />

        <Separator className="bg-border/40" />

        <FAQ />
      </main>

      <Lightbox 
        image={selectedImage} 
        isOpen={isOpen}
        onClose={closeLightbox} 
        onDownload={downloadImage}
      />
    </div>
  );
}
