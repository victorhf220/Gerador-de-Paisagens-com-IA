
'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateImageFlow } from '@/ai/flows/image-generation';
import type { GeneratedImage, GenerationOptions, GenerationProgress } from '@/lib/types';

export function useImageGeneration() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    stage: 'idle',
    progress: 0,
    message: '',
  });
  const { addToast } = useToast();

  const generateImage = async (options: GenerationOptions): Promise<GeneratedImage | null> => {
    const startTime = Date.now();
    setGenerationProgress({ stage: 'preparing', progress: 10, message: 'Preparing model...' });

    try {
      setTimeout(() => setGenerationProgress(s => s.stage === 'preparing' ? { stage: 'generating', progress: 40, message: 'Generating image...' } : s), 1000);
      
      const result = await generateImageFlow(options);

      const generationTime = Date.now() - startTime;
      
      if (!result?.imageUrl) {
        throw new Error('Image generation failed to return a URL.');
      }

      setGenerationProgress({ stage: 'finalizing', progress: 90, message: 'Finalizing...' });
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        url: result.imageUrl,
        createdAt: new Date().toISOString(),
        generationTime,
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
      setGenerationProgress({ stage: 'complete', progress: 100, message: 'Generation complete!' });
      
      addToast('Image Generated! Your new landscape has been added to the gallery.', 'success');

      setTimeout(() => setGenerationProgress({ stage: 'idle', progress: 0, message: '' }), 1500);
      return newImage;
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGenerationProgress({ stage: 'error', progress: 0, message: 'Generation failed.' });
      addToast(`Generation Failed: ${errorMessage}`, 'error');

      setTimeout(() => setGenerationProgress({ stage: 'idle', progress: 0, message: '' }), 2000);
      return null;
    }
  };

  const resetGallery = () => {
    setGeneratedImages([]);
    addToast('Gallery Cleared. All generated images have been removed.', 'info');
  };

  return {
    generationProgress,
    generatedImages,
    generateImage,
    resetGallery,
    isGenerating: generationProgress.stage !== 'idle' && generationProgress.stage !== 'error' && generationProgress.stage !== 'complete',
  };
}
