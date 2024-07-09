"use server";
import { cookies } from "next/headers";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utils/thirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { signInUser } from "services/signInUser";
import { ticketSale, user as userModel, userToken } from "@/prisma/models";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export async function login(walletAddress: string) {
  const secret = jwtSecret || "";
  const token = jwt.sign({ walletAddress }, secret, { expiresIn: "1d" });

  const userDetails = await fetchEmbeddedWalletMetadataFromThirdweb({
    queryBy: "walletAddress",
    walletAddress: walletAddress,
  });
  const userData = userDetails?.[0] || null;
  try {
    console.log("Sign in user...")
    await signInUser(userData?.email, walletAddress, token);
  } catch (e) {
    console.error(e);
    return false;
  }
  cookies().set(`jwt_${walletAddress}`, token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
  return { walletAddress, token };
}

interface CookiesData {
  jwt: string | undefined;
  active_wallet: string | undefined;
}

export async function getUser() {
  const activeWallet = cookies().get("active_wallet")?.value;
  const jwtOfActiveWallet = cookies().get(`jwt_${activeWallet}`)?.value;

  const cookiesData: CookiesData = {
    jwt: jwtOfActiveWallet,
    active_wallet: activeWallet,
  };

  if (!cookiesData.jwt || !cookiesData.active_wallet) {
    throw new Error("No cookies set");
  }
  const isTokenValid = await checkIsLoggedIn(cookiesData.active_wallet, cookiesData.jwt);
  if (!isTokenValid) {
    throw new Error("Token is not valid.");
  }

  const userCreds = await userToken.findUnique({
    where: { token: cookiesData.jwt },
  });

  if (!userCreds) {
    throw new Error("Not matching user token");
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

export async function checkIsLoggedIn(address, passedJwt?: string) {
  const token = cookies().get(`jwt_${address}`);

  const tokenExist = await userToken.findUnique({
    where: {
      token: token?.value || passedJwt || "",
    },
  });
  if (tokenExist) {
    if(new Date(tokenExist.expiresAt).getTime() < new Date().getTime()){
      console.log(`Token is expired ⏱️`)
      console.log(`${new Date(tokenExist.expiresAt)} < ${new Date()}`)
      cookies().delete(`jwt_${address}`);
      return false
    }
    try{
      const decodeToken = jwt.verify(
          token?.value || passedJwt || "",
          jwtSecret || "",
      ) as { walletAddress: string };
      const { walletAddress } = decodeToken || {};

      return walletAddress === address;
    }catch(e){
      console.log(e)
      return false
    }
  }
  return false;
}

export async function logout(address) {
  cookies().delete(`jwt_${address}`);
  cookies().delete(`active_wallet`);
}
