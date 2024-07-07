import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import { USER } from "@/constants/pageURL";
import { IUserForm, IUserGetReq } from "^/@types/models/user";
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
    url: USER.PAGE.ROOT,
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

export const initUserReqPrm: IUserGetReq = {
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: 2,
  page: 0,
  nextPage: null,
  prevPage: null,
  totalPages: 0,
};

export const convGetReqToPgntCustomProps = (prm: any): PaginationCustomPrms => {
  const pgReq: PaginationCustomPrms = {
    limit: Number(prm.limit),
    page: Number(prm.page),
    nextPage: prm.nextPage,
    prevPage: prm.prevPage,
    totalPages: prm.totalPages,
  };

  return pgReq;
};
