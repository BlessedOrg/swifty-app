export const shortenWalletAddress = (address: string | null) => {
  if (!address) return "";
  return `${address.toString().substring(0, 4)}...${address
    .toString()
    .slice(-4)}`;
};
