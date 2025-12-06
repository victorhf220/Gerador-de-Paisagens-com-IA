'use client';
import { useState } from 'react';
import { WandSparkles, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ArtStyle, AspectRatio, GenerationOptions } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const artStyles: ArtStyle[] = ['Photorealistic', 'Artistic', 'Fantasy', 'Vintage'];
const aspectRatios: AspectRatio[] = ['16:9', '1:1', '9:16'];
const quickPrompts = [
  'A serene lake reflecting a vibrant sunset.',
  'Misty mountains shrouded in morning fog.',
  'A futuristic city with flying vehicles.',
  'An enchanted forest with glowing mushrooms.',
];

type ControlPanelProps = {
  onGenerate: (options: GenerationOptions) => void;
  onReset: () => void;
  isLoading: boolean;
};

export function ControlPanel({ onGenerate, onReset, isLoading }: ControlPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      onGenerate({ prompt, style, aspectRatio });
    }
  };

  const inspireMe = () => {
    const randomPrompt = quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
    setPrompt(randomPrompt);
  };

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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={inspireMe}
                disabled={isLoading}
              >
                <Sparkles className="mr-2" />
                Get a random prompt
              </Button>
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
                    <SelectItem key={s} value={s}>
                      {s}
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
                    <SelectItem key={r} value={r}>
                      {r}
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
            onClick={handleGenerateClick}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={onReset}
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
}
