import { Flex } from "@chakra-ui/react";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const VideoActionView = ({ toggleView }) => {
  return (
    <Flex pos={"relative"} w={"100%"} h={"100%"}>
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
      <video
        src={
          "https://cdn.pixabay.com/video/2021/02/10/64813-510851151_large.mp4"
        }
        width={"100%"}
        height={"100%"}
        playsInline
        autoPlay
        muted
        loop
        style={{
          objectFit: "cover",
        }}
      />
    </Flex>
  );
};
