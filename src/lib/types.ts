
export type ArtStyle = 'Photorealistic' | 'Artistic' | 'Fantasy' | 'Vintage';
export type AspectRatio = '16:9' | '1:1' | '9:16';

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
  generationTime: number; // in milliseconds
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
