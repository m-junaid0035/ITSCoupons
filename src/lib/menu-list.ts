import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Layers,
  Store,
  Gift,
  Calendar,
  Key,
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
          href: "/admin/dashboard",
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
          href: "",
          label: "Categories",
          icon: Layers,
          submenus: [
            {
              href: "/admin/categories",
              label: "All Categories"
            },
            {
              href: "/admin/categories/new",
              label: "New Categories"
            }
          ]
        },
        {
          href: "",
          label: "Stores",
          icon: Store,
          submenus: [
            {
              href: "/admin/stores",
              label: "All Stores"
            },
            {
              href: "/admin/stores/new",
              label: "New Store"
            }
          ]
        },
        {
          href: "",
          label: "Coupons",
          icon: Gift,
          submenus: [
            {
              href: "/admin/coupons",
              label: "All Coupons"
            },
            {
              href: "/admin/coupons/new",
              label: "New Coupons"
            }
          ]
        },
        {
          href: "",
          label: "Events",
          icon: Calendar,
          submenus: [
            {
              href: "/admin/events",
              label: "All Events"
            },
            {
              href: "/admin/events/new",
              label: "New Events"
            }
          ]
        }
      ]
    },
    {
      groupLabel: "Information",
      menus: [
        {
          href: "",
          label: "Blogs",
          icon: Key,
          submenus: [
            {
              href: "/admin/blogs",
              label: "All Blogs"
            },
            {
              href: "/admin/blogs/new",
              label: "New Blog"
            }
          ]
        },
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "",
          label: "Roles",
          icon: Key,
          submenus: [
            {
              href: "/admin/roles",
              label: "All Roles"
            },
            {
              href: "/admin/roles/new",
              label: "New Role"
            }
          ]
        },
        {
          href: "",
          label: "Users",
          icon: Users,
          submenus: [
            {
              href: "/admin/users",
              label: "All Users"
            },
            {
              href: "/admin/users/new",
              label: "New User"
            }
          ]
        },
        {
          href: "/admin/settings",
          label: "Settings",
          icon: Settings
        },
      ]
    }
  ];
}
