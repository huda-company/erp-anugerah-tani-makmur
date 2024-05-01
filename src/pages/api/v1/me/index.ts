import type { NextApiRequest, NextApiResponse } from "next";

import { me } from "@/controllers/me";

import { respBody } from "^/config/serverResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET":
      {
        await me(req, res);
      }
      break;

    default: {
      return res.status(405).json({ ...respBody.ERROR.METHOD_NOT_ALLLOWED });
    }
  }
}
