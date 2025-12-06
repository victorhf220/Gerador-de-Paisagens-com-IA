
'use client';
import { useState, useCallback } from 'react';
import { GenerationOptions, GeneratedImage, GenerationProgress, Toast } from '@/lib/types';
import { generateImageFlow } from '@/ai/flows/image-generation';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const generateImage = useCallback(async (options: GenerationOptions): Promise<GeneratedImage | null> => {
    setIsGenerating(true);
    setProgress({ stage: 'preparing', progress: 0, message: 'Preparing to generate...' });
    const startTime = Date.now();

    try {
      setProgress({ stage: 'preparing', progress: 20, message: 'Sending request...' });
      const response = await generateImageFlow(options);
      
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
        aiModel: 'standard',
      };
      
      setProgress({ stage: 'complete', progress: 100, message: 'Generation complete!' });
      setGeneratedImages(prev => [newImage, ...prev]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(null);
      setIsGenerating(false);
      
      return newImage;

    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setProgress(null);
      throw error; 
    }
  }, []);

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
