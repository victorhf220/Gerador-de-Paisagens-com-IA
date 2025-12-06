
import { MountainSnow } from 'lucide-react';
import { motion } from 'framer-motion';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/80 bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <MountainSnow className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            AI Landscape Generator
          </h1>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
          <a href="#gallery" className="text-muted-foreground hover:text-foreground transition-colors">
            Gallery
          </a>
        </nav>
      </div>
    </header>
  );
}
