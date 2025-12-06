
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import type { GenerationOptions, ArtStyle, AspectRatio } from '@/lib/types';
import { quickPrompts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WandSparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LoadingSpinner } from './Loading';


interface ControlPanelProps {
  onGenerate: (options: GenerationOptions) => void;
  onReset: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onReset,
  isLoading
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>('photorealistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('landscape');

  const handleGenerate = () => {
    if (prompt.trim() && !isLoading) {
      onGenerate({
        prompt: prompt.trim(),
        style,
        aspectRatio
      });
    }
  };

  const handleReset = () => {
    setPrompt('');
    setStyle('photorealistic');
    setAspectRatio('landscape');
    onReset();
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const artStyles: { value: ArtStyle; label: string; description: string }[] = [
    { value: 'photorealistic', label: 'Photorealistic', description: 'Real-world photography style' },
    { value: 'artistic', label: 'Artistic', description: 'Creative and stylized' },
    { value: 'fantasy', label: 'Fantasy', description: 'Imaginative and magical' },
    { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic' }
  ];

  const aspectRatios: { value: AspectRatio; label: string; description: string }[] = [
    { value: 'landscape', label: 'Landscape', description: '16:9 widescreen' },
    { value: 'square', label: 'Square', description: '1:1 balanced' },
    { value: 'portrait', label: 'Portrait', description: '9:16 vertical' }
  ];

  return (
    <TooltipProvider>
      <Card className="sticky top-20 shadow-xl border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <WandSparkles className="text-primary" />
            Create Your Landscape
          </CardTitle>
          <CardDescription>Describe the scene you want to generate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A tranquil beach at sunrise with soft waves..."
              className="min-h-[100px] text-base"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Inspire Me</Label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.slice(0, 4).map((quickPrompt) => (
                <Button
                  key={quickPrompt.id}
                  onClick={() => handleQuickPrompt(quickPrompt.text)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={isLoading}
                >
                  {quickPrompt.text}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Art Style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as ArtStyle)} disabled={isLoading}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select
                value={aspectRatio}
                onValueChange={(v) => setAspectRatio(v as AspectRatio)}
                disabled={isLoading}
              >
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-bold"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <Sparkles />}
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RotateCcw className="mr-2" />
                Reset Gallery
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all generated images from the gallery.</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};
