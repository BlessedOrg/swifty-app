import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { user as userModel, ticketSale, userToken } from "@/prisma/models";
import { isLoggedIn } from "@/server/auth";

export async function GET(req: NextRequest) {
  const activeWallet = cookies().get("active_wallet")?.value;
  const jwtOfActiveWallet = cookies().get(`jwt_${activeWallet}`)?.value;

  const formatCookies = (req.headers
    .get("cookie")
    ?.split(";")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = value;
      return acc;
    }, {}) || { jwt: null, active_wallet: null }) as {
    jwt: string | null;
    active_wallet: string | null;
  };

  const cookiesData = !!formatCookies?.jwt
    ? formatCookies
    : {
        jwt: jwtOfActiveWallet,
        active_wallet: activeWallet,
      };

  if (!!cookiesData.jwt && !!cookiesData.active_wallet) {
    const jwt = cookiesData.jwt;
    const activeWalletAddress = cookiesData.active_wallet;

    const isTokenValid = await isLoggedIn(activeWalletAddress)
    if(!isTokenValid){
      return NextResponse.json(
        {
          data: null,
          error: "Not authorized! Token is not valid.",
        },
        {
          status: 401,
        }
      );
    }
    const userCreds = await userToken.findUnique({
      where: {
        token: jwt,
      },
    });
    if (!userCreds) {
      return NextResponse.json(
        {
          data: null,
          error: "Not authorized! 1",
        },
        {
          status: 401,
        }
      );
    }
    const userData = await userModel.findUnique({
      where: {
        id: userCreds.userId,
      },
    });

    if (userData) {
      const userEvents = await ticketSale.count({
        where: {
          sellerId: userData.id,
        },
      });

      return NextResponse.json(
        {
          data: {
            isAbstracted: userData.isAbstracted,
            email: userData.email,
            id: userData.id,
            events: userEvents,
            walletAddress: userData.walletAddr,
          },
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          data: null,
          error: "Not find user",
        },
        {
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        data: null,
        error: "Not authorized! 2",
      },
      {
        status: 401,
      }
    );
  }
}
