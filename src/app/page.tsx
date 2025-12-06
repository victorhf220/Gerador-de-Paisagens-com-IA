'use client';
import { useState } from 'react';
import { ControlPanel } from '@/components/landscape/ControlPanel';
import { ImageGallery } from '@/components/landscape/ImageGallery';
import { GeneratedImage, GenerationOptions, GenerationState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/landscape/AppHeader';
import { LoadingOverlay } from '@/components/landscape/LoadingOverlay';

// Mock function to simulate image generation
const generateImageFlow = async (options: GenerationOptions): Promise<{ imageUrl: string }> => {
  console.log('Generating image with options:', options);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
  const seed = Math.random().toString(36).substring(7);
  const [width, height] = options.aspectRatio === '16:9' ? [1280, 720]
                         : options.aspectRatio === '1:1' ? [1024, 1024]
                         : [720, 1280];
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  return { imageUrl };
};


export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const { toast } = useToast();

  const handleGenerate = async (options: GenerationOptions) => {
    setGenerationState({ status: 'prepping', progress: 10, message: 'Preparing model...' });

    try {
      // Simulate progress
      setTimeout(() => setGenerationState({ status: 'generating', progress: 40, message: 'Generating image...' }), 1000);
      
      const result = await generateImageFlow(options);

      setTimeout(() => setGenerationState({ status: 'finalizing', progress: 90, message: 'Finalizing...' }), 3000);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        url: result.imageUrl,
        createdAt: new Date().toISOString(),
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
      setGenerationState({ status: 'complete', progress: 100, message: 'Generation complete!' });
      
      toast({
        title: 'Image Generated!',
        description: 'Your new landscape has been added to the gallery.',
      });

      setTimeout(() => setGenerationState({ status: 'idle', progress: 0, message: '' }), 1500);

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGenerationState({ status: 'error', progress: 0, message: 'Generation failed.' });
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
      setTimeout(() => setGenerationState({ status: 'idle', progress: 0, message: '' }), 2000);
    }
  };

  const handleReset = () => {
    setGeneratedImages([]);
    toast({
      title: 'Gallery Cleared',
      description: 'All generated images have been removed.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {generationState.status !== 'idle' && generationState.status !== 'error' && (
          <LoadingOverlay
            status={generationState.status}
            progress={generationState.progress}
            message={generationState.message}
          />
        )}
      </AnimatePresence>
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel onGenerate={handleGenerate} onReset={handleReset} isLoading={generationState.status !== 'idle'} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <ImageGallery images={generatedImages} />
          </div>
        </div>
      </main>
    </div>
  );
}
