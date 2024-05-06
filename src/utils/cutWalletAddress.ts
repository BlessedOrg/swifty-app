export const cutWalletAddress = (walletAddress) => {
  if (!walletAddress) return "";
  return `${walletAddress.toString().substring(0, 6)}...${walletAddress
    .toString()
    .slice(-4)}`;
};
