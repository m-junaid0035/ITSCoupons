"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchRoleByIdAction } from "@/actions/roleActions"; // Import the server action

export interface IUser {
  _id: string;
  name: string;
  email?: string;
  role: string; // role id
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

type UserModalProps = {
  user: IUser;
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [roleName, setRoleName] = useState<string>("");

  // Fetch role displayName if role ID exists
  useEffect(() => {
    if (!user.role) return;

    async function loadRole() {
      try {
        const result = await fetchRoleByIdAction(user.role);
        if (result?.data) {
          setRoleName(result.data.displayName);
        } else {
          setRoleName("N/A");
        }
      } catch (err) {
        setRoleName("N/A");
      }
    }

    loadRole();
  }, [user.role]);

  // Close modal if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <div
        ref={modalRef}
        className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>

        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            View User
          </h2>
        </header>

        <section className="space-y-4">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {user.name || "N/A"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {user.email || "N/A"}
            </p>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <Badge>{roleName || "N/A"}</Badge>
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
            <div className="text-sm text-gray-400">
              Created: {new Date(user.createdAt).toLocaleString()}
            </div>
          )}

          {/* Updated At */}
          {user.updatedAt && (
            <div className="text-sm text-gray-400">
              Updated: {new Date(user.updatedAt).toLocaleString()}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
