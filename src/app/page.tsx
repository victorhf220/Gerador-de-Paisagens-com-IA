"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { UrlForm } from "@/components/app/UrlForm";
import { ContentDisplay } from "@/components/app/ContentDisplay";
import { SavedContentList } from "@/components/app/SavedContentList";
import { type SavedContent } from "@/lib/types";
import { type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

type DisplayContent = {
  id?: string;
  url: string;
  summary: string;
  keywords: string[];
  createdAt?: string;
  isSaved: boolean;
};

const LOCAL_STORAGE_KEY = "content-curator-saved-items";

export default function Home() {
  const [savedItems, setSavedItems] = useState<SavedContent[]>([]);
  const [currentContent, setCurrentContent] = useState<DisplayContent | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const items = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (items) {
        setSavedItems(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load from local storage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load saved items from your browser.",
      });
    }
  }, [toast]);

  const updateSavedItems = useCallback(
    (items: SavedContent[]) => {
      setSavedItems(items);
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save to local storage", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not save items to your browser.",
        });
      }
    },
    [toast]
  );

  const handleResult = useCallback((data: FormState["data"]) => {
    if (data) {
      const isAlreadySaved = savedItems.some((item) => item.url === data.url);
      if (isAlreadySaved) {
        const savedItem = savedItems.find((item) => item.url === data.url)!;
        setCurrentContent({ ...savedItem, isSaved: true });
      } else {
        setCurrentContent({ ...data, isSaved: false });
      }
      toast({
        title: "Success!",
        description: "Content has been curated.",
      });
    }
  }, [savedItems, toast]);

  const handleSave = () => {
    if (!currentContent || currentContent.isSaved) return;

    const newItem: SavedContent = {
      id: Date.now().toString(),
      url: currentContent.url,
      summary: currentContent.summary,
      keywords: currentContent.keywords,
      createdAt: new Date().toISOString(),
    };

    updateSavedItems([newItem, ...savedItems]);
    setCurrentContent({ ...newItem, isSaved: true });
    toast({
      title: "Content Saved",
      description: "Your curated content has been saved.",
    });
  };

  const handleSelect = (item: SavedContent) => {
    setCurrentContent({ ...item, isSaved: true });
  };

  const handleDelete = (id: string) => {
    if (currentContent?.id === id) {
      setCurrentContent(null);
    }
    updateSavedItems(savedItems.filter((item) => item.id !== id));
    toast({
      title: "Content Deleted",
      description: "The saved content has been removed.",
    });
  };

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(savedItems, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "content-curator-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your saved content has been exported.",
      });
    } catch (error) {
      console.error("Export failed", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not export your content.",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const importedItems: SavedContent[] = JSON.parse(text);
          // Basic validation
          if (
            Array.isArray(importedItems) &&
            importedItems.every((item) => item.id && item.url && item.summary)
          ) {
            updateSavedItems(importedItems);
            toast({
              title: "Import Successful",
              description: `${importedItems.length} items imported.`,
            });
          } else {
            throw new Error("Invalid file format");
          }
        }
      } catch (error) {
        console.error("Import failed", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected file is not valid.",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
          <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-8">
            <UrlForm onResult={handleResult} />
            <SavedContentList
              items={savedItems}
              activeItemId={currentContent?.isSaved ? currentContent.id : null}
              onSelectItem={handleSelect}
              onDeleteItem={handleDelete}
              onExport={handleExport}
              onImport={handleImport}
            />
          </div>
          <div className="lg:col-span-2 xl:col-span-3">
            <ContentDisplay
              content={currentContent}
              onSave={handleSave}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
