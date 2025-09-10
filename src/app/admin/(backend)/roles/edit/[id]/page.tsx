import { fetchRoleByIdAction } from "@/actions/roleActions";
import EditRoleForm from "./EditRoleForm";

export default async function EditRolePage({ params }: { params: Promise<{ id: "" }> }) {
  const { id = "" } = await params;
  const res = await fetchRoleByIdAction(id);

  if (!res?.data) {
    return <p className="text-red-500 text-center mt-4">Role not found</p>;
  }

  return <EditRoleForm role={res.data} />;
}
