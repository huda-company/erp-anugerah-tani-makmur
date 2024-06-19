import { IPickupDocForm, PickupDocType } from "^/@types/models/pickupdoc";
import { z } from "zod";

export const initialPickupDocForm: IPickupDocForm = {
  code: "",
  note: "",
  description: "",
  driverName: "",
  flatNo: "",
  vehicleType: "",
  type: PickupDocType.SPAA,
  doTotal: 0,
};

export const PickupDocFormSchema = z.object({
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
  code: z.string(),
  note: z.string(),
  description: z.string(),
});
