'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Palette } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, index, onClick }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const formatTimeAgo = (date: string | Date) => {
      const now = new Date();
      const then = new Date(date);
      const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return 'just now';
      } if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
      }
    };

    setTimeAgo(formatTimeAgo(image.createdAt));
  }, [image.createdAt]);

  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[9/16]';
      case 'landscape':
      default:
        return 'aspect-video';
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
                  {image.generationTime.toFixed(1)}s
                </span>
                <span className="flex items-center gap-1">
                  <Palette size={12} />
                  {image.style}
                </span>
              </div>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm capitalize">
            {image.style}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {image.aspectRatio === 'landscape' ? '16:9' : image.aspectRatio === 'portrait' ? '9:16' : '1:1'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
