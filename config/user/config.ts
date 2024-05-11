import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { USER_PAGE } from "@/constants/pageURL";
import { IUserForm } from "^/@types/models/user";
import { z } from "zod";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "master-user",
    name: "master",
    url: "",
  },
  {
    isActive: true,
    key: "user",
    name: "user",
    url: USER_PAGE.ROOT,
  },
];

export const initialUserForm: IUserForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  enabled: "inactive",
  birthDate: new Date().toString(),
};

export const UserFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  email: z.string().email({
    message: "invalid email",
  }),
  password: z.string().min(8, {
    message: "invalid password",
  }),
  phone: z.string().min(3, {
    message: "invalid phone",
  }),
  role: z.string().min(3, {
    message: "invalid role",
  }),
  enabled: z.string().min(3, {
    message: "invalid active status",
  }),
  birthDate: z.string().min(3, {
    message: "invalid birthDate",
  }),
});
