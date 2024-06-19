import { createThirdwebClient } from "thirdweb";

const clientId = process.env.THIRDWEB_CLIENT_ID!; 
const secretKey = process.env.THIRDWEB_AUTH_SECRET_KEY!;

export const client = createThirdwebClient(
  secretKey
    ? { secretKey }
    : {
        clientId,
      }
);
