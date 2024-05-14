import type { NextApiRequest, NextApiResponse } from "next";

import { ErrorType } from "^/config/apiRespMsg";
import {
  addPaymentPurchase,
  getPaymentPurch,
} from "@/controllers/payment-purchase";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getPaymentPurch(req, res);
      break;

    case "POST":
      await addPaymentPurchase(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
