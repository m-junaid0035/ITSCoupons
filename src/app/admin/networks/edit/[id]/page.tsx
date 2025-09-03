"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import LoadingSkeleton from "./loading"; // Your skeleton loader component
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

import {
  fetchNetworkByIdAction,
  updateNetworkAction,
} from "@/actions/networkActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditNetworkForm() {
  const params = useParams();
  const networkId = params.id as string;
  const router = useRouter();

  const [network, setNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateNetworkAction(prevState, networkId, formData),
    initialState
  );

  useEffect(() => {
    async function loadNetwork() {
      const res = await fetchNetworkByIdAction(networkId);
      if (res?.data) {
        setNetwork(res.data);
      }
      setLoading(false);
    }
    loadNetwork();
  }, [networkId]);

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

  if (loading) return <LoadingSkeleton />;
  if (!network)
    return (
      <p className="text-red-500 text-center mt-4">Network not found</p>
    );

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit Network</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/networks")}>Back to Netoworks</Button>
        </CardHeader>

      <CardContent>
        <form
          action={(formData: FormData) => dispatch(formData)}
          className="space-y-6"
        >
          {/* Network Name */}
          <div className="space-y-2">
            <Label htmlFor="networkName">Network Name <span className="text-red-500">*</span></Label>
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

          {/* Network URL */}
          <div className="space-y-2">
            <Label htmlFor="storeNetworkUrl">Network URL <span className="text-red-500">*</span></Label>
            <Input
              id="storeNetworkUrl"
              name="storeNetworkUrl"
              defaultValue={network.storeNetworkUrl}
              required
              type="url"
              className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              placeholder="https://example.com"
            />
            {errorFor("storeNetworkUrl") && (
              <p className="text-sm text-red-500">
                {errorFor("storeNetworkUrl")}
              </p>
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
