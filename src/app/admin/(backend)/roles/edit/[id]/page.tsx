import { fetchRoleByIdAction } from "@/actions/roleActions";
import EditRoleForm from "./EditRoleForm";

export default async function EditRolePage({ params }: { params: { id: string } }) {
  const res = await fetchRoleByIdAction(params.id);

  if (!res?.data) {
    return <p className="text-red-500 text-center mt-4">Role not found</p>;
  }

  return <EditRoleForm role={res.data} />;
}
