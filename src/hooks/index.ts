
'use client';
import { useState, useCallback, useEffect } from 'react';
import { GenerationOptions, GeneratedImage, GenerationProgress, Toast } from '@/lib/types';
import { generateImageFlow, checkImageStatusFlow } from '@/ai/flows/image-generation';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const pollForImage = useCallback(async (taskId: string, options: GenerationOptions) => {
    setProgress({ stage: 'generating', progress: 50, message: 'Your image is being created by Nano Banana...' });
    
    let attempts = 0;
    const maxAttempts = 15; // Poll for up to 2.5 minutes (15 * 10s)

    while (attempts < maxAttempts) {
      try {
        const response = await checkImageStatusFlow(taskId);
        if (response && response.imageUrl) {
          const endTime = Date.now();
          // Note: generationTime would be inaccurate here. We'd need to get it from the callback.
          const generationTime = (attempts + 1) * 10; 

          const newImage: GeneratedImage = {
            id: Date.now().toString(),
            url: response.imageUrl,
            prompt: options.prompt,
            style: options.style,
            aspectRatio: options.aspectRatio,
            createdAt: new Date().toISOString(),
            generationTime: parseFloat(generationTime.toFixed(2)),
            aiModel: options.aiModel,
          };
          
          setProgress({ stage: 'complete', progress: 100, message: 'Generation complete!' });
          setGeneratedImages(prev => [newImage, ...prev]);
          await new Promise(resolve => setTimeout(resolve, 500));
          setProgress(null);
          setIsGenerating(false);
          return newImage;
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
      
      attempts++;
      setProgress({ stage: 'generating', progress: 50 + Math.round((attempts / maxAttempts) * 30), message: 'Waiting for the AI...' });
      await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds before polling again
    }
    
    setIsGenerating(false);
    setProgress(null);
    throw new Error('Image generation timed out.');

  }, []);

  const generateImage = useCallback(async (options: GenerationOptions): Promise<GeneratedImage | null> => {
    setIsGenerating(true);
    setProgress({ stage: 'preparing', progress: 0, message: 'Preparing to generate...' });
    const startTime = Date.now();

    try {
      setProgress({ stage: 'preparing', progress: 20, message: 'Sending request...' });
      const response = await generateImageFlow(options);
      
      // If it's a task ID from the new API, start polling
      if (response && response.taskId && options.aiModel === 'nano_banana') {
        return await pollForImage(response.taskId, options);
      }

      // Handle standard Genkit flow
      if (!response || !response.imageUrl) {
        throw new Error('Image generation failed to return a URL.');
      }
      
      setProgress({ stage: 'finalizing', progress: 80, message: 'Finalizing details...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const endTime = Date.now();
      const generationTime = (endTime - startTime) / 1000;

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: response.imageUrl,
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        createdAt: new Date().toISOString(),
        generationTime: parseFloat(generationTime.toFixed(2)),
        aiModel: options.aiModel,
      };
      
      setProgress({ stage: 'complete', progress: 100, message: 'Generation complete!' });
      setGeneratedImages(prev => [newImage, ...prev]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(null);
      
      return newImage;

    } catch (error) {
      console.error('Generation failed:', error);
      setProgress(null);
      throw error; 
    } finally {
      // Don't set isGenerating to false if we are polling
      if (options.aiModel !== 'nano_banana') {
        setIsGenerating(false);
      }
    }
  }, [pollForImage]);

  const resetGeneration = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  return {
    isGenerating,
    progress,
    generatedImages,
    generateImage,
    resetGeneration
  };
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  };
};

export const useLightbox = () => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = useCallback((image: GeneratedImage) => {
    setSelectedImage(image);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 300); 
  }, []);

  const downloadImage = useCallback(async (image: GeneratedImage) => {
    try {
      // For data URIs, we need to handle them differently
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
  }, []);

  return {
    selectedImage,
    isOpen,
    openLightbox,
    closeLightbox,
    downloadImage
  };
};
