import { useState } from 'react';
import type { GeneratedImage } from '@/lib/types';
import { useToast } from './use-toast';

export function useLightbox() {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const { toast } = useToast();

  const openLightbox = (image: GeneratedImage) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  const downloadImage = async (image: GeneratedImage | null): Promise<boolean> => {
    if (!image) return false;

    try {
      // In a real app, you might fetch a higher-res version or from a secure URL
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `landscape-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download Started',
        description: 'Your image is being downloaded.',
      });
      return true;

    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not download the image. Please try again.',
      });
      return false;
    }
  };

  return {
    selectedImage,
    isOpen: !!selectedImage,
    openLightbox,
    closeLightbox,
    downloadImage,
  };
}
