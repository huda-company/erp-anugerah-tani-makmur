import type { NextApiRequest, NextApiResponse } from "next";

import { createPurchase, getPurchases } from "@/controllers/purchase";
import { ErrorType } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getPurchases(req, res);
      break;

    case "POST":
      await createPurchase(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
