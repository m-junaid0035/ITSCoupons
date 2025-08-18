import { fetchUserByIdAction } from "@/actions/userActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";


export default async function UserViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchUserByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const user = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View User</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name || "N/A"}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.email || "N/A"}</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <Badge>{user.role || "N/A"}</Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <Badge className={user.isActive ? "bg-green-500" : "bg-red-500"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Created At */}
        {user.createdAt && (
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Created: {new Date(user.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
