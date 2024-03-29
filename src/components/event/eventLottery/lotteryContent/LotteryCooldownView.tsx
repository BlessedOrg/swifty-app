import { Flex, Text } from "@chakra-ui/react";

interface IProps {}
export const LotteryCooldownView = ({}: IProps) => {
  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      bg={"linear-gradient(180deg, #9977D4 0%, #6337AE 100%)"}
      rounded={"24px"}
      w={"100%"}
      h={"100%"}
      maxW={"768px"}
    >
      <Text fontWeight={"bold"} fontSize={"3rem"} textTransform={"uppercase"}>
        Animation
      </Text>
    </Flex>
  );
};
