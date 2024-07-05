import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { user as userModel, ticketSale, userToken } from "@/prisma/models";
import { isLoggedIn } from "@/server/auth";

export async function GET(req: NextRequest) {
  const activeWallet = cookies().get("active_wallet")?.value;
  console.log("🦦 activeWallet: ", activeWallet)
  const jwtOfActiveWallet = cookies().get(`jwt_${activeWallet}`)?.value;
  console.log("🦦 jwtOfActiveWallet: ", jwtOfActiveWallet)

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
  
  console.log("🦦 formatCookies: ", formatCookies)

  const cookiesData = !!formatCookies?.jwt
    ? formatCookies
    : {
        jwt: jwtOfActiveWallet,
        active_wallet: activeWallet,
      };
  
  console.log("🦦 cookiesData: ", cookiesData)

  if (!!cookiesData.jwt && !!cookiesData.active_wallet) {
    console.log(`💽 1st if`)
    const jwt = cookiesData.jwt;
    console.log("🦦 jwt: ", jwt)
    const activeWalletAddress = cookiesData.active_wallet;
    console.log("🦦 activeWalletAddress: ", activeWalletAddress)
    

    const isTokenValid = await isLoggedIn(activeWalletAddress, jwt)
    console.log("🦦 isTokenValid: ", isTokenValid)
    if(!isTokenValid){
      console.log(`💽 TOKEN NOT VLAID!!!1`)
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
    console.log("🦦 userCreds: ", userCreds)
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
    console.log("🦦 userData: ", userData)

    if (userData) {
      console.log(`💽 no user data`)
      const userEvents = await ticketSale.count({
        where: {
          sellerId: userData.id,
        },
      });
      
      console.log("🦦 userEvents: ", userEvents)

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
      console.log(`💽 else1`)
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
    console.log(`💽 else2`)
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
