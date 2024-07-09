import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { BRANCH } from "@/constants/pageURL";
import { IBranchForm, IBranchGetReq } from "^/@types/models/branch";
import { z } from "zod";
import { pageRowsArr } from "../request/config";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "master",
    name: "master",
    url: "#",
  },
  {
    isActive: true,
    key: "branch",
    name: "branch",
    url: BRANCH.PAGE.ROOT,
  },
];

export const initialBranchForm: IBranchForm = {
  name: "",
  city: "",
  address: "",
  description: "",
};

export const BranchFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  city: z.string().min(3, {
    message: "invalid city",
  }),
  address: z.string().min(3, {
    message: "invalid address",
  }),
  description: z.string().min(3, {
    message: "invalid description",
  }),
});

export const initBranchReqPrm: IBranchGetReq = {
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
