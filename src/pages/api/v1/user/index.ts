import type { NextApiRequest, NextApiResponse } from "next";

import { addUser, getUsers } from "@/controllers/user";
import { ErrorType } from "^/config/apiRespMsg";

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
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
