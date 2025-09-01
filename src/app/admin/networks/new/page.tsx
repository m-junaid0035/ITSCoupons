"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createNetworkAction } from "@/actions/networkActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FormState {
  error?: Record<string, string[]> & { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function NetworkForm() {
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const result = await createNetworkAction(prevState, formData);
      return result;
    },
    initialState
  );

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      alert(
        formState.error.message?.[0] || "An error occurred while saving network"
      );
    }
  }, [formState]);

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Network</CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/networks")}
          >
            Back to Networks
          </Button>
        </CardHeader>

        <CardContent>
          <form
            action={(formData: FormData) => dispatch(formData)}
            className="space-y-6"
          >
            {/* Network Name */}
            <div className="space-y-2">
              <Label htmlFor="networkName">Network Name</Label>
              <Input
                id="networkName"
                name="networkName"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter network name"
              />
            </div>

            {/* Network URL */}
            <div className="space-y-2">
              <Label htmlFor="storeNetworkUrl">Network URL</Label>
              <Input
                id="storeNetworkUrl"
                name="storeNetworkUrl"
                required
                type="url"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="https://example.com"
              />
            </div>

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Network"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Network created successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/networks");
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
