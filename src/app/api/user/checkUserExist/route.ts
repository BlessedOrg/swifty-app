import { NextResponse } from "next/server";
import { createUser } from "services/createUser";

export async function PUT(req: Request, res: Response) {
  const { email, walletAddr } = await req.json();
  await createUser(email, walletAddr);

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
