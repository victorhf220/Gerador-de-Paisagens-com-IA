'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Palette, ImageUp } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, index, onClick }) => {
  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg cursor-pointer border border-border/60 shadow-md transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className={`relative ${getAspectRatioClass(image.aspectRatio)} overflow-hidden`}>
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <div className="space-y-2">
            <p className="text-white text-sm font-medium line-clamp-2">
              {image.prompt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {(image.generationTime / 1000).toFixed(1)}s
                </span>
                <span className="flex items-center gap-1">
                  <Palette size={12} />
                  {image.style}
                </span>
              </div>
              <span>{formatTimeAgo(image.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {image.style}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {image.aspectRatio}
          </span>
        </div>
      </div>
    </motion.div>
  );
};


type ImageGalleryProps = {
  images: GeneratedImage[];
  onSelectImage: (image: GeneratedImage) => void;
};

export function ImageGallery({ images, onSelectImage }: ImageGalleryProps) {

  if (images.length === 0) {
    return (
      <Card className="flex min-h-[70vh] w-full items-center justify-center rounded-xl border-2 border-dashed border-border/50 shadow-none bg-card/50">
        <div className="text-center text-muted-foreground p-8">
          <ImageUp className="mx-auto h-16 w-16 text-primary/30" />
          <h2 className="mt-6 text-xl font-headline font-semibold text-foreground">
            Your Generated Landscapes Appear Here
          </h2>
          <p className="mt-2 max-w-sm mx-auto">
            Use the control panel on the left to describe a scene and generate your first image.
          </p>
        </div>
      </Card>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-2xl font-headline font-bold text-foreground">Gallery</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {images.length} image{images.length === 1 ? '' : 's'}
        </span>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            onClick={() => onSelectImage(image)}
          />
        ))}
      </motion.div>
    </>
  );
}