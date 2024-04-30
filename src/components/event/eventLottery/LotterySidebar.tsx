import { Button, Flex, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

interface IProps {
  userData: any;
  onToggleDepositViewHandler: () => void;
  onToggleMintModalHandler: () => void;
  onToggleWithdrawViewHandler: () => void;
  onDepositHandler: (amount: string | number) => void;
  isConnected: boolean;
  withdrawEnabled: boolean;
  mintEnabled: boolean;
  depositEnabled: boolean;
  activePhase: IPhaseState | null;
  lotteryData: any;
  isLotteryEnded: boolean;
}
export const LotterySidebar = ({
  userData,
  onToggleDepositViewHandler,
  onToggleMintModalHandler,
  onToggleWithdrawViewHandler,
  onDepositHandler,
  isConnected,
  withdrawEnabled,
  mintEnabled,
  depositEnabled,
  lotteryData,
  activePhase,
  isLotteryEnded,
}: IProps) => {
  const [enteredValue, setEnteredValue] = useState("");
  const onValueChange = (e) => {
    setEnteredValue(e.target.value);
  };
  const onValueSubmit = () => {
    if (enteredValue) {
      onDepositHandler(+enteredValue);
      setEnteredValue("");
    }
  };

  const eligibleWarning = userData.balance < lotteryData.price;
  const missingFundsValue = lotteryData.price - userData.balance;
  const warningColor =
    activePhase?.idx === 3 || (eligibleWarning && activePhase?.idx === 2);

  const fundsMessagePerPhase = {
    0: "Your price",
    1: "Your price",
    2: eligibleWarning
      ? "You are not eligible in the round"
      : "You are eligible",
    3: eligibleWarning ? `Add ${missingFundsValue}$` : "Your price",
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
            <Text fontSize={"15px"}>more info</Text>
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
            {userData.balance}$
          </Text>
          <Text
            color={warningColor && !isLotteryEnded ? "#F90" : "#000"}
            fontWeight={"bold"}
          >
            {isLotteryEnded
              ? "Your price"
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
          <Input
            type={"number"}
            placeholder={"Enter amount"}
            textAlign={"center"}
            borderColor={"#ACABAB"}
            color={"#ACABAB"}
            fontWeight={500}
            _focusVisible={{}}
            h={"52px"}
            onChange={onValueChange}
            value={enteredValue}
          />
          <Button
            isDisabled={!depositEnabled}
            variant={"purple"}
            onClick={onToggleDepositViewHandler}
          >
            Deposit
          </Button>
          <Button
            variant={"red"}
            isDisabled={!withdrawEnabled}
            onClick={onToggleWithdrawViewHandler}
          >
            Withdraw
          </Button>
        </Flex>
        <Button
          isDisabled={!mintEnabled}
          height={"120px"}
          variant={"purple"}
          onClick={onToggleMintModalHandler}
        >
          Mint ticket
        </Button>
      </Flex>
    </Flex>
  );
};
