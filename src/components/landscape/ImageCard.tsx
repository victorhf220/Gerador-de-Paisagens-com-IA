import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { GeneratedImage } from '@/lib/types';
import { Eye } from 'lucide-react';

type ImageCardProps = {
  image: GeneratedImage;
  onSelect: (image: GeneratedImage) => void;
};

export function ImageCard({ image, onSelect }: ImageCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card
        className="group relative overflow-hidden rounded-lg border-border/60 shadow-md transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1"
        onClick={() => onSelect(image)}
      >
        <Image
          src={image.url}
          alt={image.prompt}
          width={500}
          height={500}
          className="aspect-[1/1] w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
          <p className="text-white text-sm font-medium line-clamp-2 transition-transform duration-300 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
            {image.prompt}
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <Eye className="w-10 h-10 text-white" />
        </div>
      </Card>
    </motion.div>
  );
}
