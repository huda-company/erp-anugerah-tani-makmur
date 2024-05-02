import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { navItems } from "./constants/data";
import { DashboardNav } from "./DashboardNav";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="bg-white !px-0">
          <DashboardNav items={navItems} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </>
  );
}
