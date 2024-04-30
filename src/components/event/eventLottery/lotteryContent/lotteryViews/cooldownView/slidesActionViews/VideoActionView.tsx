import { Flex } from "@chakra-ui/react";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

interface IProps {
  toggleView: () => void;
  sliderData?: any;
}
export const VideoActionView = ({ toggleView, sliderData }: IProps) => {
  const videoUrl = sliderData?.videoUrl || {};

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
        src={videoUrl}
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
