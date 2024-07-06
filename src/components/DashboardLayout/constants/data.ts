import {
  BRANCH,
  CASHFLOW,
  DELIV_NOTE,
  ITEM,
  ITEM_CAT,
  PO,
  STOCK,
  SUPPLIER,
  SUPPLIER_STOCK,
  UNIT,
  USER,
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
        href: ITEM_CAT.PAGE.ROOT,
        icon: "category",
        label: "category",
      },
      {
        title: "item",
        href: ITEM.PAGE.ROOT,
        icon: "item",
        label: "item",
      },
      {
        title: "supplier",
        href: SUPPLIER.PAGE.ROOT,
        icon: "user",
        label: "user",
      },
      {
        title: "purchaseOrder",
        href: PO.PAGE.ROOT,
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
      {
        title: "delivNote",
        href: DELIV_NOTE.PAGE.ROOT,
        icon: "delivNote",
        label: "delivNote",
      },
    ],
  },
  {
    title: "supplierStock",
    href: SUPPLIER_STOCK.PAGE.ROOT,
    icon: "stock",
    label: "stock",
  },
  {
    title: "stock",
    href: STOCK.PAGE.ROOT,
    icon: "combine",
    label: "stock",
  },
  {
    title: "cashflow",
    href: CASHFLOW.PAGE.ROOT,
    icon: "wallet",
    label: "cashflow",
  },
  {
    title: "unit",
    href: UNIT.PAGE.ROOT,
    icon: "unit",
    label: "unit",
  },
  {
    title: "branch",
    href: BRANCH.PAGE.ROOT,
    icon: "store",
    label: "store",
  },
  {
    title: "user",
    href: USER.PAGE.ROOT,
    icon: "user",
    label: "user",
  },
];
