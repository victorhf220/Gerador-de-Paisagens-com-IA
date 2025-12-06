
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
        aspectRatio,
        aiModel: 'standard',
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
    { value: 'photorealistic', label: 'Fotorrealista', description: 'Estilo de fotografia do mundo real' },
    { value: 'artistic', label: 'Artístico', description: 'Criativo e estilizado' },
    { value: 'fantasy', label: 'Fantasia', description: 'Imaginativo e mágico' },
    { value: 'vintage', label: 'Vintage', description: 'Retrô e nostálgico' }
  ];

  const aspectRatios: { value: AspectRatio; label: string; description: string }[] = [
    { value: 'landscape', label: 'Paisagem', description: '16:9 widescreen' },
    { value: 'square', label: 'Quadrado', description: '1:1 balanceado' },
    { value: 'portrait', label: 'Retrato', description: '9:16 vertical' }
  ];

  return (
    <TooltipProvider>
      <Card className="sticky top-20 shadow-xl border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <WandSparkles className="text-primary" />
            Crie Sua Paisagem
          </CardTitle>
          <CardDescription>Descreva a cena que você quer gerar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Sua Ideia</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma praia tranquila ao amanhecer com ondas suaves..."
              className="min-h-[100px] text-base"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Inspire-me</Label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.slice(0, 4).map((quickPrompt) => (
                <Button
                  key={quickPrompt.id}
                  onClick={() => handleQuickPrompt(quickPrompt.text)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={isLoading}
                  aria-label={`Use a quick prompt: ${quickPrompt.text}`}
                >
                  {quickPrompt.text}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Estilo de Arte</Label>
                <Select value={style} onValueChange={(v) => setStyle(v as ArtStyle)} disabled={isLoading}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Selecione um estilo" />
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
                <Label htmlFor="aspect-ratio">Proporção</Label>
                <Select
                  value={aspectRatio}
                  onValueChange={(v) => setAspectRatio(v as AspectRatio)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="aspect-ratio">
                    <SelectValue placeholder="Selecione uma proporção" />
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
            {isLoading ? 'Gerando...' : 'Gerar'}
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
                Limpar Galeria
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Limpa todas as imagens geradas da galeria.</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};
