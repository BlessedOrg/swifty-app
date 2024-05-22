import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useAmountWarnings } from "@/hooks/useAmountWarnings";
import {shakeWithResize, smallScale} from "../../../../keyframes/keyframes";

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
              activeSaleData?.isWinner ? "#6157FF": currentTabPriceWarnings?.isWarning && !isLotteryEnded
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
        gap={4}
        justifyContent={"space-between"}
        h={"100%"}
      >
        <Flex flexDirection={"column"} gap={4}>
          {mintEnabled ? (
            <Button animation={`${smallScale} infinite 1s ease-in-out`} variant={"blue"} onClick={onMint}>
              Mint
            </Button>
          ) : (
            <Button
                animation={currentTabPriceWarnings?.isWarning ? `${shakeWithResize} infinite 1s ease-in-out` : undefined}
              isDisabled={!depositEnabled || isLotteryEnded}
              variant={"black"}
              onClick={onToggleDepositViewHandler}
            >
              {currentTabPriceWarnings.depositLabel}
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
