import { Button, Flex, Text } from "@chakra-ui/react";

export const WithdrawView = () => {
  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      bg={"#575757"}
      rounded={"24px"}
      w={"100%"}
      h={"100%"}
      maxW={"768px"}
      color={"#fff"}
      textAlign={"center"}
      flexDirection={"column"}
      px={10}
    >
      <Text fontSize={"1.5rem"}>Withdraw window</Text>
      <Text fontWeight={"bold"} fontSize={"40px"} color={"#E7E7E7"}>
        Are you Sure?
      </Text>
      <Flex
        color={"#E7E7E7"}
        alignItems={"center"}
        fontWeight={"bold"}
        fontSize={"40px"}
      >
        <Button
          bg={"none"}
          p={0}
          m={0}
          fontSize={"inherit"}
          color={"inherit"}
          _hover={{}}
          _active={{}}
        >
          Yes
        </Button>
        /
        <Button
          bg={"none"}
          p={0}
          m={0}
          fontSize={"inherit"}
          color={"inherit"}
          _hover={{}}
          _active={{}}
        >
          No
        </Button>
      </Flex>

      <Text fontSize={"20px"} mt={6}>
        You can still play the second lottery and auctions further to get a
        chance to win the ticket
      </Text>
    </Flex>
  );
};
