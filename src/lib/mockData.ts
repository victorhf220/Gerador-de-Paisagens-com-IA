
import type { QuickPrompt, FAQ, HowItWorksStep, GeneratedImage } from '@/lib/types';

// Quick prompt suggestions
export const quickPrompts: QuickPrompt[] = [
  {
    id: '1',
    text: 'Um sereno lago na montanha ao pôr do sol com reflexos',
    category: 'Natureza',
    tags: ['montanha', 'lago', 'pôr do sol']
  },
  {
    id: '2', 
    text: 'Floresta mística com cogumelos brilhantes e luz etérea',
    category: 'Fantasia',
    tags: ['floresta', 'místico', 'brilhante']
  },
  {
    id: '3',
    text: 'Horizonte de cidade moderna à noite com luzes de neon',
    category: 'Urbano',
    tags: ['cidade', 'noite', 'neon']
  },
  {
    id: '4',
    text: 'Cena de deserto vintage com cidade do velho oeste',
    category: 'Vintage',
    tags: ['deserto', 'velho oeste', 'vintage']
  },
  {
    id: '5',
    text: 'Floresta coberta de neve com névoa matinal',
    category: 'Natureza',
    tags: ['neve', 'floresta', 'névoa']
  },
  {
    id: '6',
    text: 'Padrões fluidos abstratos em cores vivas',
    category: 'Abstrato',
    tags: ['abstrato', 'fluido', 'colorido']
  }
];

// FAQ data
export const faqData: FAQ[] = [
  {
    id: '1',
    question: 'Como funciona o gerador de paisagens com IA?',
    answer: 'Nossa IA usa modelos avançados de aprendizado de máquina treinados em milhões de imagens para entender e gerar novas paisagens com base em suas descrições de texto. A IA interpreta seu prompt e cria imagens de paisagem únicas e de alta qualidade.'
  },
  {
    id: '2',
    question: 'Quais formatos de imagem são suportados?',
    answer: 'Geramos imagens nos formatos PNG e JPEG de alta qualidade. Todas as imagens são otimizadas para uso na web e podem ser facilmente baixadas e compartilhadas.'
  },
  {
    id: '3',
    question: 'Quanto tempo leva para gerar uma imagem?',
    answer: 'A geração de imagens geralmente leva de 10 a 30 segundos, dependendo da complexidade do seu prompt e do estilo selecionado. Você verá atualizações de progresso em tempo real durante o processo de geração.'
  },
  {
    id: '4',
    question: 'Posso usar as imagens geradas comercialmente?',
    answer: 'Sim, todas as imagens geradas através da nossa plataforma podem ser usadas para fins pessoais e comerciais. Não reivindicamos direitos autorais sobre o conteúdo gerado por IA.'
  },
  {
    id: '5',
    question: 'E se eu não estiver satisfeito com o resultado?',
    answer: 'Você sempre pode gerar novas imagens com prompts modificados ou tentar diferentes estilos e proporções. A IA aprende com suas preferências para fornecer melhores resultados ao longo do tempo.'
  },
  {
    id: '6',
    question: 'Existem restrições de conteúdo?',
    answer: 'Mantemos diretrizes da comunidade que proíbem a geração de conteúdo impróprio, prejudicial ou protegido por direitos autorais. Nossa IA é treinada para respeitar essas diretrizes, maximizando a liberdade criativa.'
  }
];

// How it works steps
export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    title: 'Descreva Sua Visão',
    description: 'Escreva uma descrição detalhada da paisagem que você deseja criar. Seja específico sobre cores, humor e elementos.',
    icon: '✍️'
  },
  {
    id: 2,
    title: 'Escolha Estilo e Formato',
    description: 'Selecione estilos como fotorrealista, artístico, fantasia ou vintage. Escolha sua proporção preferida.',
    icon: '🎨'
  },
  {
    id: 3,
    title: 'Geração por IA',
    description: 'Nossa IA avançada processa sua solicitação e gera uma imagem de paisagem única com base em suas especificações.',
    icon: '🤖'
  },
  {
    id: 4,
    title: 'Baixe e Compartilhe',
    description: 'Visualize sua paisagem gerada em alta qualidade, baixe-a ou compartilhe-a diretamente da plataforma.',
    icon: '📱'
  }
];

// Mock generated images for gallery - Now an empty array
export const mockImages: GeneratedImage[] = [];
