
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ImageUp } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import ImageCard from './ImageCard';

type ImageGalleryProps = {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
};

export function ImageGallery({ images, onImageClick }: ImageGalleryProps) {

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
            onClick={() => onImageClick(image)}
          />
        ))}
      </motion.div>
    </>
  );
}
