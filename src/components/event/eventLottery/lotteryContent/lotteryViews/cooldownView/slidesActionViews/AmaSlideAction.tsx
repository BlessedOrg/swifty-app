import { Flex, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import { SlideButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/SlideButton";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const AmaSlideAction = ({ toggleView }) => {
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
          Your Turn to Ask
        </Text>
        <CloseButton onClick={toggleView} />
      </Flex>
      <Flex flexDirection={"column"} gap={2} textAlign={"center"}>
        <Input type={"email"} placeholder={"Email"} />
        <Input h={"40px"} placeholder={"Why everything is so wonderful?"} />
        <SlideButton alignSelf={"center"}>Submit</SlideButton>
      </Flex>
      <Flex alignItems={"center"} maxW={"350px"} alignSelf={"center"}>
        <Text fontSize={"20px"} gap={2}>
          You’ll be notified as soon as <br /> your question gets picked
        </Text>
        <Image
          src="/images/cooldownSlider/smile.svg"
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
