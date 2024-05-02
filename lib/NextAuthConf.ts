import axios from "axios";
import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

import { MAX_AGE } from "../config/jwt";

import { API_VERSION, BASE_URL } from "^/config/env";
import { signInAPI } from "^/services/auth";
import { verifyToken } from "^/utils/auth";

export const authOptions: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: AUTH_PAGE_URL.SIGNIN,
  },
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE!) || MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          const res = await signInAPI(credentials);
          console.log("resss", res);

          const data: { user: User; token: string } = await res.data;

          if (!data?.token) {
            throw res.response.data;
          }

          return { ...data.user, accessToken: data?.token };
        } catch (error: any) {
          if (error instanceof Response) {
            return null;
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        if (session.type === "MANUAL") {
          const response = await fetch(`${BASE_URL}/api/${API_VERSION}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const user = await response.json();

          return { ...token, ...user };
        }

        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      const accessTokenExpires = await verifyToken(String(token.accessToken));

      if (!accessTokenExpires) {
        return token;
      }

      // const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      // const accessTokenHasExpired =
      //   currentUnixTimestamp > accessTokenExpires.exp;

      // if (accessTokenHasExpired) {
      //     return await refreshAccessToken(token);
      // }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.error) {
        throw new Error("Refresh token has expired");
      }

      const response = await axios.get(`${BASE_URL}/api/${API_VERSION}/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      const userFetch = await response.data;

      const modifiedSession = {
        ...session,
        accessToken: token.accessToken,
        user: userFetch.data,
      };

      return modifiedSession as Session;
    },
  },
  events: {
    signOut: async ({ token }) => {
      await axios.get(`${BASE_URL}/api/${API_VERSION}/signout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
    },
  },
};

// async function refreshAccessToken(token: JWT) {
//     try {
//         const response = await fetchClient({
//             method: "POST",
//             url: process.env.NEXT_PUBLIC_BACKEND_API_URL + "/api/refresh",
//             token: token.accessToken,
//         });

//         if (!response.ok) throw response;

//         const refreshedAccessToken: { access_token: string } = await response.json();
//         const { exp } = jwt.decode(refreshedAccessToken.access_token);

//         return {
//             ...token,
//             accessToken: refreshedAccessToken.access_token,
//             exp,
//         };
//     } catch (error) {
//         return {
//             ...token,
//             error: "RefreshAccessTokenError",
//         };
//     }
// }
