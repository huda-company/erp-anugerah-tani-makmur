import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { IItemCatForm, IItemCatGetReq } from "^/@types/models/itemcategory";
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
    key: "itemcategory",
    name: "item category",
    url: SUPPLIER.PAGE.ROOT,
  },
];

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

export const initItemCatReqPrm: IItemCatGetReq = {
  "param[search]": "",
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: pageRowsArr[0],
  page: 0,
  prevPage: null,
  nextPage: null,
  totalPages: 0,
};
