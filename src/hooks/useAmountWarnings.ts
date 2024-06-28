export const useAmountWarnings = (
  activeSaleData,
  userData,
  currentSelectedTabId,
  isLoggedIn
) => {
  const lv1Warning = activeSaleData?.userFunds < activeSaleData?.price;
  const lv2Warning = minimumDepositForQualificationToLv2(
    activeSaleData?.price,
    activeSaleData?.userFunds,
    activeSaleData?.rollPrice,
  );
  const av1Warning = lv1Warning;
  const minDepoAmountForAv2 = minimumDepositForQualificationToAv2(
    {
      address: userData?.walletAddress,
      userAmount: activeSaleData?.userFunds,
    },
    activeSaleData?.tickets,
    activeSaleData?.participantsStats || [],
    activeSaleData?.price,
  );
  const av2Warning = !!minDepoAmountForAv2;

  const winningMessage = activeSaleData?.isWinner && isLoggedIn
    ? "Congrats on winning a ticket! 🎉"
    : null;
  const contentDataPerSale = {
    lotteryV1: {
      depositLabel: "Deposit",
      priceLabel: !!winningMessage ? winningMessage :lv1Warning
        ? `Add ${activeSaleData?.price}$`
        : winningMessage || "Start Price",
      isWarning: !winningMessage && lv1Warning,
    },
    lotteryV2: {
      depositLabel: "Deposit",
      priceLabel: !!winningMessage ? winningMessage : !!lv2Warning
        ? `Add ${lv2Warning}$`
        : winningMessage || "Ticket Price",
      isWarning: !winningMessage && !!lv2Warning,
    },
    auctionV1: {
      depositLabel: "Place your bid",
      priceLabel: !!winningMessage ? winningMessage : av1Warning
        ? `Add ${activeSaleData?.price}$`
        : winningMessage || "Start Price",
      isWarning:!winningMessage && av1Warning,
    },
    auctionV2: {
      depositLabel: "Place your bid",
      priceLabel: !!winningMessage ? winningMessage : av2Warning
        ? `Add ${minDepoAmountForAv2}$`
        : winningMessage || "Start Price",
      isWarning: !winningMessage && av2Warning,
    },
  };

  const currentTabContent =
    contentDataPerSale?.[currentSelectedTabId] ||
    contentDataPerSale["lotteryV1"];
  return { currentTabPriceWarnings: currentTabContent };
};

const minimumDepositForQualificationToLv2 = (price, userAmount, rollPrice) => {
  const missingFunds = price + rollPrice - userAmount;
  return missingFunds > 0 ? missingFunds : 0;
};

const minimumDepositForQualificationToAv2 = (
  userData,
  tickets,
  sortedUsers,
  minPrice,
) => {
  const { userAmount, address } = userData || {};
  const isMoreTicketsThenUsers = sortedUsers.length < tickets;
  const ticketsAndUsersIsEqual = sortedUsers.length === tickets;
  const userIsInArray = sortedUsers.some((user) => user.address === address);
  if (ticketsAndUsersIsEqual) {
    if (!userIsInArray) {
      const lastQualifyingUser = sortedUsers[tickets];
      return lastQualifyingUser?.amount + 1;
    }
  }
  if (!isMoreTicketsThenUsers) {
    const lastQualifyingUser = sortedUsers[tickets];
    if (lastQualifyingUser?.address === address) {
      return 0;
    }
    return lastQualifyingUser?.amount + 1 - userAmount <= 0
      ? 0
      : lastQualifyingUser?.amount + 1 - userAmount;
  } else if (userAmount >= minPrice) {
    return 0;
  } else {
    return minPrice;
  }
};
