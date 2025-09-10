// app/admin/users/create/page.tsx
import { fetchAllRolesAction } from "@/actions/roleActions";
import UserForm from "./UserCreateForm";

export default async function CreateUserPage() {
  const result = await fetchAllRolesAction();
  const roles = result.data && Array.isArray(result.data) ? result.data : [];

  return <UserForm roles={roles} />;
}
