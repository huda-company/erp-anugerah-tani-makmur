import * as jose from "jose";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";

import { respBody } from "^/config/serverResponse";
import { getTokenFromRequest } from "^/utils/auth";

export const apiMware = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = String(req.url);

  try {
    const token = await getTokenFromRequest(req);

    if (!url.includes("signin") && !url.includes("signup")) {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      await jose.jwtVerify(String(token), secret);

      return res;
    }
  } catch (error: any) {
    //expected catched from jose
    if (error.code == "ERR_JWT_EXPIRED") {
      return res.status(401).json(respBody.ERROR.EXPIRED_INVALID_TOKEN);
    }
  }
};
