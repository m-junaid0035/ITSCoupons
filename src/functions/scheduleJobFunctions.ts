import cron, { ScheduledTask } from "node-cron";
import { Coupon } from "@/models/Coupon";

let resetTask: ScheduledTask | null = null;

/** 
 * Resets the `uses` field for all coupons to 0 immediately.
 */
export async function resetCouponUses() {
  try {
    const result = await Coupon.updateMany({}, { $set: { uses: 0 } });
    console.log(`[${new Date().toISOString()}] Reset 'uses' for ${result.modifiedCount} coupons.`);
  } catch (error) {
    console.error("Failed to reset coupon uses:", error);
  }
}

/** 
 * Starts the scheduled job that resets coupon uses every 24 hours at midnight.
 */
export function startCouponUsesResetJob() {
  if (resetTask) {
    console.log("Coupon uses reset job is already running.");
    return;
  }
  resetTask = cron.schedule("0 0 * * *", resetCouponUses);
  console.log("Coupon uses reset job started - runs daily at midnight.");
}

/** 
 * Stops the scheduled reset job if running.
 */
export function stopCouponUsesResetJob() {
  if (!resetTask) {
    console.log("Coupon uses reset job is not running.");
    return;
  }
  resetTask.stop();
  resetTask = null;
  console.log("Coupon uses reset job stopped.");
}
