import { MountainSnow } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/80 bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        <MountainSnow className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          AI Landscape Generator
        </h1>
      </div>
    </header>
  );
}
