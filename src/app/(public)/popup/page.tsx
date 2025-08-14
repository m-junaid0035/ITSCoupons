"use client"
import UdemyCouponModalReplica from "@/components/coupon_popup";
import { useState } from "react";


// Demo wrapper (optional). Remove if integrating directly.
export  default function DemoCouponModalPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#6e2bbd] px-5 py-3 text-white shadow hover:bg-[#5f22a6]"
      >
        Open Coupon Modal
      </button>
      <UdemyCouponModalReplica open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
