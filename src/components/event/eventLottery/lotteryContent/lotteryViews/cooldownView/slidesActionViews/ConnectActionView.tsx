import { Flex, Input, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { SlideButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/SlideButton";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const ConnectActionView = ({ toggleView }) => {
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
          Connect Your Social Media
        </Text>
        <CloseButton onClick={toggleView} />
      </Flex>
      <Flex flexDirection={"column"} gap={4}>
        <Text>
          Link your social media accounts to access exclusive live events and
          discussions.
        </Text>
        <Flex gap={4}>
          <Input placeholder={"Name"} />
          <Input type={"email"} placeholder={"Email"} />
        </Flex>
        <Input h={"40px"} placeholder={"@yourhandle"} />
        <Flex gap={4}>
          <SlideButton px={"5rem"}>Link Accounts</SlideButton>
          <Text color={"#808080"}>
            We respect your privacy. Your information will only be used for
            event-related communications and activities.
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems={"center"} alignSelf={"center"} gap={2}>
        <Text fontSize={"20px"}>
          Great to see you joining{" "}
          <Link color={"blue"} href={"/"}>
            us all!
          </Link>
        </Text>
        <Image
          src="/images/cooldownSlider/heart.png"
          width={200}
          height={200}
          alt={""}
          style={{
            width: "80px",
            height: "auto",
          }}
        />
      </Flex>
    </Flex>
  );
};
