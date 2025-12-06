
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
  createdAt: string; // ISO string
  generationTime: number; // in seconds
}

export type ArtStyle = 'photorealistic' | 'artistic' | 'fantasy' | 'vintage';

export type AspectRatio = 'landscape' | 'square' | 'portrait';

export interface GenerationOptions {
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
}

export type GenerationStage = 'idle' | 'preparing' | 'generating' | 'finalizing' | 'complete' | 'error';

export interface GenerationProgress {
  stage: GenerationStage;
  progress: number; // 0-100
  message: string;
}

export interface QuickPrompt {
  id: string;
  text: string;
  category: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
