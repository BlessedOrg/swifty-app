
export const useAmountWarnings = (activeSaleData,  userData, currentSelectedTabId) => {
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
            userAmount: activeSaleData?.userFunds
        },
        activeSaleData?.tickets,
        activeSaleData?.participantsStats || [],
        activeSaleData?.price,
    );
    const av2Warning = !!minDepoAmountForAv2;

    const contentDataPerSale = {
        lotteryV1: {
            depositLabel: "Deposit",
            priceLabel: lv1Warning ? `Add ${activeSaleData?.price}$` : "Start Price",
            isWarning: lv1Warning,
        },
        lotteryV2: {
            depositLabel: "Deposit",
            priceLabel: !!lv2Warning ? `Add ${lv2Warning}$` : "Ticket Price",
            isWarning: !!lv2Warning,
        },
        auctionV1: {
            depositLabel: "Place your bid",
            priceLabel: av1Warning ? `Add ${activeSaleData?.price}$` : "Start Price",
            isWarning: av1Warning,
        },
        auctionV2: {
            depositLabel: "Place your bid",
            priceLabel: av2Warning ? `Add ${minDepoAmountForAv2}$` : "Start Price",
            isWarning: av2Warning,
        },
    };

    const currentTabContent =
        contentDataPerSale?.[currentSelectedTabId] ||
        contentDataPerSale["lotteryV1"];
return { currentTabPriceWarnings: currentTabContent };
}


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
    const {userAmount, address } = userData || {}
    const isMoreTicketsThenUsers = sortedUsers.length < tickets

    if (!isMoreTicketsThenUsers) {
        const lastQualifyingUser = sortedUsers[tickets];
        if(lastQualifyingUser?.address === address) {
            return 0
        }
        return lastQualifyingUser?.amount + 1 - userAmount <= 0 ? 0 : lastQualifyingUser?.amount + 1 - userAmount;
    } else if(userAmount >= minPrice) {
        return 0;
    } else {
        return minPrice
    }
};