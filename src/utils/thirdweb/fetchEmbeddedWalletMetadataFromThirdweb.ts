export async function fetchEmbeddedWalletMetadataFromThirdweb(
  args:
    | {
        queryBy: "walletAddress";
        walletAddress: string;
      }
    | {
        queryBy: "email";
        email: string;
      }
) {
  const url = new URL(
    "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details"
  );
  if (args.queryBy === "walletAddress") {
    url.searchParams.set("queryBy", "walletAddress");
    url.searchParams.set("walletAddress", args.walletAddress);
  }
  if (args.queryBy === "email") {
    url.searchParams.set("queryBy", "email");
    url.searchParams.set("email", args.email);
  }

  try {
    const resp = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${process.env.THIRDWEB_AUTH_SECRET_KEY}`,
      },
    });

    const data = (await resp.json()) as {
      userId: string;
      walletAddress: string;
      email: string;
      createdAt: string;
    }[];

    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
}
