import {
  Users,
  Settings,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Layers,
  Store,
  Gift,
  Calendar,
  Key,
  Shield,
  Tag,
  Link,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/admin/categories",
          label: "Categories",
          icon: Layers,
        },
        {
          href: "/admin/networks",
          label: "Networks",
          icon: Link,
        },
        {
          href: "/admin/stores",
          label: "Stores",
          icon: Store,
        },
        {
          href: "/admin/coupons",
          label: "Coupons",
          icon: Gift,
        },
        {
          href: "/admin/events",
          label: "Events",
          icon: Calendar,
        }
      ]
    },
    {
      groupLabel: "Information",
      menus: [
        {
          href: "/admin/blogs",
          label: "Blogs",
          icon: SquarePen,
        },
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/admin/roles",
          label: "Roles",
          icon: Shield,
        },
        {
          href: "/admin/subscribers",
          label: "Subscribers",
          icon: Key,
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/admin/settings",
          label: "Settings",
          icon: Settings
        },
        {
          href: "/admin/seo",
          label: "SEO Templates",
          icon: Tag
        },
      ]
    }
  ];
}
