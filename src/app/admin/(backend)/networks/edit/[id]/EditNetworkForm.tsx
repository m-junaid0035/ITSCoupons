"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateNetworkAction } from "@/actions/networkActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditNetworkForm({ network }: { network: any }) {
  const router = useRouter();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateNetworkAction(prevState, network._id, formData),
    initialState
  );

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Edit Network
        </CardTitle>
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
            <Label htmlFor="networkName">
              Network Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="networkName"
              name="networkName"
              defaultValue={network.networkName}
              required
              className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              placeholder="Enter network name"
            />
            {errorFor("networkName") && (
              <p className="text-sm text-red-500">{errorFor("networkName")}</p>
            )}
          </div>

          {/* General Error */}
          {"message" in (formState.error ?? {}) && (
            <p className="text-sm text-red-500">
              {(formState.error as any).message?.[0]}
            </p>
          )}

          <CardFooter className="flex justify-end border-none">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Update Network"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Network updated successfully!</p>
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
    </Card>
  );
}
