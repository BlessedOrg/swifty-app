import { user } from "@/prisma/models";
import { getUser } from "@/server/auth";

const checkIfAddressExistInDb = async (NextResponse) => {
  const restrict = () => {
    NextResponse.json({ error: "Register first" }, { status: 400 });
    return;
  };
  const userWithSession: any = await getUser();
  if (!userWithSession?.data) restrict();

  const existingUser = await user.findFirst({
    where: {
      walletAddr: userWithSession?.data?.walletAddress,
    },
  });
  if (!existingUser) {
    restrict();
  }

  return userWithSession;
};

export default checkIfAddressExistInDb;
