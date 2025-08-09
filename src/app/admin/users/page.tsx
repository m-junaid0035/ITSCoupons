"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllUsersAction,
  deleteUserAction,
} from "@/actions/userActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    const result = await fetchAllUsersAction();

    if (result.data && Array.isArray(result.data)) {
      setUsers(result.data as IUser[]);
    } else {
      console.error("Failed to fetch users", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);

    const result = await deleteUserAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete user");
    } else {
      await loadUsers();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button onClick={() => router.push("/admin/users/new")}>
          Create User
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.isActive ? "Yes" : "No"}</td>
                    <td className="p-2">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(`/admin/users/view/${user._id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/admin/users/edit/${user._id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(user._id)}
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
                    colSpan={8}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No users found.
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
