import type { NextApiRequest, NextApiResponse } from "next";

import { ErrorType } from "^/config/apiRespMsg";
import { getPaymentPurch } from "@/controllers/payment-purchase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getPaymentPurch(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
