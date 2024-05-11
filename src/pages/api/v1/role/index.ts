import type { NextApiRequest, NextApiResponse } from "next";
import { API_MSG } from "^/config/apiRespMsg";

import { addUser } from "@/controllers/user";
import { getRoles } from "@/controllers/role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getRoles(req, res);
      break;

    case "POST":
      await addUser(req, res);
      break;

    default: {
      return res
        .status(405)
        .json({ message: API_MSG.ERROR.METHOD_NOT_ALLOWED });
    }
  }
}
