import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps {
  front: ReactNode;
  back: ReactNode;
}
function Card({ front, back }: IProps) {
  return (
    <Flex
      h={"100%"}
      w={"100%"}
      style={{ transformStyle: "preserve-3d" }}
      pos={"relative"}
      userSelect={"none"}
      className={"card"}
    >
      <Flex
        // h={"100%"}
        w={"100%"}
        pos={"absolute"}
        left={0}
        justifyContent={"normal"}
        alignItems={"center"}
        style={{ backfaceVisibility: "hidden" }}
        transform={"rotateY(180deg)"}
        className={"card-back"}
        zIndex={"1"}
        h={'100%'}
      >
        {back}
      </Flex>
      <Flex
        // h={"100%"}
        w={"100%"}
        pos={"absolute"}
        left={0}
        justifyContent={"normal"}
        alignItems={"center"}
        style={{ backfaceVisibility: "hidden", zIndex: 0 }}
        className={"card-front"}
        gap={4}
        h={'100%'}
      >
        {front}
      </Flex>
    </Flex>
  );
}

export default Card;
