import type { NextApiRequest, NextApiResponse } from "next";

import { ErrorType } from "^/config/apiRespMsg";

import { addPickupDoc, getPickupDoc } from "@/controllers/pickup-doc";

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
      await getPickupDoc(req, res);
      break;

    case "POST":
      await addPickupDoc(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
