import type { NextApiRequest, NextApiResponse } from "next";
import { API_MSG } from "^/config/apiRespMsg";

import { addUser, getUsers } from "@/controllers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      await getUsers(req, res);
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
