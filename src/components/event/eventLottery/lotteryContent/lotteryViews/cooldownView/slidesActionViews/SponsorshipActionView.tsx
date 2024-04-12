import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const SponsorshipActionView = ({ toggleView }) => {
  return (
    <Flex w={"100%"} h={"100%"}>
      <CloseButton
        onClick={toggleView}
        pos={"absolute"}
        top={"1.5rem"}
        right={"1.5rem"}
        bg={"#fff"}
        borderColor={"#000"}
        color={"#000"}
        zIndex={1}
      />
      <Image
        src={"/images/cooldownSlider/gelato.png"}
        alt={""}
        width={500}
        height={500}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </Flex>
  );
};
