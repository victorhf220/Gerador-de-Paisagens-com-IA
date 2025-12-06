"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { processUrl, type FormState } from "@/app/actions";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

const initialState: FormState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {pending ? "Curating..." : "Curate Content"}
    </Button>
  );
}

export function UrlForm({ onResult }: { onResult: (data: FormState["data"]) => void }) {
  const [state, formAction] = useActionState(processUrl, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        onResult(state.data);
        formRef.current?.reset();
      } else if (!state.success) {
        toast({
          variant: "destructive",
          title: "Curation Failed",
          description: state.message,
        });
      }
    }
  }, [state, onResult, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Curate a New Article</CardTitle>
        <CardDescription>
          Enter a URL to summarize and extract keywords using AI.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/article"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="customPrompt"
              name="customPrompt"
              placeholder="e.g., Summarize for a 5th grader."
              className="font-code"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
