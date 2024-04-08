import { NextResponse } from "next/server";
import { user as userModel } from "@/prisma/models";

export async function PUT(req: Request, res: Response) {
  const { email, walletAddr } = await req.json();
  if (email) {
    const user = await userModel.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      await userModel.create({
        data: {
          email,
          walletAddr,
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
      await userModel.create({
        data: {
          email: null,
          walletAddr,
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
