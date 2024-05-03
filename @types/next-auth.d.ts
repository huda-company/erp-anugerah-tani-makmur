/* eslint-disable unused-imports/no-unused-imports */
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      /** The user's postal address. */
      id: string;
      name: string;
      email: string;
      image: string;
    };
    // Add any other properties if needed
  }
}
