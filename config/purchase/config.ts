import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { Options } from "^/@types/global";
import { PaymentPurchaseResp } from "^/@types/models/paymentpurchase";
import { PickupDocType } from "^/@types/models/pickupdoc";
import { IPurchaseForm, PurchaseStatus } from "^/@types/models/purchase";
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
    key: "purchase",
    name: "purchaseOrder",
    url: PURCHASE_PAGE.ROOT,
  },
];

export const initialPurchaseForm: IPurchaseForm = {
  name: "",
  billingCode: "",
  expDate: new Date(),
  note: "",
  poNo: "",
  soNumber: "",
  supplier: "",
  purchPaymentMethod: "",
  year: new Date().getFullYear(),
  discount: 0,
  grandTotal: 0,
  ppnIncluded: false,
  taxTotal: 0,
  credit: 0,
  date: new Date(),
  items: [
    {
      item: "",
      unit: "",
      price: 0,
      quantity: 0,
      discount: 0,
      total: 0,
    },
  ],
  number: 0,
  paymentPurchase: "",
  paymentStatus: "",
  pdfPath: "",
  recurring: "",
  status: PurchaseStatus.DRAFT,
  subTotal: 0,
  taxRate: 0,
};

export const PurchaseFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  email: z.string().email({
    message: "invalid",
  }),
  name: z.string().min(3, {
    message: "invalid name",
  }),
  managerName: z.string().min(3, {
    message: "invalid name",
  }),
  managerSurname: z.string().min(3, {
    message: "invalid surname",
  }),
  bankAccount: z.string().min(3, {
    message: "invalid bank account",
  }),
  tel: z.string().min(5, {
    message: "invalid phone",
  }),
  address: z.string().min(3, {
    message: "invalid address",
  }),
});

export const paymentMethOpts: Options[] = [
  {
    text: "cash",
    value: "cash",
  },
  {
    text: "credit",
    value: "credit",
  },
];

export const pickupDocTypehOpts: Options[] = [
  {
    text: PickupDocType.PPB,
    value: PickupDocType.PPB,
  },
  {
    text: PickupDocType.SPAA,
    value: PickupDocType.SPAA,
  },
];

export const calculateGrandTotal = (items: { total: number }[]): number => {
  return items.reduce((acc, item) => acc + item.total, 0);
};

export const calculatePaymPurchTotal = (prm: PaymentPurchaseResp[]): number => {
  return prm.reduce((acc: any, doc: any) => acc + doc.amount, 0);
};
