
export type ArtStyle = 'photorealistic' | 'artistic' | 'fantasy' | 'vintage';
export type AspectRatio = 'landscape' | 'square' | 'portrait';

export type GenerationOptions = {
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
};

export type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
  createdAt: string; // ISO string
  generationTime: number; // in seconds
};

export type GenerationStage = 'idle' | 'preparing' | 'generating' | 'finalizing' | 'complete' | 'error';

export type GenerationProgress = {
  stage: GenerationStage;
  progress: number;
  message: string;
};

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

export type QuickPrompt = {
  id: string;
  text: string;
  category: string;
  tags: string[];
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export type HowItWorksStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
};
