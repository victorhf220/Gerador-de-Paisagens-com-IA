import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedImage, GenerationOptions, GenerationState } from '@/lib/types';

// In a real app, this would be a server action calling the GenAI flow
const generateImageFlow = async (options: GenerationOptions): Promise<{ imageUrl: string }> => {
  console.log('Generating image with options:', options);
  // Simulate network delay and generation time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); 
  const seed = Math.random().toString(36).substring(7);
  const [width, height] = options.aspectRatio === '16:9' ? [1280, 720]
                         : options.aspectRatio === '1:1' ? [1024, 1024]
                         : [720, 1280];
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  return { imageUrl };
};

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
      
      setTimeout(() => setGenerationState(s => s.status === 'generating' ? { status: 'finalizing', progress: 90, message: 'Finalizing...' } : s), 2000);
      
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
