// app/admin/networks/view/[id]/page.tsx
import { getNetworkById } from "@/functions/networkFunctions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Network {
  _id: string;
  networkName: string;
  storeNetworkUrl: string;
  createdAt: string;
  updatedAt?: string;
}

export default async function NetworkViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawNetwork = await getNetworkById(id);

  if (!rawNetwork) return notFound();

  const network = rawNetwork as Network;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          View Network
        </h2>
      </header>

      <section className="space-y-6">
        {/* Network Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Network Name</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {network.networkName}
          </p>
        </div>

        {/* Network URL */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Network URL</p>
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
        {network.updatedAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-sm text-gray-400">
              {new Date(network.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
