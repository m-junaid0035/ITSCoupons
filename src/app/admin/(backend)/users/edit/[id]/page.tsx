// app/admin/users/[id]/edit/page.tsx
import { fetchUserByIdAction } from "@/actions/userActions";
import { fetchAllRolesAction } from "@/actions/roleActions";
import EditUserForm from "./EditUserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: "" }> }) {
  const { id = "" } = await params;
  const [userRes, rolesRes] = await Promise.all([
    fetchUserByIdAction(id),
    fetchAllRolesAction(),
  ]);

  if (!userRes?.data) {
    return <p className="text-center py-8 text-red-500">User not found</p>;
  }

  return <EditUserForm user={userRes.data} roles={rolesRes?.data ?? []} />;
}
