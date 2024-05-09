import { Flex, Text } from "@chakra-ui/react";

interface IStepsProps {
  price: number | string;
}

export const InstructionSection = ({ price }: IStepsProps) => {
  const stepsItems = [
    {
      title: `Deposits ${price}`,
      description: `Please sign up and login, so you can deposit funds. The initial lottery costs 100 USD. In case you are not selected as a winner, you can either continue with next rounds to win a ticket or withdraw money if you don’t want to play.`,
    },
    {
      title: "Play the sales",
      description: `Please sign up and login, so you can deposit funds. The initial lottery costs 100 USD. In case you are not selected as a winner, you can either continue with next rounds to win a ticket or withdraw money if you don’t want to play.`,
    },
    {
      title: "Mint NFT ticket",
      description: `Please sign up and login, so you can deposit funds. The initial lottery costs 100 USD. In case you are not selected as a winner, you can either continue with next rounds to win a ticket or withdraw money if you don’t want to play.`,
    },
    {
      title: `Take part auction`,
      description: `Please sign up and login, so you can deposit funds. The initial lottery costs 100 USD. In case you are not selected as a winner, you can either continue with next rounds to win a ticket or withdraw money if you don’t want to play.`,
    },
  ];
  return (
    <Flex
      mt={"6rem"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={"4rem"}
      w={"100%"}
    >
      <Text fontSize={"4rem"} textTransform={"uppercase"} fontWeight={"bold"}>
        How to buy tickets?
      </Text>

      <Flex flexWrap={"wrap"} gap={4}>
        {stepsItems.map((i, idx) => {
          return (
            <Flex
              key={idx}
              rounded={"24px"}
              border={"1px solid"}
              borderColor={"#D0D0D0"}
              flexDirection={"column"}
              gap={"8px"}
              pt={"10px"}
              pb={"4rem"}
              px={"1rem"}
              maxW={"288px"}
            >
              <Text fontWeight={500} fontSize={"18px"} pb={4}>{`0${
                idx + 1
              }`}</Text>
              <Text color={"#000"} fontWeight={500} fontSize={"1.5rem"}>
                {i.title}
              </Text>
              <Text fontSize={"1rem"} color={"#808080"}>
                {i.description}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
