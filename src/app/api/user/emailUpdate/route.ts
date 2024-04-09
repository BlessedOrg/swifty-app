import { NextResponse } from "next/server";
import { user as userModel } from "@/prisma/models";
export async function POST(req: Request, res: Response) {
  const { email, userId } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Wrong email!" }, { status: 400 });
  }
  const emailExist = await userModel.findUnique({ where: { email } });

  if (emailExist) {
    return NextResponse.json(
      { error: "Email is already taken!" },
      { status: 400 },
    );
  } else {
    const updatedUser = await userModel.update({
      where: {
        id: userId,
      },
      data: {
        email,
      },
    });

    return NextResponse.json(
      {
        updatedUser,
      },
      {
        status: 200,
      },
    );
  }
}
