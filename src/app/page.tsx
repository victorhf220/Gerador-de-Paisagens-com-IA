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
import { Separator } from '@/components/ui/separator';
import { GenerationOptions, GeneratedImage } from '@/lib/types';
import { useLightbox, useToast } from '@/hooks';

export default function App() {
  const { showToast } = useToast();
  const {
    selectedImage,
    isOpen,
    openLightbox,
    closeLightbox,
  } = useLightbox();

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState<GenerationProgress | null>(null);
  const [generatedImages, setGeneratedImages] = React.useState<GeneratedImage[]>([]);

  // ✅ GERAÇÃO VIA API ROUTE (SEM SERVER ACTION)
  const handleGenerate = async (options: GenerationOptions) => {
    setIsGenerating(true);
    setProgress({ stage: 'preparing', progress: 10, message: 'Iniciando geração...' });

    const startTime = Date.now();
    try {
      setProgress({ stage: 'generating', progress: 20, message: 'Enviando para a IA...' });
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      
      setProgress({ stage: 'generating', progress: 70, message: 'Aguardando a imagem...' });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao gerar a imagem');
      }

      const data = await res.json();
      
      const endTime = Date.now();
      const generationTime = (endTime - startTime) / 1000;

      const newImage: GeneratedImage = {
        ...data,
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        generationTime: parseFloat(generationTime.toFixed(2)),
        aiModel: 'standard',
      };

      setProgress({ stage: 'complete', progress: 100, message: 'Imagem gerada!' });
      setGeneratedImages(prev => [newImage, ...prev]);
      showToast({ type: 'success', message: 'Imagem gerada com sucesso!' });
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err.message || 'A geração falhou',
      });
    } finally {
      setTimeout(() => {
        setProgress(null);
        setIsGenerating(false);
      }, 1000)
    }
  };

  const handleReset = () => {
    setGeneratedImages([]);
    showToast({ type: 'info', message: 'Galeria resetada.' });
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      if (image.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `ai-landscape-${image.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
      
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-landscape-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    if (!image) return;
    
    try {
      const success = await downloadImage(image);
      if (success) {
        showToast({
          type: 'success',
          message: 'Download da imagem iniciado!'
        });
      } else {
        showToast({
          type: 'error',
          message: 'Falha no download da imagem.'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Download falhou. Por favor, tente novamente.'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel
              onGenerate={handleGenerate}
              onReset={handleReset}
              isLoading={isGenerating}
            />
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {isGenerating && progress ? (
              <div className="flex items-center justify-center min-h-[70vh]">
                <Loading progress={progress} />
              </div>
            ) : (
              <ImageGallery
                images={generatedImages}
                onImageClick={openLightbox}
              />
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
}
