"use server";

import { cookies } from "next/headers";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utils/thirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { signInUser } from "services/signInUser";
import { userToken } from "@/prisma/models";
import { getUserData } from "../services/getUserData";
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
    await signInUser(userData?.email, walletAddress, token);
  } catch (e) {
    console.error(e);
    return false;
  }
  cookies().set(`jwt_${walletAddress}`, token);
  return { walletAddress, token };
}

export async function getUser() {
  return getUserData();
}

export async function checkIsLoggedIn(address, passedJwt?: string) {
  const token = cookies().get(`jwt_${address}`);

  const tokenExist = await userToken.findUnique({
    where: {
      token: token?.value || passedJwt || "",
    },
  });
  if (tokenExist) {
    const decodeToken = jwt.verify(
      token?.value || passedJwt || "",
      jwtSecret || "",
    ) as { walletAddress: string };
    const { walletAddress } = decodeToken || {};

    if (walletAddress !== address) {
      return false;
    }
  }

  return true;
}

export async function logout(address) {
  cookies().delete(`jwt_${address}`);
  cookies().delete(`active_wallet`);
}
