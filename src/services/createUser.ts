import { user as userModel } from "@/prisma/models";
import { checkIfAccountIsAbstracted } from "@/utils/thirdweb/checkIfAccountIsAbstracted";
import { isEmptyArray } from "@chakra-ui/utils";

export const createUser = async (email: string, walletAddress: string) => {
  if (email) {
    const user = await userModel.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      await userModel.create({
        data: {
          email: email,
          walletAddr: walletAddress,
          isAbstracted: true
        },
      });
    }
  } else {
    const users = await userModel.findMany({
      where: {
        walletAddr: walletAddress,
      },
    });
    if (isEmptyArray(users)) {
      const isAbstracted = await checkIfAccountIsAbstracted(walletAddress);
      await userModel.create({
        data: {
          email: null,
          walletAddr: walletAddress,
          isAbstracted
        },
      });
    }
  }
};
