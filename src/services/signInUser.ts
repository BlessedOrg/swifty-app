import {
  user as userModel,
  userToken as userTokenModel,
} from "@/prisma/models";
import { checkIfAccountIsAbstracted } from "@/utils/thirdweb/checkIfAccountIsAbstracted";
import { isEmptyArray } from "@chakra-ui/utils";

export const signInUser = async (
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
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
      });
    } else if (user) {
      await updateOrCreateUserToken(user.id, token);
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
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
      });
    } else {
      const userId = users[0].id as string;
      await updateOrCreateUserToken(userId, token);
    }
  }
};

const updateOrCreateUserToken = async (userId, token) => {
  const currentUserToken = await userTokenModel.findUnique({
    where: {
      userId,
    },
  });

  if (currentUserToken) {
    const updatedToken = await userTokenModel.update({
      where: {
        userId: userId,
      },
      data: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
    });
    return { message: "Updated token", id: updatedToken.id };
  } else {
    const createdToken = await userTokenModel.create({
      data: {
        token,
        userId: userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
    });
    return { message: "Created token", id: createdToken.id };
  }
};
