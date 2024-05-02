import { cn } from "@/lib/utils";

import { navItems } from "./constants/data";
import { DashboardNav } from "./DashboardNav";

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen w-72 border-r pt-16 md:block`)}
    >
      <DashboardNav items={navItems} />
    </nav>
  );
}
