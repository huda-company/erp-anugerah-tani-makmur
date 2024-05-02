import { cn } from "@/lib/utils";

import { navItems } from "./constants/data";
import { DashboardNav } from "./DashboardNav";

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen w-72 border-r pt-16 md:block`)}
    >
      <div className="space-y-4 py-2">
        <div className="px-3 py-2 ">
          <div className="space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
