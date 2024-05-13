import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorType } from "^/config/apiRespMsg";
import { deleteUnit } from "@/controllers/unit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "DELETE": {
      await deleteUnit(req, res);
    }

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
