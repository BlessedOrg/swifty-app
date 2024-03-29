import { Flex, Text } from "@chakra-ui/react";
import { MediumTile } from "./components/MediumTile";
import { LargeTile } from "./components/LargeTile";
import {
  darkInstructionBg,
  InstructionTile,
} from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/InstructionTile";

interface IProps {
  lotteryData: any;
  activePhase: IPhaseState | null;
}

export const Lottery1 = ({ lotteryData, activePhase }: IProps) => {
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
          <LargeTile variant={"solid"}>
            <Text fontSize={"96px"}>{lotteryData.lastWinner}</Text>
            <Text fontSize={"20px"}>Last winner</Text>
          </LargeTile>
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
              Your number
            </Text>
          </LargeTile>
        </Flex>
        <Flex gap={4}>
          <MediumTile bg={darkInstructionBg} gap={4}>
            <Text fontSize={"40px"} as={"span"}>
              {lotteryData.winningChance}%
            </Text>{" "}
            <Text>Winning chance</Text>
          </MediumTile>
          <InstructionTile
            activePhase={activePhase}
            lotteryData={lotteryData}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
