import { apiMware } from "@/middlewares/apiMiddleware";
import { NextApiRequest, NextApiResponse } from "next/types";

//this middleware is suggested by nextjs docs.
//then customize it as per requirement

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextApiRequest, res: NextApiResponse) {
  const reqURL = String(req.url);
  if (reqURL.includes("api")) {
    const apiMwareCheck = await apiMware(req, res);
    if (["20"].includes(String(apiMwareCheck?.status))) return res;
    else return apiMwareCheck;
  } else {
    // const session = await getSession({ req: req });
    // const sessionToken = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    // Your access token from NextAuth.js
    // const accessToken = sessionToken?.accessToken;
    // Decode the access token
    // const decodedToken = await jwt.decode(String(accessToken)) as JwtPayload;
    // if (!sessionToken) NextResponse.redirect(AUTH_PAGE_URL.SIGNIN)
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/item/:path*",
    "/purchase/:path*",
    "/branch/:path*",
    "/supplier/:path*",
    "/user/:path*",
    "/unit/:path*",
  ],
};
