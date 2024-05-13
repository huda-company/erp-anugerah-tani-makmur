import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { UNIT_PAGE } from "@/constants/pageURL";
import { IUnitForm } from "^/@types/models/unit";
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
    key: "unit",
    name: "unit",
    url: UNIT_PAGE.ROOT,
  },
];

export const initialUnitForm: IUnitForm = {
  name: "",
  description: "",
};

export const UnitFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  name: z.string().min(1, {
    message: "invalid name",
  }),
  description: z.string().min(0, {
    message: "invalid description",
  }),
});
