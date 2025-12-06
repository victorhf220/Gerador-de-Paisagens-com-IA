import { BookText } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        <BookText className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Content Curator AI
        </h1>
      </div>
    </header>
  );
}
