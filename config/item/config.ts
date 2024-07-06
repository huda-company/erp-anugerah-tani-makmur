import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { IItemForm, IItemGetReq } from "^/@types/models/item";
import { z } from "zod";
import { pageRowsArr } from "../request/config";
import { SUPPLIER } from "@/constants/pageURL";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "master-item-category",
    name: "master",
    url: "",
  },
  {
    isActive: true,
    key: "item",
    name: "item",
    url: SUPPLIER.PAGE.ROOT,
  },
];

export const initialItemForm: IItemForm = {
  name: "",
  description: "",
  price: 0,
  itemCategory: "",
};

export const ItemFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  itemCategory: z.string().min(2, {
    message: "invalid itemCategory",
  }),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  description: z.string().min(3, {
    message: "invalid description",
  }),
  price: z.coerce.number(),
});

export const initItemReqPrm: IItemGetReq = {
  name: "",
  "param[search]": "",
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: pageRowsArr[4],
  page: 0,
};
