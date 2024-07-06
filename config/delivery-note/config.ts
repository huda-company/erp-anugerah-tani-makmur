import { CostTypes, IDelivNoteForm } from "^/@types/models/deliverynote";
import moment from "moment";
import { z } from "zod";

export const initialDelivNoteForm: IDelivNoteForm = {
  code: "",
  note: "",
  description: "",
  driverName: "",
  driverLicenseNo: "",
  flatNo: "",
  vehicleType: "",
  doTotal: 0,
  branch: "",
  soNumber: "",
  sellingTotal: 0,
  purchaseTotal: 0,
  date: moment().format("YYYY-MM-DD"),
  items: [
    {
      item: "",
      unit: "",
      price: 0,
      quantity: 0,
      discount: 0,
      note: "",
      total: 0,
    },
  ],
  costItems: [
    { type: CostTypes.FUEL, amount: 0 },
    { type: CostTypes.DRIVER_FEE, amount: 0 },
    { type: CostTypes.SCALES, amount: 0 },
    { type: CostTypes.TOLL, amount: 0 },
  ],
};

export const DelivNoteFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  type: z.string().min(3, {
    message: "invalid type",
  }),
  driverName: z.string().min(3, {
    message: "invalid driver name",
  }),
  flatNo: z.string().min(3, {
    message: "invalid flatNo",
  }),
  vehicleType: z.string().min(3, {
    message: "invalid vehicleType",
  }),
  date: z.string(),
  code: z.string(),
  soNo: z.string(),
  note: z.string(),
  description: z.string(),
});
