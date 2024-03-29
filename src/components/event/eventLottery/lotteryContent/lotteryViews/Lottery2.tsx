import { Button, Flex, Text } from "@chakra-ui/react";
import { LargeTile } from "./components/LargeTile";
import { InstructionTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/InstructionTile";

interface IProps {
  lotteryData: any;
  activePhase: IPhaseState | null;
}

export const Lottery2 = ({ lotteryData, activePhase }: IProps) => {
  const onGenerateNumberHandler = () => {};
  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      maxW={"768px"}
    >
      <Flex gap={4} w={"100%"} flexDirection={"column"} rounded={"24px"}>
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text
              fontSize={"96px"}
              bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
              backgroundClip={"text"}
            >
              {lotteryData.myNumber}
            </Text>
            <Text
              bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
              backgroundClip={"text"}
              fontSize={"20px"}
            >
              Your last number
            </Text>
          </LargeTile>
          <LargeTile variant={"solid"} color={"#fff"}>
            <Text fontSize={"96px"}>{lotteryData.targetNumber}</Text>
            <Text fontSize={"20px"}>Target Number</Text>
          </LargeTile>
        </Flex>
        <Flex gap={4}>
          <Button
            variant={"brand"}
            w={"300px"}
            h={"120px"}
            onClick={onGenerateNumberHandler}
          >
            Generate number
          </Button>
          <InstructionTile
            activePhase={activePhase}
            lotteryData={lotteryData}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
