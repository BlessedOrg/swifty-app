import { Button, Flex, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

export const LotterySidebar = ({
  userData,
  onToggleDepositViewHandler,
  onToggleMintModalHandler,
  onDepositHandler,
  isConnected,
}: any) => {
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
          <Text>Your price</Text>
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
            variant={"brand"}
            onClick={!isConnected ? onToggleDepositViewHandler : onValueSubmit}
          >
            Deposit
          </Button>
          <Button variant={"brand"} isDisabled>
            Withdraw
          </Button>
        </Flex>
        <Button
          isDisabled
          height={"120px"}
          variant={"brand"}
          onClick={onToggleMintModalHandler}
        >
          Mint ticket
        </Button>
      </Flex>
    </Flex>
  );
};
