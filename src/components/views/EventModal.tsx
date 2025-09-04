"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface IEvent {
  _id: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

type EventModalProps = {
  event: IEvent;
  isOpen: boolean;
  onClose: () => void;
};

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>View Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {event.title}
            </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Description
              </p>
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
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

          {/* Meta Title */}
          {event.metaTitle && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meta Title
              </p>
              <Badge className="bg-indigo-600 dark:bg-indigo-500">
                {event.metaTitle}
              </Badge>
            </div>
          )}

          {/* Meta Description */}
          {event.metaDescription && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meta Description
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {event.metaDescription}
              </p>
            </div>
          )}

          {/* Meta Keywords */}
          {event.metaKeywords && event.metaKeywords.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meta Keywords
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {event.metaKeywords.map((keyword, i) => (
                  <Badge key={i} className="bg-yellow-500 dark:bg-yellow-400">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Focus Keywords */}
          {event.focusKeywords && event.focusKeywords.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Focus Keywords
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {event.focusKeywords.map((keyword, i) => (
                  <Badge key={i} className="bg-green-600 dark:bg-green-500">
                    {keyword}
                  </Badge>
                ))}
              </div>
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

          {/* Updated At */}
          {event.updatedAt && (
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Updated: {new Date(event.updatedAt).toLocaleString()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
