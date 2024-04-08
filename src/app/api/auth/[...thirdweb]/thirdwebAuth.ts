import { ThirdwebAuthAppRouter } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utilsthirdweb/fetchEmbeddedWalletMetadataFromThirdweb";
import { user as userModel } from "@/prisma/models";
export const { ThirdwebAuthHandler, getUser } = ThirdwebAuthAppRouter({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  callbacks: {
    onLogin: async (address) => {
      const userDetails = await fetchEmbeddedWalletMetadataFromThirdweb({
        queryBy: "walletAddress",
        walletAddress: address,
      });
      const userData = userDetails?.[0] || null;
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/checkUserExist`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: userData?.email || "",
            walletAddr: address,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
    onToken: (token) => {
      console.log("onToken:");
      console.log(token);
    },
    onLogout: (user) => {
      console.log("onLogout:");
      console.log(user);
    },
    //@ts-ignore
    onUser: async (userSession) => {
      const user = await userModel.findFirst({
        where: {
          walletAddr: userSession.address,
        },
      });
      if (user) {
        return {
          ...userSession,
          email: user.email,
        };
      }
      return {
        address: userSession.address,
      };
    },
  },
  cookieOptions: {
    secure: true,
  },
});
