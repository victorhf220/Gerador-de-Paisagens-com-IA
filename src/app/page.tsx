'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/landscape/AppHeader';
import { ControlPanel } from '@/components/landscape/ControlPanel';
import { ImageGallery } from '@/components/landscape/ImageGallery';
import { Loading } from '@/components/landscape/Loading';
import { Lightbox } from '@/components/landscape/Lightbox';
import { HowItWorks } from '@/components/landscape/HowItWorks';
import { FAQ } from '@/components/landscape/FAQ';
import { useImageGeneration, useLightbox, useToast } from '@/hooks';
import { GenerationOptions, GeneratedImage } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const App: React.FC = () => {
  const { showToast } = useToast();
  const { 
    isGenerating, 
    progress, 
    generatedImages, 
    generateImage, 
    resetGeneration 
  } = useImageGeneration();
  
  const { 
    selectedImage, 
    isOpen, 
    openLightbox, 
    closeLightbox, 
    downloadImage 
  } = useLightbox();

  const handleGenerate = async (options: GenerationOptions) => {
    try {
      const image = await generateImage(options);
      if (image) {
        showToast({
          type: 'success',
          message: 'Your landscape has been generated successfully!'
        });
      } else {
        showToast({
          type: 'error',
          message: 'Failed to generate landscape. Please try again.'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    if (!image) return;
    
    try {
      const success = await downloadImage(image);
      if (success) {
        showToast({
          type: 'success',
          message: 'Image downloaded successfully!'
        });
      } else {
        showToast({
          type: 'error',
          message: 'Failed to download image.'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Download failed. Please try again.'
      });
    }
  };

  const handleReset = () => {
    resetGeneration();
    showToast({ type: 'info', message: 'Gallery has been reset.' });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel onGenerate={handleGenerate} onReset={handleReset} isLoading={isGenerating} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            {isGenerating && progress ? (
              <div className="flex items-center justify-center min-h-[70vh]">
                <Loading progress={progress} />
              </div>
            ) : (
              <ImageGallery images={generatedImages} onImageClick={openLightbox} />
            )}
          </div>
        </div>
        
        <Separator className="bg-border/40" />

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <Separator className="bg-border/40" />
        
        <section id="faq">
          <FAQ />
        </section>
      </main>

      <footer className="border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
            <p>© 2025 AI Landscape Generator. All rights reserved.</p>
        </div>
      </footer>

      <Lightbox 
        image={selectedImage} 
        isOpen={isOpen}
        onClose={closeLightbox} 
        onDownload={handleDownload}
      />
    </div>
  );
};

export default App;
