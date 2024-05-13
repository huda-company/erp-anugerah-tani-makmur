import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { BRANCH_PAGE } from "@/constants/pageURL";
import { IBranchForm } from "^/@types/models/branch";
import { z } from "zod";

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
    url: BRANCH_PAGE.ROOT,
  },
];

export const pageRowsArr = [5, 10, 30, 40, 50];

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
