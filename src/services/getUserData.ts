import { cookies } from "next/headers";
import { user as userModel, ticketSale, userToken } from "@/prisma/models";
import { isLoggedIn } from "@/server/auth";

interface CookiesData {
  jwt: string | undefined;
  active_wallet: string | undefined;
}

export async function getUserData() {
  const activeWallet = cookies().get("active_wallet")?.value;
  const jwtOfActiveWallet = cookies().get(`jwt_${activeWallet}`)?.value;


  const cookiesData: CookiesData = {
      jwt: jwtOfActiveWallet,
      active_wallet: activeWallet,
    };

  if (!cookiesData.jwt || !cookiesData.active_wallet) {
    throw new Error("Not authorized! 2");
  }

  const isTokenValid = await isLoggedIn(cookiesData.active_wallet, cookiesData.jwt);
  if (!isTokenValid) {
    throw new Error("Not authorized! Token is not valid.");
  }

  const userCreds = await userToken.findUnique({
    where: { token: cookiesData.jwt },
  });

  if (!userCreds) {
    throw new Error("Not authorized! 1");
  }

  const userData = await userModel.findUnique({
    where: { id: userCreds.userId },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const userEvents = await ticketSale.count({
    where: { sellerId: userData.id },
  });

  return {
    isAbstracted: userData.isAbstracted,
    email: userData.email,
    id: userData.id,
    events: userEvents,
    walletAddress: userData.walletAddr,
  };
}
