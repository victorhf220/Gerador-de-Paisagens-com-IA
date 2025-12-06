
import type { QuickPrompt, FAQ, HowItWorksStep, GeneratedImage } from '@/lib/types';

// Quick prompt suggestions
export const quickPrompts: QuickPrompt[] = [
  {
    id: '1',
    text: 'A serene mountain lake at sunset with reflections',
    category: 'Nature',
    tags: ['mountain', 'lake', 'sunset']
  },
  {
    id: '2', 
    text: 'Mystical forest with glowing mushrooms and ethereal light',
    category: 'Fantasy',
    tags: ['forest', 'mystical', 'glowing']
  },
  {
    id: '3',
    text: 'Modern city skyline at night with neon lights',
    category: 'Urban',
    tags: ['city', 'night', 'neon']
  },
  {
    id: '4',
    text: 'Vintage desert scene with old western town',
    category: 'Vintage',
    tags: ['desert', 'western', 'vintage']
  },
  {
    id: '5',
    text: 'Snow-covered forest with morning fog',
    category: 'Nature',
    tags: ['snow', 'forest', 'fog']
  },
  {
    id: '6',
    text: 'Abstract flowing patterns in bright colors',
    category: 'Abstract',
    tags: ['abstract', 'flowing', 'colorful']
  }
];

// FAQ data
export const faqData: FAQ[] = [
  {
    id: '1',
    question: 'How does the AI landscape generator work?',
    answer: 'Our AI uses advanced machine learning models trained on millions of landscape images to understand and generate new landscapes based on your text descriptions. The AI interprets your prompt and creates unique, high-quality landscape images.'
  },
  {
    id: '2',
    question: 'What image formats are supported?',
    answer: 'We generate images in high-quality PNG and JPEG formats. All images are optimized for web use and can be easily downloaded and shared.'
  },
  {
    id: '3',
    question: 'How long does it take to generate an image?',
    answer: 'Image generation typically takes 10-30 seconds depending on the complexity of your prompt and the selected style. You\'ll see real-time progress updates during the generation process.'
  },
  {
    id: '4',
    question: 'Can I use the generated images commercially?',
    answer: 'Yes, all images generated through our platform can be used for personal and commercial purposes. We don\'t claim copyright on AI-generated content.'
  },
  {
    id: '5',
    question: 'What if I\'m not satisfied with the result?',
    answer: 'You can always regenerate images with modified prompts or try different styles and aspect ratios. The AI learns from your preferences to provide better results over time.'
  },
  {
    id: '6',
    question: 'Are there any content restrictions?',
    answer: 'We maintain community guidelines that prohibit generating inappropriate, harmful, or copyrighted content. Our AI is trained to respect these guidelines while maximizing creative freedom.'
  }
];

// How it works steps
export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    title: 'Describe Your Vision',
    description: 'Write a detailed description of the landscape you want to create. Be specific about colors, mood, and elements.',
    icon: '✍️'
  },
  {
    id: 2,
    title: 'Choose Style & Format',
    description: 'Select from artistic styles like photorealistic, artistic, fantasy, or vintage. Pick your preferred aspect ratio.',
    icon: '🎨'
  },
  {
    id: 3,
    title: 'AI Generation',
    description: 'Our advanced AI processes your request and generates a unique landscape image based on your specifications.',
    icon: '🤖'
  },
  {
    id: 4,
    title: 'Download & Share',
    description: 'View your generated landscape in high quality, download it, or share it directly from the platform.',
    icon: '📱'
  }
];

// Mock generated images for gallery - Now an empty array
export const mockImages: GeneratedImage[] = [];
