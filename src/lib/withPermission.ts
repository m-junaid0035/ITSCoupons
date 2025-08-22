// app/utils/withPermission.ts
import { getCurrentUserAction } from "@/actions/authActions";
import { redirect } from "next/navigation";

export async function withPermission(permission: string) {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/login"); // Not logged in
  }

  const role = user.role as any;

  if (!role.permissions.includes(permission)) {
    redirect("/unauthorized"); // No permission for this route
  }

  return user;
}
