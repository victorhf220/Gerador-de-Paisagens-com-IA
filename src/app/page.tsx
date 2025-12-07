'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/landscape/AppHeader';
import { ControlPanel } from '@/components/landscape/ControlPanel';
import { ImageGallery } from '@/components/landscape/ImageGallery';
import { Loading } from '@/components/landscape/Loading';
import { Lightbox } from '@/components/landscape/Lightbox';
import { HowItWorks } from '@/components/landscape/HowItWorks';
import { FAQ } from '@/components/landscape/FAQ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GenerationOptions, GeneratedImage, GenerationProgress } from '@/lib/types';
import { useLightbox, useToast } from '@/hooks';

const POLLING_INTERVAL = 3000; // 3 segundos
const POLLING_TIMEOUT = 60000; // 60 segundos

export default function App() {
  const { showToast } = useToast();
  const { selectedImage, isOpen, openLightbox, closeLightbox } = useLightbox();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState<GenerationProgress | null>(null);
  const [generatedImages, setGeneratedImages] = React.useState<GeneratedImage[]>([]);

  const pollForResult = async (jobId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const intervalId = setInterval(async () => {
        // Timeout
        if (Date.now() - startTime > POLLING_TIMEOUT) {
          clearInterval(intervalId);
          reject(new Error('A geração da imagem demorou muito. Tente novamente.'));
          return;
        }

        try {
          const res = await fetch(`/api/generation-status/${jobId}`);
          if (!res.ok) {
            if (res.status === 404) {
              console.log(`Job ${jobId} ainda em andamento...`);
              return; // Continua tentando
            }
            // Para outros erros HTTP, tenta pegar uma mensagem da API
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.error || `Falha ao verificar status: ${res.statusText}`);
          }
          
          const data = await res.json();

          if (data.status === 'complete' && data.imageUrl) {
            clearInterval(intervalId);
            resolve(data.imageUrl);
          } else if (data.status === 'failed') {
            clearInterval(intervalId);
            reject(new Error(data.error || 'A geração falhou no agente de IA.'));
          }
          // Se for 'pending', o loop continua.

        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, POLLING_INTERVAL);
    });
  }


  const handleGenerate = async (options: GenerationOptions) => {
    setIsGenerating(true);
    setProgress({ stage: 'preparing', progress: 10, message: 'Enviando requisição...' });
    
    const startTime = Date.now();
    try {
      setProgress({ stage: 'generating', progress: 20, message: 'Iniciando agente de IA...' });
      const initialRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!initialRes.ok) {
        const errorData = await initialRes.json().catch(() => null); // Tenta parsear o erro
        throw new Error(errorData?.error || 'Falha ao iniciar a geração. Verifique o console do servidor.');
      }
      
      const { jobId } = await initialRes.json();

      if(!jobId) {
        throw new Error('A API não retornou um ID de trabalho válido.');
      }

      setProgress({ stage: 'generating', progress: 40, message: 'Aguardando o resultado da IA...' });
      const imageUrl = await pollForResult(jobId);
      
      const endTime = Date.now();
      const generationTime = (endTime - startTime) / 1000;
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        createdAt: new Date().toISOString(),
        prompt: options.prompt,
        style: options.style,
        aspectRatio: options.aspectRatio,
        generationTime: parseFloat(generationTime.toFixed(2)),
        aiModel: options.aiModel || 'standard', 
      };

      setProgress({ stage: 'complete', progress: 100, message: 'Imagem recebida!' });
      setGeneratedImages(prev => [newImage, ...prev]);
      showToast({ type: 'success', message: 'Imagem gerada com sucesso!' });
    } catch (err: any) {
      console.error("ERRO NA GERAÇÃO:", err);
      showToast({
        type: 'error',
        message: err.message || 'A geração falhou',
      });
    } finally {
      setTimeout(() => {
        setProgress(null);
        setIsGenerating(false);
      }, 1000)
    }
  };

  // O resto do código permanece igual

  const handleReset = () => {
    setGeneratedImages([]);
    showToast({ type: 'info', message: 'Galeria reiniciada.' });
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      if (image.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `paisagem-ia-${image.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
      
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paisagem-ia-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    if (!image) return;
    
    try {
      const success = await downloadImage(image);
      if (success) {
        showToast({
          type: 'success',
          message: 'Download da imagem iniciado!'
        });
      } else {
        showToast({
          type: 'error',
          message: 'Falha no download da imagem.'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Download falhou. Por favor, tente novamente.'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="generator" className="w-full">
          <div className="flex justify-center mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="generator">Gerador</TabsTrigger>
              <TabsTrigger value="how-it-works">Como Funciona</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="generator">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 xl:col-span-3">
                <ControlPanel
                  onGenerate={handleGenerate}
                  onReset={handleReset}
                  isLoading={isGenerating}
                />
              </div>

              <div className="lg:col-span-8 xl:col-span-9" id="gallery">
                <AnimatePresence mode="wait">
                  {isGenerating && progress ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center min-h-[50vh] lg:min-h-[70vh]"
                    >
                      <Loading progress={progress} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ImageGallery
                        images={generatedImages}
                        onImageClick={openLightbox}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="how-it-works">
            <HowItWorks />
          </TabsContent>
          
          <TabsContent value="faq">
            <FAQ />
          </TabsContent>

        </Tabs>
      </main>

      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
            <p>© 2025 Gerador de Paisagens com IA. Todos os direitos reservados.</p>
        </div>
      </footer>

      <Lightbox
        image={selectedImage}
        isOpen={isOpen}
        onClose={closeLightbox}
        onDownload={handleDownload}
      />
    </div>
  );
}
