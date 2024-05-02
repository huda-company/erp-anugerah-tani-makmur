import { Document } from "mongoose";

export interface ISessionDocument extends Document {
  userId: string;
  token: string;
  macAddr: string;
  ipAddr: string;
  iat: number;
  exp: number;
}
