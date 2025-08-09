import { fetchEventByIdAction } from "@/actions/eventActions";
import { notFound } from "next/navigation";
import Image from "next/image";

interface EventViewPageProps {
  params: { id: string };
}

export default async function EventViewPage({ params }: EventViewPageProps) {
  const result = await fetchEventByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const event = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Event</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500">Title</p>
          <p className="text-lg font-medium">{event.title}</p>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-lg text-gray-700">
            {new Date(event.date).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Image */}
        {event.image && (
          <div>
            <p className="text-sm text-gray-500">Image</p>
            <Image
              src={event.image}
              alt="Event Image"
              width={500}
              height={300}
              className="rounded-md"
            />
          </div>
        )}

        {/* Meta Title */}
        {event.metaTitle && (
          <div>
            <p className="text-sm text-gray-500">Meta Title</p>
            <p className="text-gray-700">{event.metaTitle}</p>
          </div>
        )}

        {/* Meta Description */}
        {event.metaDescription && (
          <div>
            <p className="text-sm text-gray-500">Meta Description</p>
            <p className="text-gray-700">{event.metaDescription}</p>
          </div>
        )}

        {/* Meta Keywords */}
        {event.metaKeywords && (
          <div>
            <p className="text-sm text-gray-500">Meta Keywords</p>
            <p className="text-gray-700">{event.metaKeywords}</p>
          </div>
        )}

        {/* Focus Keywords */}
        {event.focusKeywords && (
          <div>
            <p className="text-sm text-gray-500">Focus Keywords</p>
            <p className="text-gray-700">{event.focusKeywords}</p>
          </div>
        )}

        {/* Slug */}
        {event.slug && (
          <div>
            <p className="text-sm text-gray-500">Slug</p>
            <p className="text-gray-700">{event.slug}</p>
          </div>
        )}

        {/* Created At */}
        {event.createdAt && (
          <div className="text-sm text-gray-400">
            Created: {new Date(event.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
