"use server";
import { client } from "lib/client";
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyAccount } from "thirdweb/wallets";
import { cookies } from "next/headers";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utils/thirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { createUser } from "services/createUser";

const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY || "";

const thirdwebAuth = createAuth({
  domain: "",
  adminAccount: privateKeyAccount({
    client,
    privateKey,
  }),
});

export const generatePayload = thirdwebAuth.generatePayload;

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
    await createUser(userData?.email, walletAddress, jwt);
    cookies().set(`jwt_${walletAddress}`, jwt);
    return true
  }
}
export async function getUser() {
  const activeWalletAddress = cookies().get(`active_wallet`);
  const jwt = cookies().get(`jwt_${activeWalletAddress}`);

  if (!activeWalletAddress || !jwt) {
    return { error: "Not logged in" };
  }

  const userData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserData`,
    {
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt.value};active_wallet=${activeWalletAddress}`,
      },
    }
  );
  const user = await userData.json();

  return user;
}
export async function isLoggedIn(address) {
  const jwt = cookies().get(`jwt_${address}`);
  cookies().set("active_wallet", address);

  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  const userData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserData`,
    {
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt.value};active_wallet=${address}`,
      },
      cache: 'no-store'
    }
  );
  const user = await userData.json();

  if (
    !authResult.valid ||
    authResult.parsedJWT.sub !== address ||
    !user?.data?.id
  ) {
    return false;
  }
  return true;
}

export async function logout(address) {
  cookies().delete(`jwt_${address}`);
  cookies().delete(`active_wallet`);
  cookies().delete(`thirdweb_auth_token_${address}`)
  cookies().delete(`thirdweb_auth_active_account_${address}`)
  console.log("logut - ", `jwt_${address}`);
}
