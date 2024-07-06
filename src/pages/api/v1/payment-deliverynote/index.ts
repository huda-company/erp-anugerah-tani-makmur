import type { NextApiRequest, NextApiResponse } from "next";

import { ErrorType } from "^/config/apiRespMsg";
import { getPaymentDelivnote } from "@/controllers/payment-delivnote";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getPaymentDelivnote(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
