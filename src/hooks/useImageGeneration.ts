
'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateImageFlow } from '@/ai/flows/image-generation';
import type { GeneratedImage, GenerationOptions, GenerationState } from '@/lib/types';

export function useImageGeneration() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const { toast } = useToast();

  const generateImage = async (options: GenerationOptions): Promise<GeneratedImage | null> => {
    const startTime = Date.now();
    setGenerationState({ status: 'prepping', progress: 10, message: 'Preparing model...' });

    try {
      setTimeout(() => setGenerationState(s => s.status === 'prepping' ? { status: 'generating', progress: 40, message: 'Generating image...' } : s), 1000);
      
      const result = await generateImageFlow(options);

      const generationTime = Date.now() - startTime;
      
      if (!result?.imageUrl) {
        throw new Error('Image generation failed to return a URL.');
      }

      setGenerationState({ status: 'finalizing', progress: 90, message: 'Finalizing...' });
      
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
      setGenerationState({ status: 'complete', progress: 100, message: 'Generation complete!' });
      
      toast({
        title: 'Image Generated!',
        description: 'Your new landscape has been added to the gallery.',
      });

      setTimeout(() => setGenerationState({ status: 'idle', progress: 0, message: '' }), 1500);
      return newImage;
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
      return null;
    }
  };

  const resetGallery = () => {
    setGeneratedImages([]);
    toast({
      title: 'Gallery Cleared',
      description: 'All generated images have been removed.',
    });
  };

  return {
    generationState,
    generatedImages,
    generateImage,
    resetGallery,
    isGenerating: generationState.status !== 'idle' && generationState.status !== 'error',
  };
}
