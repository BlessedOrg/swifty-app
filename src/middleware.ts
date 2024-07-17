import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const active_wallet = request.cookies.get("active_wallet")?.value;
  const accessToken = request.cookies.get(`jwt_${active_wallet}`)?.value;

  if (accessToken) {
    const jwtDecoded = jwt.decode(accessToken!) as { walletAddress: string };
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-wallet-address", jwtDecoded.walletAddress);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/events/:path*"],
};
