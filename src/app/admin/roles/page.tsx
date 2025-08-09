"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllRolesAction,
  deleteRoleAction,
} from "@/actions/roleActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IRole {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadRoles() {
    setLoading(true);
    const result = await fetchAllRolesAction();

    if (result.data && Array.isArray(result.data)) {
      // Type assertion here ensures we're treating the response safely
      setRoles(result.data as IRole[]);
    } else {
      console.error("Failed to fetch roles", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this role?")) return;
    setLoading(true);
    const result = await deleteRoleAction(id);

    if (result.error) {
      alert(result.error.message || "Failed to delete role");
    } else {
      await loadRoles();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Roles</CardTitle>
        <Button onClick={() => router.push("/admin/roles/new")}>Create Role</Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Display Name</th>
                <th className="p-2 text-left">Permissions</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{role.name}</td>
                    <td className="p-2">{role.displayName}</td>
                    <td className="p-2">
                      {role.permissions.length > 0
                        ? role.permissions.join(", ")
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/roles/view/${role._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/roles/edit/${role._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(role._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
