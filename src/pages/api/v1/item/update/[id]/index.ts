import type { NextApiRequest, NextApiResponse } from "next";
import { API_MSG } from "^/config/apiRespMsg";
import { getSuppliers } from "@/controllers/supplier";
import { updateItem } from "@/controllers/item";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getSuppliers(req, res);
      break;

    case "PATCH":
      await updateItem(req, res);
      break;

    default: {
      return res
        .status(405)
        .json({ message: API_MSG.ERROR.METHOD_NOT_ALLOWED });
    }
  }
}
