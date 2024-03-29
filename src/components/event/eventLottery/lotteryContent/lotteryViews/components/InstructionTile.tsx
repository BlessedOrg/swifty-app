import { MediumTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/MediumTile";

interface IProps {
  activePhase: IPhaseState | null;
  lotteryData: any;
}
export const darkInstructionBg = "linear-gradient(180deg, #666 0%, #000 100%)";

export const InstructionTile = ({ activePhase, lotteryData }: IProps) => {
  const redInstructionBg =
    "linear-gradient(180deg, #EF5353 0%, #DE0000 100%), linear-gradient(180deg, #666 0%, #000 100%)";
  const instructionPerPhase = {
    0: {
      bg: darkInstructionBg,
      content:
        "Your number is generated at the beginning of the round and does not change",
    },
    1:
      lotteryData.userFunds >= 0.2
        ? {
            bg: darkInstructionBg,
            content:
              "Generating new number is an occurring cost per each submission. Each generation costs 20c",
          }
        : {
            bg: redInstructionBg,
            content:
              "Generating new number is an occurring cost per each submission. Please deposit more funds to play the lottery",
          },
    2: {
      bg: darkInstructionBg,
      content:
        "With dynamic pricing, you are depositing exact amount of funds to be eligible for the mint. If too many users deposited, randomness picks the winners",
    },
  };

  return (
    <MediumTile
      bg={
        activePhase && instructionPerPhase[activePhase.idx]
          ? instructionPerPhase[activePhase.idx].bg
          : darkInstructionBg
      }
    >
      {activePhase && instructionPerPhase[activePhase.idx]
        ? instructionPerPhase[activePhase.idx].content
        : "Your number is generated at the beginning of the round and does not change"}
    </MediumTile>
  );
};
