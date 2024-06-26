export {};
declare global {

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
    lotteryState?: "ACTIVE" | "ENDED" | "NOT_STARTED"
  }
  interface ILotteryV1Data extends ICommonSaleData {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;

  }
  interface ILotteryV2Data extends ICommonSaleData {
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
  }

  interface IAuvtionV1LastRound {
    index: number | null;
    finishAt: number | null;
    isFinished: boolean | null;
    numberOfTickets: number | null;
    lotteryStarted: boolean | null;
    winnersSelected: boolean | null;
  }

  interface IAuctionV1Data extends ICommonSaleData {
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

  interface IAuctionV2Data extends ICommonSaleData {
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
