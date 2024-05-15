import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

interface IProps {
  userData: any;
  onToggleDepositViewHandler: () => void;
  isConnected: boolean;
  withdrawEnabled: boolean;
  mintEnabled: boolean;
  depositEnabled: boolean;
  currentSelectedTabId: any;
  activeSaleData: any;
  isLotteryEnded: boolean;
  onWithdrawHandler: any;
  onMint: any;
  salesData: any;
}

export const LotterySidebar = ({
  userData,
  onToggleDepositViewHandler,
  withdrawEnabled,
  mintEnabled,
  depositEnabled,
  activeSaleData,
  isLotteryEnded,
  onWithdrawHandler,
  onMint,
  currentSelectedTabId,
  salesData,
}: IProps) => {
  const lv1Warning = activeSaleData?.userFunds < activeSaleData?.price;
  const lv2Warning = minimumDepositForQualificationToLv2(
    activeSaleData?.price,
    activeSaleData?.userFunds,
    activeSaleData?.rollPrice,
  );
  const av1Warning = lv1Warning;
  const minDepoAmountForAv2 = minimumDepositForQualificationToAv2(
    activeSaleData?.userFunds,
    activeSaleData?.tickets,
    salesData?.auctionV2?.saleData?.participantsStats || [],
    activeSaleData?.price,
  );
  const av2Warning = minDepoAmountForAv2 !== 0;

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
  return (
    <Flex
      flexDirection={"column"}
      rounded={"20px"}
      pl={2}
      py={5}
      minH={"600px"}
      color={"#000"}
      minW={"280px"}
    >
      <Flex flexDirection={"column"} gap={4}>
        <Flex gap={4} alignItems={"center"} px={4}>
          <Flex rounded={"100%"} overflow={"hidden"} w={"52px"} h={"52px"}>
            <Image
              src={userData.avatar}
              alt={"user avatar"}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          </Flex>
          <Flex flexDirection={"column"} gap={1}>
            <Text fontSize={"17px"} fontWeight={"bold"}>
              {userData.username}
            </Text>
            <Text fontSize={"15px"}>
              {activeSaleData?.userFunds || 0}$ Balance
            </Text>
          </Flex>
        </Flex>
        <Flex
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          textAlign={"center"}
          mt={"2.5rem"}
          mb={"1.5rem"}
        >
          <Text fontWeight={"bold"} fontSize={"3rem"}>
            {activeSaleData?.price ? `${activeSaleData.price}$` : "0$"}
          </Text>
          <Text
            color={
              currentTabContent?.isWarning && !isLotteryEnded ? "#F90" : "#000"
            }
            fontWeight={"bold"}
          >
            {currentTabContent.priceLabel}
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDirection={"column"}
        gap={4}
        justifyContent={"space-between"}
        h={"100%"}
      >
        <Flex flexDirection={"column"} gap={4}>
          {mintEnabled ? (
            <Button variant={"blue"} onClick={onMint}>
              Mint
            </Button>
          ) : (
            <Button
              isDisabled={!depositEnabled || isLotteryEnded}
              variant={"black"}
              onClick={onToggleDepositViewHandler}
            >
              {currentTabContent.depositLabel}
            </Button>
          )}
          <Text fontSize={"14px"} textAlign={"center"}>
            Withdrawal only possible to the end of each phase
          </Text>
          {withdrawEnabled && (
            <Button
              variant={"ghost"}
              isDisabled={!withdrawEnabled}
              onClick={onWithdrawHandler}
            >
              Withdraw
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const minimumDepositForQualificationToLv2 = (price, userAmount, rollPrice) => {
  const missingFunds = price + rollPrice - userAmount;
  return missingFunds !== 0 ? missingFunds : 0;
};
export const minimumDepositForQualificationToAv2 = (
  userAmount,
  tickets,
  sortedUsers,
  minPrice,
) => {
  if (sortedUsers.length > tickets) {
    const lastQualifyingUser = sortedUsers[tickets - 1];
    return lastQualifyingUser?.amount + 1 - userAmount <= 0 ? 0 : lastQualifyingUser?.amount + 1 - userAmount;
  } else {
    return minPrice;
  }
};
