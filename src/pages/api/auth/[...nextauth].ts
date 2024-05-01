import NextAuth from "next-auth";

import { authOptions } from "^/lib/NextAuthConf";

export const authOptionsConf = authOptions;

export default NextAuth(authOptionsConf);
