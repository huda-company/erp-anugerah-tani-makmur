import type { NextApiRequest, NextApiResponse } from "next";

import { respBody } from "^/config/serverResponse";
import connectToDatabase from "^/mongodb/connDB";
import Session from "^/mongodb/schemas/session";
import { getTokenFromRequest } from "^/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqMeth: string = String(req.method);
  switch (reqMeth) {
    case "GET": {
      const token = await getTokenFromRequest(req);

      try {
        // Verify the token
        // const secret = new TextEncoder().encode(
        //     process.env.NEXTAUTH_SECRET,
        // )
        // const { payload } = await jose.jwtVerify(String(token), secret)

        await connectToDatabase();
        await Session.findOneAndDelete({ token: token });

        return res.status(200).json({ message: "Successfully logout" });
      } catch (error: any) {
        if (error.code == "ERR_JWT_EXPIRED") {
          return res.status(401).json({ message: "token is expired" });
        }
        return res.status(500).json({ ...respBody.ERROR.UNEXPECTED_ERROR });
      }
    }

    default: {
      return res.status(405).json({ ...respBody.ERROR.METHOD_NOT_ALLLOWED });
    }
  }
}
