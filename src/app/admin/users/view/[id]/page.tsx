import { fetchUserByIdAction } from "@/actions/userActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface UserViewPageProps {
  params: { id: string };
}

export default async function UserViewPage({ params }: UserViewPageProps) {
  const result = await fetchUserByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const user = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View User</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium">{user.name || "N/A"}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <Badge>{user.role}</Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <Badge className={user.isActive ? "bg-green-500" : "bg-red-500"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>


        {/* Created At */}
        {user.createdAt && (
          <div className="text-sm text-gray-400">
            Created: {new Date(user.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
