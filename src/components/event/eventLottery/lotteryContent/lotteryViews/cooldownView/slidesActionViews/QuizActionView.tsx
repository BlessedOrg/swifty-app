import { Flex } from "@chakra-ui/react";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";
import { Widget } from "@typeform/embed-react";

export const QuizActionView = ({ toggleView }) => {
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
      <Widget id={"typeformId"} style={{ width: "100%", height: "100%" }} />
    </Flex>
  );
};
