"use server";
import { client } from "lib/client";
import { VerifyLoginPayloadParams, createAuth, GenerateLoginPayloadParams } from "thirdweb/auth";
import { privateKeyAccount } from "thirdweb/wallets";
import { cookies } from "next/headers";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utils/thirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { signInUser } from "services/signInUser";
import { userToken } from "@/prisma/models";

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
  console.log(`💽 getUser elo`)
  const activeWalletAddress = cookies().get(`active_wallet`);
  console.log("🦦 activeWalletAddress: ", activeWalletAddress)
  const jwt = cookies().get(`jwt_${activeWalletAddress?.value}`);
  console.log("🦦 jwt: ", jwt)

  if (!activeWalletAddress || !jwt) {
    return { error: "Not logged in" };
  }
  
  console.log("🦦 process.env.NEXT_PUBLIC_BASE_URL: ", process.env.NEXT_PUBLIC_BASE_URL)

  const userData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserData`,
    {
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt.value};active_wallet=${activeWalletAddress.value}`,
      },
      cache: "no-store",
    },
  );
  const user = await userData.json();
  console.log("🦦 user: ", user)

  return user;
}
export async function isLoggedIn(address, passedJwt?: string) {
  const jwt = cookies().get(`jwt_${address}`);

  if (!!jwt?.value || !!passedJwt) {
    cookies().set("active_wallet", address);
  }

  const tokenExist = await userToken.findUnique({
    where: {
      token: jwt?.value || passedJwt || "",
    },
  });
  if (!jwt?.value && !passedJwt) {
    cookies().delete("active_wallet");
    return false;
  }
  //@ts-ignore
  const authResult = await thirdwebAuth.verifyJWT({
    jwt: jwt?.value || passedJwt!,
  });
  if (
    !authResult.valid ||
    authResult.parsedJWT.sub !== address ||
    !tokenExist
  ) {
    return false;
  }

  return true;
}

export async function logout(address) {
  cookies().delete(`jwt_${address}`);
  cookies().delete(`active_wallet`);
  cookies().delete(`thirdweb_auth_token_${address}`);
  cookies().delete(`thirdweb_auth_active_account_${address}`);
}
