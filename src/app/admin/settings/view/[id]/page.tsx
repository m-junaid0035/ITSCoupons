import { fetchSettingByIdAction } from "@/actions/settingActions";
import { notFound } from "next/navigation";

type SocialKey = "facebookUrl" | "twitterUrl" | "instagramUrl" | "linkedinUrl";

interface SettingType {
  _id: any;
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

interface SettingsViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function SettingsViewPage({ params }: SettingsViewPageProps) {
  const resolvedParams = await params;
  const result = await fetchSettingByIdAction(resolvedParams.id);

  if (!result || result.error || !result.data) return notFound();

  const setting: SettingType = result.data; // explicitly typed
  const socialKeys: SocialKey[] = ["facebookUrl", "twitterUrl", "instagramUrl", "linkedinUrl"];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View Setting</h2>

      <div className="space-y-4">
        {/* Site Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Site Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{setting.siteName || "N/A"}</p>
        </div>

        {/* Meta Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{setting.metaTitle || "N/A"}</p>
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

        {/* Contact Email */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
          <p className="text-gray-700 dark:text-gray-300">{setting.contactEmail || "N/A"}</p>
        </div>

        {/* Contact Phone */}
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
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Created: {new Date(setting.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
