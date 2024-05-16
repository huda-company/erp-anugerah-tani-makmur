import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";

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

  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

  const toggleDropdown = (index: string) => {
    setOpenDropdown((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!items?.length) {
    return null;
  }

  return (
    <ScrollArea className="h-full w-full">
      <nav className="grid items-start gap-2 overflow-auto">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          const isOpen = openDropdown[`dropdown-${index}`];
          return (
            <div key={index}>
              <Link
                href={item.disabled ? "#" : item.href || "#"}
                onClick={(e) => {
                  if (item.subItems) {
                    e.preventDefault();
                    toggleDropdown(`dropdown-${index}`);
                  }
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
                  <span>{capitalizeStr(t(`Sidebar.${item.title}`))}</span>
                  {item.subItems && (
                    <span className="ml-auto">
                      {isOpen ? <Icons.chevronDown /> : <Icons.chevronRight />}
                    </span>
                  )}
                </span>
              </Link>
              {isOpen && item.subItems && (
                <div className="ml-4">
                  {item.subItems.map((subItem, subIndex) => {
                    const SubIcon = Icons[subItem.icon || "arrowRight"];
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href || "#"}
                        onClick={() => setOpen && setOpen(false)}
                      >
                        <span className="block flex px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ">
                          <SubIcon className="mr-2 h-4 w-4" />
                          {capitalizeStr(t(`Sidebar.${subItem.title}`))}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
