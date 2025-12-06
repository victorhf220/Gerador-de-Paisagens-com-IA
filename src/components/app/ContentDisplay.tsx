"use client";

import type { SavedContent } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Sparkles, Link as LinkIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

type DisplayContent = {
  id?: string;
  url: string;
  summary: string;
  keywords: string[];
  createdAt?: string;
  isSaved: boolean;
};

type ContentDisplayProps = {
  content: DisplayContent | null;
  onSave: () => void;
};

export function ContentDisplay({ content, onSave }: ContentDisplayProps) {
  if (!content) {
    return (
      <Card className="flex min-h-[60vh] w-full items-center justify-center rounded-xl border-2 border-dashed shadow-none">
        <div className="text-center text-muted-foreground p-8">
          <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
          <h2 className="mt-6 text-xl font-semibold text-foreground">
            Your Curated Content Appears Here
          </h2>
          <p className="mt-2">
            Submit a URL on the left to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Curated Content</CardTitle>
                <CardDescription className="pt-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4"/>
                    <a href={content.url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {content.url}
                    </a>
                </CardDescription>
            </div>
             <Button onClick={onSave} disabled={content.isSaved} variant={content.isSaved ? "secondary" : "default"}>
                <Save className="mr-2 h-4 w-4" />
                {content.isSaved ? "Saved" : "Save Content"}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
          <div className="space-y-6">
              <div>
                  <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
                  <ScrollArea className="h-[40vh] pr-4">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{content.summary}</p>
                  </ScrollArea>
              </div>
              <div>
                  <h3 className="text-lg font-semibold mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                      {content.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground hover:bg-accent/30">
                              {keyword}
                          </Badge>
                      ))}
                  </div>
              </div>
          </div>
      </CardContent>
    </Card>
  );
}
