import jwt from "jsonwebtoken";
import { NextApiRequest } from "next/types";
import { signOut } from "next-auth/react";

import { findOneAndUpdateOrCreate } from "./mongoQuery";
import Session from "^/mongodb/schemas/session";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "";

export const generateToken = async (userId: string) => {
  return await jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
};

export const revokeToken = async (userId: string) => {
  return await jwt.sign({ userId }, SECRET_KEY, { expiresIn: 1 });
};

export const verifyToken = async (token: string) => {
  try {
    return (await jwt.verify(token, SECRET_KEY)) as {
      exp: any | number;
      iat: any | number;
      userId: string;
    };
  } catch (error) {
    return null;
  }
};

export const saveTokenSessionToDB = async (token: string) => {
  const payload = await verifyToken(String(token));

  if (payload) {
    const q = { userId: payload.userId };
    const updatedData = {
      userId: payload.userId,
      token: token,
      iat: payload.iat,
      exp: payload.exp,
    };

    await findOneAndUpdateOrCreate("sessions", q, updatedData);
  }
};

export const checkTokenSession = async (token: string) => {
  const sess = await Session.findOne({ token: token });
  return sess ?? null;
};

export const getTokenFromRequest = async (req: NextApiRequest) => {
  const header = await req.headers;
  return header.authorization?.split(" ")[1] ?? "";
};

export const handleSignOut = async () => {
  await signOut({
    redirect: true,
    callbackUrl: "/auth/signin",
  });
};
