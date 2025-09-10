import { fetchAllUsersAction, deleteUserAction } from "@/actions/userActions";
import { fetchAllRolesAction } from "@/actions/roleActions";
import UsersPageClient from "./UsersPageClient";

export default async function UsersPage() {
  const [usersResult, rolesResult] = await Promise.all([
    fetchAllUsersAction(),
    fetchAllRolesAction(),
  ]);

  const users = usersResult?.data || [];
  const roles = rolesResult?.data || [];

  return <UsersPageClient initialUsers={users} initialRoles={roles} />;
}
