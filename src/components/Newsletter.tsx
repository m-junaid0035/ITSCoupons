"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createSubscriberAction, SubscriberFormState } from "@/actions/subscriberActions";

interface FieldErrors {
  [key: string]: string[];
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [formState, dispatch, isPending] = useActionState(createSubscriberAction, {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    // Success message
    if (formState.data && !formState.error) {
      setDialogMessage("You have been successfully subscribed!");
      setDialogOpen(true);
      setEmail(""); // reset input
    }

    // Error message
    if (formState.error && "message" in formState.error) {
      setDialogMessage((formState.error as any).message?.[0] || "Something went wrong!");
      setDialogOpen(true);
    }
  }, [formState]);

  return (
    <section className="bg-white text-center py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Join the Savings Revolution
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-6">
        Get exclusive access to the best deals, early notifications of sales, and personalized coupon recommendations.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.set("email", email); // ✅ set email

          // Wrap the dispatch inside startTransition
          startTransition(() => {
            dispatch(formData);
          });
        }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
      >
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
          disabled={isPending}
        >
          {isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      {/* Field-level error */}
      {errorFor("email") && <p className="text-red-500 mt-2">{errorFor("email")}</p>}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Status</DialogTitle>
          </DialogHeader>
          <p className="py-2">{dialogMessage}</p>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
