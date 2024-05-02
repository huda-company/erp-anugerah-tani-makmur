import { NextApiRequest, NextApiResponse } from "next/types";

import { respBody } from "^/config/serverResponse";
import connectToDatabase from "^/mongodb/connDb";
import Session from "^/mongodb/schemas/session";
import User from "^/mongodb/schemas/user";
import { getTokenFromRequest, verifyToken } from "^/utils/auth";

export const me = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getTokenFromRequest(req);
  try {
    // Verify the token
    await verifyToken(String(token));

    await connectToDatabase();

    const session = await Session.findOne({ token: token }).lean();
    if (session) {
      const userCheck = await User.findById(session.userId, {
        plainPassword: 0,
        password: 0,
      });

      return res.status(200).json({ data: userCheck });
    } else {
      return res.status(401).json(respBody.ERROR.EXPIRED_INVALID_TOKEN);
    }
  } catch (error: any) {
    if (error.code == "ERR_JWT_EXPIRED") {
      return res.status(401).json(respBody.ERROR.EXPIRED_INVALID_TOKEN);
    }
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
