import {
  user as userModel,
  userToken as userTokenModel,
} from "@/prisma/models";
import { checkIfAccountIsAbstracted } from "@/utils/thirdweb/checkIfAccountIsAbstracted";
import { isEmptyArray } from "@chakra-ui/utils";

export const createUser = async (
  email: string,
  walletAddress: string,
  token: string
) => {
  if (email) {
    const user = await userModel.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      const createdUser = await userModel.create({
        data: {
          email: email,
          walletAddr: walletAddress,
          isAbstracted: true,
        },
      });
      await userTokenModel.create({
        data: {
          token,
          userId: createdUser.id,
        },
      });
    } else if (user) {
      await userTokenModel.update({
        where: {
          userId: user.id,
        },
        data: {
          token,
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
      const createdUser = await userModel.create({
        data: {
          email: null,
          walletAddr: walletAddress,
          isAbstracted,
        },
      });
      await userTokenModel.create({
        data: {
          token,
          userId: createdUser.id,
        },
      });
    } else {
      const userId = users[0].id as string;
      const currentUserToken = await userTokenModel.findUnique({
        where: {
          userId,
        },
      });

      if (currentUserToken) {
        await userTokenModel.update({
          where: {
            userId: userId,
          },
          data: {
            token,
          },
        });
      } else {
        await userTokenModel.create({
          data: {
            token,
            userId: userId,
          },
        });
      }
    }
  }
};
