import type { NextApiRequest, NextApiResponse } from "next";
import { deleteUser } from "@/controllers/user";
import { ErrorType } from "^/config/apiRespMsg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "DELETE": {
      await deleteUser(req, res);
    }

    default: {
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
    }
  }
}
