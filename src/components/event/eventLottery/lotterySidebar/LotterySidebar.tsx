import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useAmountWarnings } from "@/hooks/useAmountWarnings";
import { shakeWithResize, smallScale } from "../../../../keyframes/keyframes";

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
}: IProps) => {
  const { currentTabPriceWarnings } = useAmountWarnings(
    activeSaleData,
    userData,
    currentSelectedTabId,
  );

  return (
    <Flex
      flexDirection={"column"}
      rounded={"1rem"}
      pl={{ base: 1, iwMid: 2 }}
      py={{ base: 1, iwMid: 5 }}
      minH={{ base: "200px", iwMid: "330px", iw: "600px" }}
      maxH={{ base: "225px", iwMid: "none" }}
      color={"#000"}
      minW={"280px"}
      overflowY={"auto"}
      bg={"rgba(255, 255, 255, 0.4)"}
    >
      <Flex flexDirection={"column"} gap={{ base: 1, iwMid: 4 }}>
        <Flex gap={4} alignItems={"center"} px={4}>
          <Flex
            rounded={"100%"}
            overflow={"hidden"}
            w={{ base: "40px", iwMid: "52px" }}
            h={{ base: "40px", iwMid: "52px" }}
          >
            <Image
              src={userData.avatar}
              alt={"user avatar"}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          </Flex>
          <Flex flexDirection={"column"} gap={1}>
            <Text
              fontSize={{ base: "14px", iwMid: "17px" }}
              fontWeight={"bold"}
            >
              {userData.username}
            </Text>
            <Text fontSize={{ base: "12px", iwMid: "14px" }}>
              {activeSaleData?.userFunds || 0}$ Balance
            </Text>
          </Flex>
        </Flex>
        <Flex
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          textAlign={"center"}
          mt={{ base: "0.5rem", iw: "2.5rem" }}
          mb={{ base: "0rem", iw: "1.5rem" }}
        >
          <Text
            fontWeight={"bold"}
            fontSize={{ base: "1.5rem", iwMid: "3rem" }}
          >
            {activeSaleData?.price ? `${activeSaleData.price}$` : "0$"}
          </Text>
          <Text
            color={
              activeSaleData?.isWinner
                ? "#6157FF"
                : currentTabPriceWarnings?.isWarning && !isLotteryEnded
                  ? "#F90"
                  : "#000"
            }
            fontWeight={"bold"}
          >
            {currentTabPriceWarnings.priceLabel}
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDirection={"column"}
        gap={{ base: 2, iwMid: 4 }}
        justifyContent={"space-between"}
        h={"100%"}
      >
        <Flex
          flexDirection={"column"}
          gap={{ base: 2, iwMid: 4 }}
          alignItems={"center"}
          overflow={"hidden"}
          py={2}
        >
          {mintEnabled ? (
            <Button
              animation={`${smallScale} infinite 1s ease-in-out`}
              variant={"blue"}
              onClick={onMint}
              minW={"230px"}
              maxW={"260px"}
              w={"100%"}
              h={{ base: "40px", iw: "52px" }}
              fontSize={{ base: "0.9rem", iwMid: "1rem" }}
            >
              Mint
            </Button>
          ) : (
            <Button
              animation={
                currentTabPriceWarnings?.isWarning
                  ? `${shakeWithResize} infinite 1s ease-in-out`
                  : undefined
              }
              isDisabled={!depositEnabled || isLotteryEnded}
              variant={"black"}
              onClick={onToggleDepositViewHandler}
              minW={"230px"}
              maxW={"260px"}
              w={"100%"}
              h={{ base: "40px", iw: "52px" }}
              fontSize={{ base: "0.9rem", iwMid: "1rem" }}
            >
              {currentTabPriceWarnings.depositLabel}
            </Button>
          )}
          {!withdrawEnabled &&
            <Text fontSize={"14px"} textAlign={"center"}>
              Withdrawal only possible to the end of each phase
            </Text>
          }
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
