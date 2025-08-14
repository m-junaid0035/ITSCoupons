"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";

export default function Bar() {
  const sidebar = useStore(useSidebar, (x) => x);
  const pathname = usePathname();

  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  // Build dynamic breadcrumb items
  const segments = pathname
    .split("?")[0] // remove query params
    .split("#")[0] // remove hash
    .split("/")
    .filter(Boolean);

 const breadcrumbItems = segments
  .filter((segment, index) => {
    const prev = segments[index - 1]?.toLowerCase();
    const next = segments[index + 1]?.toLowerCase();

    // If segment is an ObjectId and is before/after an action, skip it
    if (
      /^[0-9a-fA-F]{24}$/.test(segment) &&
      (prev === "edit" || prev === "new" || prev === "view")
    ) {
      return false;
    }
    if (
      (segment.toLowerCase() === "edit" ||
        segment.toLowerCase() === "new" ||
        segment.toLowerCase() === "view") &&
      /^[0-9a-fA-F]{24}$/.test(next)
    ) {
      return true; // keep action name
    }
    return true;
  })
  .map((segment, index, filteredSegments) => {
    const href = "/" + filteredSegments.slice(0, index + 1).join("/");

    let label: string;
    const lower = segment.toLowerCase();

    if (lower === "new") {
      label = "New";
    } else if (lower === "edit") {
      label = "Edit";
    } else if (lower === "view") {
      label = "View";
    } else if (lower === "admin") {
      label = "Dashboard";
    } else {
      label = decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return { href, label };
  });
;

  return (
    <ContentLayout title={breadcrumbItems.at(-1)?.label || "Dashboard"}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <TooltipProvider>
        <div className="flex gap-6 mt-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-hover-open"
                  onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
                  checked={settings.isHoverOpen}
                />
                <Label htmlFor="is-hover-open">Hover Open</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>When hovering on the sidebar in mini state, it will open</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disable-sidebar"
                  onCheckedChange={(x) => setSettings({ disabled: x })}
                  checked={settings.disabled}
                />
                <Label htmlFor="disable-sidebar">Disable Sidebar</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </ContentLayout>
  );
}
