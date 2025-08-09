// app/admin/roles/view/[id]/page.tsx
import { getRoleById } from '@/functions/roleFunctions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface RoleViewPageProps {
  params: { id: string };
}

export default async function RoleViewPage({ params }: RoleViewPageProps) {
  const role = await getRoleById(params.id);

  if (!role) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Role</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium">{role.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Display Name</p>
          <p className="text-lg font-medium">{role.displayName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {role.permissions?.map((perm:string) => (
              <Badge key={perm}>{perm}</Badge>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Created: {new Date(role.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
