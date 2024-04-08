import { ThirdwebAuthAppRouter } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { fetchEmbeddedWalletMetadataFromThirdweb } from "@/utilsthirdweb/fetchEmbeddedWalletMetadataFromThirdweb";

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
      const res = await fetch(
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
    onUser: (user) => {
      console.log("onUser:");
      console.log(user);
    },
  },
  cookieOptions: {
    secure: true,
  },
});
