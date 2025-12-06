
'use client';
import { useState, useCallback } from 'react';
import { GenerationOptions, GeneratedImage, GenerationProgress, Toast } from '@/lib/types';
import { mockImages } from '@/lib/mockData';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(mockImages);

  const generateImage = useCallback(async (options: GenerationOptions): Promise<GeneratedImage | null> => {
    setIsGenerating(true);
    setProgress({ stage: 'preparing', progress: 0, message: 'Preparing to generate...' });

    try {
      // Simulate generation process with progress updates
      const stages = [
        { stage: 'preparing' as const, progress: 20, message: 'Analyzing prompt...' },
        { stage: 'generating' as const, progress: 50, message: 'Creating your landscape...' },
        { stage: 'finalizing' as const, progress: 80, message: 'Finalizing details...' },
        { stage: 'complete' as const, progress: 100, message: 'Generation complete!' }
      ];

      for (const stage of stages) {
        setProgress(stage);
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      }

      // Generate mock image data
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `https://picsum.photos/seed/${Math.random()}/800/600`,
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        createdAt: new Date().toISOString(),
        generationTime: Math.floor(Math.random() * 20) + 10
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(null);
      
      return newImage;
    } catch (error) {
      console.error('Generation failed:', error);
      setProgress(null);
      return null;
    } finally {
      setIsGenerating(false);
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

    // Auto remove toast after duration
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
    setTimeout(() => setSelectedImage(null), 300); // Delay to allow animation
  }, []);

  const downloadImage = useCallback(async (image: GeneratedImage) => {
    try {
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
