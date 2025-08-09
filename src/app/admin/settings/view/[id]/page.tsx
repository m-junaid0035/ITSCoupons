import { fetchSettingByIdAction } from "@/actions/settingActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface SettingsViewPageProps {
  params: { id: string };
}

export default async function SettingsViewPage({ params }: SettingsViewPageProps) {
  const result = await fetchSettingByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const setting = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Setting</h2>

      <div className="space-y-4">
        {/* Site Name */}
        <div>
          <p className="text-sm text-gray-500">Site Name</p>
          <p className="text-lg font-medium">{setting.siteName || "N/A"}</p>
        </div>

        {/* Meta Title */}
        <div>
          <p className="text-sm text-gray-500">Meta Title</p>
          <p className="text-lg font-medium">{setting.metaTitle || "N/A"}</p>
        </div>

        {/* Meta Description */}
        <div>
          <p className="text-sm text-gray-500">Meta Description</p>
          <p className="text-gray-700">{setting.metaDescription || "N/A"}</p>
        </div>

        {/* Meta Keywords */}
        <div>
          <p className="text-sm text-gray-500">Meta Keywords</p>
          <p className="text-gray-700">{(setting.metaKeywords || []).join(", ") || "N/A"}</p>
        </div>

        {/* Contact Email */}
        <div>
          <p className="text-sm text-gray-500">Contact Email</p>
          <p className="text-gray-700">{setting.contactEmail || "N/A"}</p>
        </div>

        {/* Contact Phone */}
        <div>
          <p className="text-sm text-gray-500">Contact Phone</p>
          <p className="text-gray-700">{setting.contactPhone || "N/A"}</p>
        </div>

        {/* Address */}
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-gray-700">{setting.address || "N/A"}</p>
        </div>

        {/* Facebook URL */}
        {setting.facebookUrl && (
          <div>
            <p className="text-sm text-gray-500">Facebook</p>
            <a
              href={setting.facebookUrl}
              className="text-blue-600 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {setting.facebookUrl}
            </a>
          </div>
        )}

        {/* Twitter URL */}
        {setting.twitterUrl && (
          <div>
            <p className="text-sm text-gray-500">Twitter</p>
            <a
              href={setting.twitterUrl}
              className="text-blue-600 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {setting.twitterUrl}
            </a>
          </div>
        )}

        {/* Instagram URL */}
        {setting.instagramUrl && (
          <div>
            <p className="text-sm text-gray-500">Instagram</p>
            <a
              href={setting.instagramUrl}
              className="text-blue-600 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {setting.instagramUrl}
            </a>
          </div>
        )}

        {/* LinkedIn URL */}
        {setting.linkedinUrl && (
          <div>
            <p className="text-sm text-gray-500">LinkedIn</p>
            <a
              href={setting.linkedinUrl}
              className="text-blue-600 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {setting.linkedinUrl}
            </a>
          </div>
        )}

        {/* Logo */}
        {setting.logo && (
          <div>
            <p className="text-sm text-gray-500">Logo</p>
            <img
              src={setting.logo}
              alt="Site Logo"
              className="h-16 w-auto mt-2 rounded"
            />
          </div>
        )}

        {/* Favicon */}
        {setting.favicon && (
          <div>
            <p className="text-sm text-gray-500">Favicon</p>
            <img
              src={setting.favicon}
              alt="Favicon"
              className="h-10 w-10 mt-2 rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
