// app/admin/roles/page.tsx
import RolesPageClient, { IRole } from "./RolesPageClient";
import { fetchAllRolesAction } from "@/actions/roleActions";

export default async function RolesPage() {
  const result = await fetchAllRolesAction();
  let roles: IRole[] = [];

  if (result?.data && Array.isArray(result.data)) {
    roles = result.data;
  }

  return <RolesPageClient initialRoles={roles} />;
}
