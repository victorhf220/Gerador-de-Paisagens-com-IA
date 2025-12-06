
import React from 'react';
import { motion } from 'framer-motion';
import { GenerationProgress } from '@/lib/types';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';

interface LoadingProps {
  progress: GenerationProgress;
}

export const Loading: React.FC<LoadingProps> = ({ progress }) => {
  const getStageIcon = () => {
    switch (progress.stage) {
      case 'preparing':
        return '⚙️';
      case 'generating':
        return '🎨';
      case 'finalizing':
        return '✨';
      case 'complete':
        return '✅';
      default:
        return '🤖';
    }
  };

  return (
    <Card className="text-center w-full max-w-md">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <motion.div
            key={progress.stage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-6xl"
          >
            {getStageIcon()}
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground">
            {progress.message}
          </h3>
          <p className="text-sm text-muted-foreground">
            Estágio: {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
          </p>
        </div>
        
        <div className="space-y-3">
          <Progress value={progress.progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {progress.progress}% completo
          </p>
        </div>

        <div className="text-xs text-muted-foreground/80 pt-2">
          Criando sua paisagem única...
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-border border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};
