import {
  BRANCH_PAGE,
  ITEM_CAT_PAGE,
  ITEM_PAGE,
  PO_PAGE,
  SUPPLIER_PAGE,
  UNIT_PAGE,
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
    title: "purchase",
    href: "#",
    icon: "shoppingBag",
    label: "shoppingBag",
    subItems: [
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
    ],
  },
  {
    title: "selling",
    href: "#",
    icon: "handshake",
    label: "handshake",
    subItems: [
      {
        title: "selling",
        href: "#",
        icon: "handshake",
        label: "handshake",
      },
    ],
  },
  {
    title: "unit",
    href: UNIT_PAGE.ROOT,
    icon: "unit",
    label: "unit",
  },
  {
    title: "branch",
    href: BRANCH_PAGE.ROOT,
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
