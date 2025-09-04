"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface IRole {
  _id: string;              // Role ID
  name: string;             // Role name
  displayName: string;      // Display name
  permissions: string[];    // Array of permission strings
  createdAt?: string;       // Optional ISO string
  updatedAt?: string;       // Optional ISO string
}

type RoleModalProps = {
  role?: IRole | null;     // Optional to prevent crashes if role is undefined
  isOpen: boolean;
  onClose: () => void;
};

export default function RoleModal({ role, isOpen, onClose }: RoleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen || !role) return null;

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
            View Role
          </h2>
        </header>

        <section className="space-y-4">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {role.name}
            </p>
          </div>

          {/* Display Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Display Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {role.displayName}
            </p>
          </div>

          {/* Permissions */}
          {role.permissions && role.permissions.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <Badge key={perm} className="capitalize">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Created At */}
          {role.createdAt && (
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Created: {new Date(role.createdAt).toLocaleString()}
            </div>
          )}

          {/* Updated At */}
          {role.updatedAt && (
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Updated: {new Date(role.updatedAt).toLocaleString()}
            </div>
          )}
        </section>

        <footer className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
}
