export const shortenWalletAddress = (address: string | null) => {
  if (!address) return "";
  return `${address.toString().substring(0, 6)}...${address
    .toString()
    .slice(-4)}`;
};
