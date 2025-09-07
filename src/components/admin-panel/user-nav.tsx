"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { getCurrentUserAction, logoutAction } from "@/actions/authActions";
import { fetchAllRolesAction } from "@/actions/roleActions";

import type { UserData } from "@/types/user";

interface IRole {
  _id: string;
  name: string;
  displayName: string;
}

export function UserNav() {
  const [user, setUser] = useState<UserData | null>(null);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ controlled menu

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUserAction();
      if (currentUser) {
        setUser({
          ...currentUser,
          role: currentUser.role ?? undefined, // convert null → undefined
          createdAt: currentUser.createdAt ?? null,
          updatedAt: currentUser.updatedAt ?? null,
        });
      }
    }
    fetchUser();
  }, []);

  // Fetch all roles to display role names
  useEffect(() => {
    async function loadRoles() {
      const rolesResult = await fetchAllRolesAction();
      if (rolesResult?.data && Array.isArray(rolesResult.data)) {
        setRoles(rolesResult.data);
      }
    }
    loadRoles();
  }, []);

  // Convert role ID to role display name
  const getRoleName = (roleId?: string) => {
    if (!roleId) return "User";
    const roleObj = roles.find((r) => String(r._id) === String(roleId));
    return roleObj?.displayName || roleObj?.name || "User";
  };

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    window.location.href = "/auth/login"; // redirect after logout
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-transparent">
                      {user?.name ? user.name[0] : "JD"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || "John Doe"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "johndoe@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            {/* Open Account Dialog instead of link */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault(); // ✅ prevent Radix default select behavior
                setMenuOpen(false); // ✅ close menu first
                setAccountDialogOpen(true); // ✅ then open dialog
              }}
            >
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              handleLogout();
            }}
          >
            <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Dialog */}
      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Account Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {user?.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Role:</p>
              <p className="text-xs text-muted-foreground">
                {getRoleName(user?.role)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Status:</p>
              <p className="text-xs text-muted-foreground">
                {user?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setAccountDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
