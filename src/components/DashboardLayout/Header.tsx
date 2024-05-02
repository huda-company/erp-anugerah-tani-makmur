/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { MobileSidebar } from "./MobileSidebar";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import UserNav from "./UserNav";
import LocaleSwitcher from "../LocalSwitcher";

import { APP_NAME } from "^/config/env";
import clsxm from "^/utils/clsxm";

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden md:block">
          <div className="flex flex-row items-center gap-2">
            <Link href="/">
              <div
                className={clsxm(
                  "rounded-[0.5rem]",
                  theme == "dark" && " bg-white "
                )}
              >
                <img
                  src="/logo.png"
                  className="h-8 px-1 py-1"
                  alt="FlowBite Logo"
                  height={40}
                  width={40}
                />
              </div>
            </Link>
            {APP_NAME}
          </div>
        </div>
        <div className={cn("block sm:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
