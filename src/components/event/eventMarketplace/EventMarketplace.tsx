import { Button, Flex, Input, Text } from "@chakra-ui/react";
import Image from "next/image";

export const EventMarketplace = ({ userData }) => {
  return (
    <Flex
      p={"8px"}
      bg={"#EEEEEE"}
      w={"100%"}
      color={"#fff"}
      rounded={"8px"}
      gap={4}
    >
      <Flex
        flexDirection={"column"}
        rounded={"20px"}
        pl={2}
        py={5}
        minH={"600px"}
        color={"#000"}
        minW={"280px"}
        justifyContent={"space-between"}
        h={"100%"}
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
        </Flex>
        <Flex flexDirection={"column"} gap={4}>
          <Text>Modular Summit (Buy Type)</Text>
          <Text>Cameron Williamson</Text>
          <Flex justifyContent={"space-between"} fontWeight={"500"}>
            <Text>273$</Text>
            <Text>x1</Text>
          </Flex>
          <Flex justifyContent={"space-between"} fontWeight={"500"}>
            <Text>Total</Text>
            <Text>273$</Text>
          </Flex>
        </Flex>
        <Button variant={"purple"} h={"120px"}>
          Buy
        </Button>
      </Flex>

      <Flex
        flexDirection={"column"}
        w={"100%"}
        h={"100%"}
        gap={10}
        bg={"#fff"}
        p={4}
        rounded={"8px"}
        alignItems={"center"}
      ></Flex>
    </Flex>
  );
};
