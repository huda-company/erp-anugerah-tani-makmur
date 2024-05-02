import {
  BRANCHES_PAGE,
  ITEM_CAT_PAGE,
  ITEM_PAGE,
  PO_PAGE,
  SUPPLIER_PAGE,
  USER_PAGE,
} from "@/constants/pageURL";
import { NavItem } from "../types";

export const navItems: NavItem[] = [
  {
    title: "dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "supplier",
    href: SUPPLIER_PAGE.ROOT,
    icon: "user",
    label: "user",
  },
  {
    title: "purchaseOrder",
    href: PO_PAGE.ROOT,
    icon: "shoppingCart",
    label: "shoppingCart",
  },
  {
    title: "itemCategory",
    href: ITEM_CAT_PAGE.ROOT,
    icon: "category",
    label: "category",
  },
  {
    title: "item",
    href: ITEM_PAGE.ROOT,
    icon: "item",
    label: "item",
  },
  {
    title: "branch",
    href: BRANCHES_PAGE.ROOT,
    icon: "store",
    label: "store",
  },
  {
    title: "user",
    href: USER_PAGE.ROOT,
    icon: "user",
    label: "user",
  },
];
