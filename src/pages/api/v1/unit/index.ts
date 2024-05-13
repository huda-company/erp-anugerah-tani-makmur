import type { NextApiRequest, NextApiResponse } from "next";

import { addUnit, getUnits } from "@/controllers/unit";
import { ErrorType } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getUnits(req, res);
      break;

    case "POST":
      await addUnit(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
