import type { NextApiRequest, NextApiResponse } from "next";

import { doSignin } from "@/controllers/signin";

import { ErrorType } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "POST":
      await doSignin(req, res);
      break;

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
