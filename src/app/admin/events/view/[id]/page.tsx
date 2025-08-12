import { fetchEventByIdAction } from "@/actions/eventActions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface EventViewPageProps {
  params: { id: string };
}

export default async function EventViewPage({ params }: EventViewPageProps) {
  const result = await fetchEventByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const event = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View Event</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {new Date(event.date).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Image */}
        {event.image && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Image</p>
            <Image
              src={event.image}
              alt="Event Image"
              width={500}
              height={300}
              className="rounded-md"
            />
          </div>
        )}

        {/* Meta Title (as badge) */}
        {event.metaTitle && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
            <Badge className="bg-indigo-600 dark:bg-indigo-500">{event.metaTitle}</Badge>
          </div>
        )}

        {/* Meta Description */}
        {event.metaDescription && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
            <p className="text-gray-700 dark:text-gray-300">{event.metaDescription}</p>
          </div>
        )}

        {/* Meta Keywords */}
        {event.metaKeywords && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
            <Badge className="bg-yellow-500 dark:bg-yellow-400">{event.metaKeywords}</Badge>
          </div>
        )}

        {/* Focus Keywords */}
        {event.focusKeywords && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
            <Badge className="bg-green-600 dark:bg-green-500">{event.focusKeywords}</Badge>
          </div>
        )}

        {/* Slug */}
        {event.slug && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
            <Badge className="bg-gray-600 dark:bg-gray-400">{event.slug}</Badge>
          </div>
        )}

        {/* Created At */}
        {event.createdAt && (
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Created: {new Date(event.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
