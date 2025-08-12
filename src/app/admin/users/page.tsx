"use client";

import { useEffect, useState, Suspense, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { fetchAllUsersAction, deleteUserAction } from "@/actions/userActions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

function UsersTable({
  users,
  onView,
  onEdit,
  onDelete,
}: {
  users: IUser[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id} className="hover:bg-muted/40">
                <TableCell>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? "✅" : "❌"}</TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(user._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(user._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(user._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [optimisticUsers, deleteOptimistic] = useOptimistic(
    users,
    (state, id: string) => state.filter((u) => u._id !== id)
  );

  const loadUsers = async () => {
    setLoading(true);
    const result = await fetchAllUsersAction();
    if (result.data && Array.isArray(result.data)) {
      setUsers(result.data as IUser[]);
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to load users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    deleteOptimistic(id);
    const result = await deleteUserAction(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete user",
        variant: "destructive",
      });
      await loadUsers();
    } else {
      toast({ title: "Deleted", description: "User deleted successfully." });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Users</CardTitle>
        <Button onClick={() => router.push("/admin/users/new")}>
          Create User
        </Button>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<p className="p-4 text-muted-foreground">Loading users...</p>}>
          <UsersTable
            users={optimisticUsers}
            onView={(id) => router.push(`/admin/users/view/${id}`)}
            onEdit={(id) => router.push(`/admin/users/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        </Suspense>
      </CardContent>

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDeleteId) handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
