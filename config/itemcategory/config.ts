import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { SUPPLIER_PAGE } from "@/constants/pageURL";
import { IItemCatForm } from "^/@types/models/itemcategory";
import { z } from "zod";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "master-item-category",
    name: "master",
    url: "",
  },
  {
    isActive: true,
    key: "itemcategory",
    name: "item category",
    url: SUPPLIER_PAGE.ROOT,
  },
];

export const pageRowsArr = [5, 10, 30, 40, 50];

export const initialItemCatForm: IItemCatForm = {
  name: "",
  description: "",
};

export const ItemCatFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  description: z.string().min(3, {
    message: "invalid description",
  }),
});
