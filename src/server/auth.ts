"use server";
import { client } from "lib/client";
import { createAuth, GenerateLoginPayloadParams, VerifyLoginPayloadParams } from "thirdweb/auth";
import { privateKeyAccount } from "thirdweb/wallets";
import { cookies } from "next/headers";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utils/thirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { signInUser } from "services/signInUser";
import { userToken } from "@/prisma/models";
import { getUserData } from "../services/getUserData";

const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY || "";

const thirdwebAuth = createAuth({
  domain: "",
  adminAccount: privateKeyAccount({
    client,
    privateKey,
  }),
});

export const generatePayload = async(params: GenerateLoginPayloadParams)=> await thirdwebAuth.generatePayload(params);

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);

  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });

    const walletAddress = verifiedPayload.payload.address;
    const userDetails = await fetchEmbeddedWalletMetadataFromThirdweb({
      queryBy: "walletAddress",
      walletAddress: walletAddress,
    });
    const userData = userDetails?.[0] || null;
    try {
      await signInUser(userData?.email, walletAddress, jwt);
    } catch (e) {
      console.error(e);
    }
    cookies().set(`jwt_${walletAddress}`, jwt);
    return true;
  }
}

export async function getUser() {
  return getUserData();
}

export async function isLoggedIn(address, passedJwt?: string) {
  const jwt = cookies().get(`jwt_${address}`);

  const tokenExist = await userToken.findUnique({
    where: {
      token: jwt?.value || passedJwt || "",
    },
  });

  if (!jwt?.value && !passedJwt) {
    cookies().delete("active_wallet");
    return false;
  }
  const authResult = await thirdwebAuth.verifyJWT({
    jwt: jwt?.value || passedJwt!,
  });

  return !(!authResult.valid || authResult.parsedJWT.sub !== address || !tokenExist);
}

export async function logout(address) {
  cookies().delete(`jwt_${address}`);
  cookies().delete(`active_wallet`);
  cookies().delete(`thirdweb_auth_token_${address}`);
  cookies().delete(`thirdweb_auth_active_account_${address}`);
}
