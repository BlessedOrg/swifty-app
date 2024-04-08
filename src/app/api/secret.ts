import { getUser } from "./auth/[...thirdweb]/thirdwebAuth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser();

  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  return res.status(200).json({
    message: `This is a secret for ${user.address}.`,
  });
};

export default handler;
