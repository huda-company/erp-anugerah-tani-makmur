import type { NextApiRequest, NextApiResponse } from "next";

import { doSignupVerification } from "@/controllers/signup";

import { API_MSG } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "POST":
      {
        await doSignupVerification(req, res);
      }
      break;

    default: {
      return res
        .status(405)
        .json({ message: API_MSG.ERROR.METHOD_NOT_ALLOWED });
    }
  }
}
