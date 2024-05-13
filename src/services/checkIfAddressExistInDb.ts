import { getUser } from "../app/api/auth/[...thirdweb]/thirdwebAuth";
import { user } from "@/prisma/models";

const checkIfAddressExistInDb = async (NextResponse) => {
  const restrict = () => {
    NextResponse.json({ error: "Register first" }, { status: 400 });
    return;
  };
  const userWithSession = await getUser();
  if (!userWithSession) restrict();

  const existingUser = await user.findFirst({
    where: {
      walletAddr: userWithSession?.address,
    },
  });
  if (!existingUser) {
    restrict();
  }

  return userWithSession;
};

export default checkIfAddressExistInDb;