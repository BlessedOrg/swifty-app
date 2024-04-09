import { NextResponse } from "next/server";
import { user as userModel } from "@/prisma/models";
import { ThirdwebSDK } from "@thirdweb-dev/react";

const checkIfAccountIsAbstracted = async (address: string) => {
  const sdk = new ThirdwebSDK('sepolia');
  const contract = await sdk.getContract(process.env.THIRDWEB_FACTORY_ADDRESS as string);
  const result = await contract.call('getAllAccounts');
  return !!result.includes(address);
};

export async function PUT(req: Request, res: Response) {
  const { email, walletAddr } = await req.json();
  if (email) {
    const user = await userModel.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const isAbstracted = await checkIfAccountIsAbstracted(walletAddr);
      await userModel.create({
        data: {
          email,
          walletAddr,
          isAbstracted
        },
      });
    }
  } else {
    const users = await userModel.findMany({
      where: {
        walletAddr,
      },
    });
    if (!users.length) {
      const isAbstracted = await checkIfAccountIsAbstracted(walletAddr);
      await userModel.create({
        data: {
          email: null,
          walletAddr,
          isAbstracted
        },
      });
    }
  }

  return NextResponse.json(
    {
      success: true,
      email,
      walletAddr,
    },
    {
      status: 200,
    },
  );
}
