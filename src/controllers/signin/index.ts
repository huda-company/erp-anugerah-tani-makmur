import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next/types";

import { respBody } from "^/config/serverResponse";
import connectToDatabase from "^/mongodb/connDB";
import Session from "^/mongodb/schemas/session";
import User from "^/mongodb/schemas/user";
import { generateToken, saveTokenSessionToDB, verifyToken } from "^/utils/auth";

export const doSignin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    await connectToDatabase();

    const userCheck = await User.findOne({ email: email });
    if (!userCheck) return res.status(400).json(respBody.ERROR.UNKNOWN_EMAIL);

    // if (userCheck && typeof userCheck.emailVerifAt === "undefined")
    // return res.status(400).json(respBody.ERROR.EMAIL_UNVERIFIED);

    //matching password
    const isPasswordValid = await bcrypt.compare(password, userCheck.password);
    if (!isPasswordValid) {
      return res.status(400).json(respBody.ERROR.INC_EMAIL_PASSWORD);
    }

    //checking user session
    const checkUsrSession = await Session.findOne({ userId: userCheck.id });

    if (!checkUsrSession) {
      const generatedtoken = await generateToken(userCheck?.id);
      await saveTokenSessionToDB(generatedtoken);

      return res.status(200).json({
        ...respBody.SUCCESS.SIGN_IN_SUCCESS,
        data: userCheck,
        token: generatedtoken,
      });
    }

    // Verify the token
    let userToken = checkUsrSession.token;
    const verifToken = await verifyToken(String(checkUsrSession.token));

    //perform regenerate JWT token
    if (!verifToken) {
      const jwtToken = await generateToken(userCheck?.id);
      await saveTokenSessionToDB(jwtToken);
      userToken = jwtToken;
    }

    return res.status(200).json({
      ...respBody.SUCCESS.SIGN_IN_SUCCESS,
      data: userCheck,
      token: userToken,
    });
  } catch (error: any) {
    if (error.code == "ERR_JWT_EXPIRED") {
      await connectToDatabase();

      const userCheck = await User.findOne(
        { email: email },
        { plainPassword: 0, password: 0 }
      );

      const jwtToken = await generateToken(userCheck?.id);
      await saveTokenSessionToDB(jwtToken);

      return res.status(200).json({ data: userCheck, token: jwtToken });
    }
    return res.status(500).json({ ...respBody.ERROR.UNEXPECTED_ERROR });
  }
};
