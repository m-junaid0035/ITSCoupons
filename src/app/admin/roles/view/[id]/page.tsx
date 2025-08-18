import { fetchRoleByIdAction } from "@/actions/roleActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function RoleViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchRoleByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const role = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View Role</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{role.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Display Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{role.displayName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {role.permissions?.map((perm: string) => (
              <Badge key={perm} className="capitalize">
                {perm}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400 dark:text-gray-500">
          Created: {new Date(role.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
