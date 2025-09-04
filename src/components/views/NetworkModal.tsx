"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface INetwork {
  _id: string;
  networkName?: string;
  storeNetworkUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

type NetworkModalProps = {
  network: INetwork;
  isOpen: boolean;
  onClose: () => void;
};

export default function NetworkModal({ network, isOpen, onClose }: NetworkModalProps) {
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            View Network
          </h2>
        </header>

        <section className="space-y-4">
          {/* Network Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Network Name</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {network.networkName || "N/A"}
            </p>
          </div>

          {/* Network URL */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Network URL</p>
            {network.storeNetworkUrl ? (
              <Badge variant="secondary">
                <a
                  href={network.storeNetworkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {network.storeNetworkUrl}
                </a>
              </Badge>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-sm text-gray-400">
              {network.createdAt
                ? new Date(network.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Updated At */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-sm text-gray-400">
              {network.updatedAt
                ? new Date(network.updatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
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
