import type { NextApiRequest, NextApiResponse } from "next";
import { addItem, getItems } from "@/controllers/item";
import { ErrorType } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getItems(req, res);
      break;

    case "POST":
      await addItem(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
