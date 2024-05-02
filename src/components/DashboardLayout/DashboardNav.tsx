import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

import { Icons } from "./icons";
import { NavItem } from "./types";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { ScrollArea } from "../ui/scroll-area";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const t = useTranslations("");

  if (!items?.length) {
    return null;
  }

  return (
    <ScrollArea className="h-full w-full bg-red-100">
      <nav className="grid items-start gap-2 overflow-auto">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {/* {item.icon} */}
                  <span>{capitalizeStr(t(`Sidebar.${item.title}`))}</span>
                </span>
              </Link>
            )
          );
        })}
      </nav>
    </ScrollArea>
  );
}
