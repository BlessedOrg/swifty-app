import { Flex, Input, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { SlideButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/SlideButton";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const SinActionView = ({ toggleView }) => {
  return (
    <Flex
      flexDirection={"column"}
      gap={4}
      w={"100%"}
      h={"100%"}
      px={"2rem"}
      py={"1.5rem"}
    >
      <Flex justifyContent={"space-between"}>
        <Text fontWeight={"bold"} fontSize={"1.5rem"}>
          Submit Your Sin
        </Text>
        <CloseButton onClick={toggleView} />
      </Flex>
      <Flex flexDirection={"column"} gap={4} fontSize={"20px"}>
        <Flex py={2} px={6} bg={"#000"} color={"#fff"} rounded={"1rem"}>
          <Text>
            Share your event moments! Post on TikTok with{" "}
            <Text as={"span"} fontWeight={"bold"}>
              #CryptoConfessions
            </Text>{" "}
            and join the fun!
          </Text>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text>or</Text>
          <Input
            placeholder={"Enter your sin here..."}
            rounded={"1rem"}
            h={"70px"}
          />
        </Flex>
        <SlideButton px={"3rem"} alignSelf={"center"}>
          Submit Your Sin
        </SlideButton>
      </Flex>
      <Flex alignItems={"center"} alignSelf={"center"} gap={2} w={"370px"}>
        <Text fontSize={"20px"}>
          Explore{" "}
          <Link textDecoration={"underline"} color={"blue"} href={"/"}>
            other sins
          </Link>{" "}
          and find comfort in shared fun
        </Text>
        <Image
          src="/images/cooldownSlider/phone.svg"
          width={200}
          height={200}
          alt={""}
          style={{
            width: "60px",
            height: "auto",
          }}
        />
      </Flex>
    </Flex>
  );
};
