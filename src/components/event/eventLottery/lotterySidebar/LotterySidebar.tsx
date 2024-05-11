import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

interface IProps {
  userData: any;
  onToggleDepositViewHandler: () => void;
  isConnected: boolean;
  withdrawEnabled: boolean;
  mintEnabled: boolean;
  depositEnabled: boolean;
  activePhase: IPhaseState | null;
  activeSaleData: any;
  isLotteryEnded: boolean;
  onWithdrawHandler: any;
  onMint;
}

export const LotterySidebar = ({
  userData,
  onToggleDepositViewHandler,
  withdrawEnabled,
  mintEnabled,
  depositEnabled,
  activeSaleData,
  activePhase,
  isLotteryEnded,
  onWithdrawHandler,
  onMint,
}: IProps) => {
  const eligibleWarning =
    activeSaleData?.userFunds < activeSaleData?.price || 0;
  const missingFundsValue =
    activeSaleData?.price - activeSaleData?.userFunds || 0;
  const warningColor =
    activePhase?.idx === 3 || (eligibleWarning && activePhase?.idx === 2);

  const fundsMessagePerPhase = {
    0: "Start price",
    1: "Ticket price",
    2: eligibleWarning
      ? "You are not eligible in the round"
      : "Your current bid",
    3: eligibleWarning ? `Add ${missingFundsValue}$` : "Your current bid",
  };

  const depositButtonLabelPerPhase = {
    0: "Deposit",
    1: "Deposit",
    2: "Place your bid",
    3: "Place your bid",
  };
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
            color={warningColor && !isLotteryEnded ? "#F90" : "#000"}
            fontWeight={"bold"}
          >
            {isLotteryEnded
              ? "Your ticket price"
              : fundsMessagePerPhase[activePhase?.idx || 0]}
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
            <Button variant={"red"} onClick={onMint}>
              Mint
            </Button>
          ) : (
            <Button
              isDisabled={!depositEnabled || isLotteryEnded}
              variant={"black"}
              onClick={onToggleDepositViewHandler}
            >
              {depositButtonLabelPerPhase[activePhase?.idx || 0]}
            </Button>
          )}
          <Text fontSize={"14px"} textAlign={"center"}>
            Withdrawal only possible to the end of each phase
          </Text>
          {withdrawEnabled && (
            <Button
              variant={"red"}
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
