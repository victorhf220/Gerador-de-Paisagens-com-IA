"use client";

import { useRef } from "react";
import type { SavedContent } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Inbox, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type SavedListProps = {
  items: SavedContent[];
  activeItemId: string | null;
  onSelectItem: (item: SavedContent) => void;
  onDeleteItem: (id: string) => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
};

export function SavedContentList({
  items,
  activeItemId,
  onSelectItem,
  onDeleteItem,
  onImport,
  onExport,
}: SavedListProps) {
  const importRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Saved Content</CardTitle>
            <CardDescription>Your curated articles.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => importRef.current?.click()}
              aria-label="Import"
            >
              <Upload className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={importRef}
              onChange={onImport}
              className="hidden"
              accept=".json"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onExport}
              disabled={items.length === 0}
              aria-label="Export"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[45vh]">
          {items.length > 0 ? (
            <div className="space-y-2 pr-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors group",
                    activeItemId === item.id
                      ? "bg-primary/10 border-primary/50"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate text-foreground">
                        {new URL(item.url).hostname}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.summary}
                      </p>
                       <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <Inbox className="h-10 w-10" />
              <p className="mt-4 font-medium">No Saved Content</p>
              <p className="text-sm">
                Your saved articles will appear here.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
