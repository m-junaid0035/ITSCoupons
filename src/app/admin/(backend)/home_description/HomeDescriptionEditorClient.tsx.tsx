"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { upsertHomeDescriptionAction } from "@/actions/homeDesActions";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };

export default function HomeDescriptionEditorClient({
  initialDescription,
  descriptionId,
}: {
  initialDescription: string;
  descriptionId: string | null;
}) {
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    upsertHomeDescriptionAction,
    initialState
  );

  const [descriptionHtml, setDescriptionHtml] = useState(initialDescription);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Show toast on error & success dialog on save
  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] ||
          "Something went wrong while saving",
        variant: "destructive",
      });
    }
  }, [formState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("description", descriptionHtml);

    // Include ID only if it exists
    if (descriptionId) formData.set("id", descriptionId);

    startTransition(() => dispatch(formData)); // ✅ This works with your server action
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader>
          <CardTitle>Home Description</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rich Text Editor */}
            <RichTextEditor
              value={descriptionHtml}
              onChange={(val) => {
                if (val.length <= 5000) {
                  setDescriptionHtml(val);
                } else {
                  toast({
                    title: "Limit reached",
                    description: "Maximum 5000 characters allowed",
                    variant: "destructive",
                  });
                }
              }}
            />
            {/* Preview */}
            <div className="mt-6 border-t pt-4">
              <h2 className="font-semibold mb-2">Preview</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: descriptionHtml || "<p>No description yet.</p>",
                }}
              />
            </div>

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Home description saved successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.refresh();
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
