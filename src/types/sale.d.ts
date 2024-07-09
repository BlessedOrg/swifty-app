import {ILotteryV1} from "@/hooks/sales/useLotteryV1";
import {ILotteryV2} from "@/hooks/sales/useLotteryV2";
import {IAuctionV1} from "@/hooks/sales/useAuctionV1";
import {IAuctionV2} from "@/hooks/sales/useAuctionV2";

export {};
declare global {

  interface ISaleData {
    lotteryV1: ILotteryV1;
    lotteryV2: ILotteryV2;
    auctionV1: IAuctionV1;
    auctionV2: IAuctionV2;
  }
  interface ICommonSaleData {
    userFunds: number | null;
    vacancyTicket: number | null;
    price: number;
    winners: string[] | null;
    isLotteryStarted?: boolean;
    isOwner?: boolean;
    missingFunds: number | null;
    hasMinted: boolean;
    isWinner: boolean;
    lotteryState?: "ACTIVE" | "ENDED" | "NOT_STARTED",
    readDataForAddress?: string;
    isDefaultState: boolean;
  }

  type ILotteryV1Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
  }
  type ILotteryV2Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
    rollPrice: number | null;
    rollTolerance: number | null;
    rolledNumbers: any[];
    isRolling?: boolean
  }

  interface IAuvtionV1LastRound {
    index: number | null;
    finishAt: number | null;
    isFinished: boolean | null;
    numberOfTickets: number | null;
    lotteryStarted: boolean | null;
    winnersSelected: boolean | null;
  }

  type IAuctionV1Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
    prevRoundTicketsAmount: number | null;
    prevRoundDeposits: number | null;
    roundCounter: number | null;
    lastRound: IAuvtionV1LastRound | null;
  }

  type IAuctionV2Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    userDeposits: any;
    isParticipant: boolean;
    initialPrice: number | null;
    participantsStats: { amount: number, timestamp: number, isWinner: boolean, address: string }[];
  }

}
