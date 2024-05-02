import { z } from "zod";

export const initValSignin = {
  email: "",
  password: "",
};

export const formSchema = z.object({
  email: z.string().email({
    message: "invalid",
  }),
  password: z.string().min(6, {
    message: "invalid password",
  }),
});
