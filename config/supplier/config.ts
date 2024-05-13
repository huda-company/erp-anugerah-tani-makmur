import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { SUPPLIER_PAGE } from "@/constants/pageURL";
import { ISupplierForm } from "^/@types/models/supplier";
import { z } from "zod";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "purchase",
    name: "purchase",
    url: "",
  },
  {
    isActive: true,
    key: "supplier",
    name: "supplier",
    url: SUPPLIER_PAGE.ROOT,
  },
];

export const pageRowsArr = [5, 10, 30, 40, 50];

export const initialSupplierForm: ISupplierForm = {
  company: "",
  managerName: "",
  managerSurname: "",
  email: "",
  bankAccount: "",
  tel: "",
  address: "",
};

export const SupplierFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  // email: z.string().email(),
  email: z.string(),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  managerName: z.string().min(0, {
    message: "invalid manager name",
  }),
  managerSurname: z.string().min(0, {
    message: "invalid surname",
  }),
  bankAccount: z.string().min(0, {
    message: "invalid bank account",
  }),
  tel: z.string().min(0, {
    message: "invalid phone",
  }),
  address: z.string().min(3, {
    message: "invalid address",
  }),
});
