"use client";

import { useEffect, useRef } from "react";

export interface ISetting {
  _id: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

type SocialKey = "facebookUrl" | "twitterUrl" | "instagramUrl" | "linkedinUrl";

type SettingsModalProps = {
  setting: ISetting;
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ setting, isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const socialKeys: SocialKey[] = ["facebookUrl", "twitterUrl", "instagramUrl", "linkedinUrl"];

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
        className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>

        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">View Setting</h2>
        </header>

        <section className="space-y-4">
          {/* Site Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Site Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {setting.siteName || "N/A"}
            </p>
          </div>

          {/* Meta Title */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {setting.metaTitle || "N/A"}
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
            <p className="text-gray-700 dark:text-gray-300">{setting.metaDescription || "N/A"}</p>
          </div>

          {/* Meta Keywords */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
            <p className="text-gray-700 dark:text-gray-300">
              {Array.isArray(setting.metaKeywords) && setting.metaKeywords.length > 0
                ? setting.metaKeywords.join(", ")
                : "N/A"}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
            <p className="text-gray-700 dark:text-gray-300">{setting.contactEmail || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact Phone</p>
            <p className="text-gray-700 dark:text-gray-300">{setting.contactPhone || "N/A"}</p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
            <p className="text-gray-700 dark:text-gray-300">{setting.address || "N/A"}</p>
          </div>

          {/* Social Links */}
          {socialKeys.map((key) =>
            setting[key] ? (
              <div key={key}>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace("Url", "")}</p>
                <a
                  href={setting[key]}
                  className="text-blue-600 underline break-all"
                  target="_blank"
                  rel="noreferrer"
                >
                  {setting[key]}
                </a>
              </div>
            ) : null
          )}

          {/* Logo */}
          {setting.logo && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Logo</p>
              <img src={setting.logo} alt="Site Logo" className="h-16 w-auto mt-2 rounded" />
            </div>
          )}

          {/* Favicon */}
          {setting.favicon && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Favicon</p>
              <img src={setting.favicon} alt="Favicon" className="h-10 w-10 mt-2 rounded" />
            </div>
          )}

          {/* Created At */}
          {setting.createdAt && (
            <div className="text-sm text-gray-400">Created: {new Date(setting.createdAt).toLocaleString()}</div>
          )}

          {/* Updated At */}
          {setting.updatedAt && (
            <div className="text-sm text-gray-400">Updated: {new Date(setting.updatedAt).toLocaleString()}</div>
          )}
        </section>
      </div>
    </div>
  );
}
