import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3, {
    message: "invalid name",
  }),
  email: z.string().email({
    message: "invalid email",
  }),
  phone: z.string().min(8, {
    message: "invalid phone",
  }),
  password: z.string().min(6, {
    message: "invalid password",
  }),
  birthDate: z.string().min(6, {
    message: "invalid date",
  }),
  gender: z.string().min(1, { message: "please choose gender" }),
});
