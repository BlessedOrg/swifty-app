"use client";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { DepositModal } from "@/components/event/eventLottery/modals/DepositModal";
import { LotterySidebar } from "@/components/event/eventLottery/lotterySidebar/LotterySidebar";
import { LotteryContent } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { useSales } from "@/hooks/sales/useSales";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { ILotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { IAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { SellerTools } from "@/components/event/eventLottery/lotterySidebar/SellerTools";
import { SetRollPriceModal } from "@/components/event/eventLottery/modals/SetRollPriceModal";
import { SetupNewRoundModal } from "@/components/event/eventLottery/modals/SetupNewRoundModal";
import { SetRollToleranceModal } from "@/components/event/eventLottery/modals/SetRollToleranceModal";
import Confetti from "react-confetti";
import { useSaleNotifications } from "@/hooks/useSaleNotifications";
import { useCountdown } from "@/hooks/useCountdown";
import {useUserContext} from "@/store/UserContext";

type ISale = ILotteryV1 | ILotteryV2 | IAuctionV1 | IAuctionV2 | null;

export  const saleIdPerIdx = {
  0: "lotteryV1",
  1: "lotteryV2",
  2: "auctionV1",
  3: "auctionV2",
};
export const EventLottery = ({
  activePhase: phaseState,
  startDate,
  phasesState,
  updateActivePhase,
  updatePhaseState,
  eventData,
  isWindowExpanded,
  enabledPhases,
}) => {
  const activePhase = phaseState as IPhaseState;
  const { isLoggedIn: isConnected, walletAddress, userId, isLoading } = useUserContext();

  const isLotteryEnded = !phasesState?.filter((i) => !i.phaseState.isFinished)
    ?.length;
  // const isLotteryEnded = false;

  const getLotteryAddressPerActivePhase = {
    0: eventData?.lotteryV1contractAddr,
    1: eventData?.lotteryV2contractAddr,
    2: eventData?.auctionV1contractAddr,
    3: eventData?.auctionV2contractAddr,
  };

  const phaseIdPerSaleId = {
    lotteryV1: 0,
    lotteryV2: 1,
    auctionV1: 2,
    auctionV2: 3,
  };
  const activeLotteryAddress = useMemo(
    () => getLotteryAddressPerActivePhase?.[activePhase?.idx] || "",
    [activePhase?.idx]
  );
  const lotteryAddresses = {
    lotteryV1: eventData.lotteryV1contractAddr,
    lotteryV2: eventData.lotteryV2contractAddr,
    auctionV1: eventData.auctionV1contractAddr,
    auctionV2: eventData.auctionV2contractAddr,
  };

  const [currentViewId, setCurrentViewId] = useState<
    "lotteryV1" | "lotteryV2" | "auctionV1" | "auctionV2"
  >("lotteryV1");

  const currentTabSaleContractAddress =
    lotteryAddresses?.[currentViewId] || null;

  const nextSaleData = getNextAddressInfo(
    lotteryAddresses[currentViewId],
    lotteryAddresses
  );

  const {
    onDepositHandler,
    salesData,
    onMint,
    isTransactionLoading,
    onLotteryEnd,
    onTransferDepositsHandler,
    onLotteryStart: startLotteryHandler,
    onSellerWithdrawFundsHandler,
    transactionLoadingState,
    onSelectWinners,
  } = useSales(
    lotteryAddresses,
    currentTabSaleContractAddress,
    nextSaleData,
    eventData?.id
  );

  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isNewRoundModalOpen, setIsNewRoundModalOpen] = useState(false);
  const [isSetRollPriceModalOpen, setIsSetRollPriceModalOpen] = useState(false);
  const [isRollToleranceModalOpen, setIsRollToleranceModalOpen] =
    useState(false);
  const currentTabSaleData = (salesData?.[currentViewId] || null) as ISale;

  const userData = {
    balance: 0,
    username: shortenWalletAddress(walletAddress) || "User",
    avatar: "/images/profile.png",
    walletAddress,
    isLoggedIn: isConnected,
  };

  const onToggleDepositViewHandler = () => {
    setIsDepositModalOpen((prev) => !prev);
  };
  const onLotteryStart = () => {
    setIsLotteryActive(true);
  };
  const onToggleSetRollPriceModal = () => {
    setIsSetRollPriceModalOpen((prev) => !prev);
  };
  const onToggleSetNewRoundModal = () => {
    setIsNewRoundModalOpen((prev) => !prev);
  };
  const updateCurrentViewId = (id: number) => {
    const idName = saleIdPerIdx[id];
    setCurrentViewId(idName);
  };
  const onToggleRoleToleranceModal = () => {
    setIsRollToleranceModalOpen((prev) => !prev);
  };

  useCountdown(startDate, onLotteryStart, isLotteryActive);
  const isCurrentTabSaleEnded =
    currentTabSaleData?.saleData?.lotteryState === "ENDED";

  const userWonInLottery = !!(
    salesData.lotteryV1.saleData?.isWinner && currentViewId === "lotteryV2"
  );
  const userWonInAuction = !!(
    salesData.auctionV1.saleData?.isWinner && currentViewId === "auctionV2"
  );
  const disableDepositDueToPrevWin =
    userWonInLottery || userWonInAuction || false;

  const currentViewPhaseState = phasesState?.find(
    (i) => i.idx === phaseIdPerSaleId[currentViewId]
  ) as IPhaseState | null;

  const isMintEnabled =
    !currentTabSaleData?.saleData?.hasMinted &&
    !!currentTabSaleData?.saleData?.isWinner;

  const isSeller = isConnected && userId === eventData.sellerId;

  const isDepositEnabled =
    !isLotteryEnded &&
    isConnected &&
    !disableDepositDueToPrevWin &&
    ((!isCurrentTabSaleEnded &&
      !!currentTabSaleData?.saleData?.isLotteryStarted) ||
      (currentViewId === "auctionV1" &&
        !!salesData?.auctionV1.saleData?.lastRound?.numberOfTickets));

  const { currentSaleState } = useSaleNotifications(
    currentTabSaleData?.saleData,
    currentViewId
  );

  const isCurrentPhaseSaleEnd = isLotteryEnded || phasesState?.find(i => i?.idx === phaseIdPerSaleId[currentViewId])?.phaseState.isFinished;
  return (
    <Flex
      justifyContent={"center"}
      width="100%"
      maxW={"1250px"}
      gap={0}
      my={{ base: isWindowExpanded ? 2 : 0, iw: isWindowExpanded ? 10 : 0 }}
      h={
        isWindowExpanded
          ? { base: "fit-content", iwMid: "fit-content", iw: "600px" }
          : 0
      }
      maxHeight={"90vh"}
      overflow={"hidden"}
      transition={"all 350ms"}
      pos={"relative"}
    >
      {currentSaleState?.showConfetti && (
        <Confetti width={1200} height={650} tweenDuration={5000} />
      )}
      <Flex
        w={"100%"}
        color={"#fff"}
        rounded={"8px"}
        gap={4}
        flexDirection={{ base: "column-reverse", iw: "row" }}
      >
        <LotterySidebar
          onToggleDepositViewHandler={onToggleDepositViewHandler}
          userData={userData}
          activeSaleData={currentTabSaleData?.saleData}
          isConnected={isConnected}
          mintEnabled={isMintEnabled}
          depositEnabled={isDepositEnabled}
          isLotteryEnded={isLotteryEnded}
          isCurrentTabSaleEnded={isCurrentTabSaleEnded}
          onMint={onMint}
          currentSelectedTabId={currentViewId}
          userWonInPrevSale={disableDepositDueToPrevWin}
          isSeller={isSeller}
        >
          <SellerTools
              functions={{
                onLotteryStart: startLotteryHandler,
                onSelectWinners: onSelectWinners,
                onLotteryEnd,
                onTransferDepositsHandler,
                onSellerWithdrawFundsHandler,
                onSetRollPrice: onToggleSetRollPriceModal,
                onSetupNewRound: onToggleSetNewRoundModal,
                onToggleRoleToleranceModal,
                endLv1: salesData?.lotteryV1.onLotteryEnd,
                endAv1: salesData?.auctionV1.onLotteryEnd,
              }}
              currentViewId={currentViewId}
              activeSaleData={currentTabSaleData?.saleData}
          />
        </LotterySidebar>

        <LotteryContent
          disabledPhases={false}
          startDate={startDate}
          salesData={salesData}
          activePhase={activePhase}
          setActivePhase={updateActivePhase}
          setPhasesState={updatePhaseState}
          isLotteryEnded={isLotteryEnded}
          eventData={eventData}
          phasesState={phasesState}
          isLotteryActive={isLotteryActive}
          updateCurrentViewId={updateCurrentViewId}
          isSeller={isSeller}
          isDepositModalOpen={isDepositModalOpen}
          isWindowExpanded={isWindowExpanded}
          currentTabId={currentViewId}
          enabledPhases={enabledPhases}
          onMint={onMint}
          hasMinted={!!currentTabSaleData?.saleData?.hasMinted}
        />
        <LoadingModal
          transactionLoadingState={transactionLoadingState}
          isOpen={isTransactionLoading}
          onClose={() => {}}
          title={"Transaction is pending"}
          description={
            <>
              Please do not close this window. <br /> Transactions are pending.
            </>
          }
        />
        {/*Modals*/}
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={onToggleDepositViewHandler}
          onDepositHandler={onDepositHandler}
          defaultValue={userData?.balance}
          eventData={eventData}
          currentTabSaleData={currentTabSaleData?.saleData}
          currentTabId={currentViewId}
          userData={userData}
        />
        <SetRollPriceModal
          isOpen={isSetRollPriceModalOpen}
          onClose={onToggleSetRollPriceModal}
          onSetRollPrice={salesData?.lotteryV2.onSetRollPrice}
        />

        <SetRollToleranceModal
          isOpen={isRollToleranceModalOpen}
          onClose={onToggleRoleToleranceModal}
          onSetRollTolerance={salesData?.lotteryV2.onSetRollTolerance}
        />
        <SetupNewRoundModal
          isOpen={isNewRoundModalOpen}
          onClose={() => setIsNewRoundModalOpen(false)}
          onSetupNewRound={salesData?.auctionV1.onSetupNewRound}
        />
      </Flex>
    </Flex>
  );
};

function getNextAddressInfo(
  currentAddress: string,
  lotteryAddresses
): { id: string; address: string } | null {
  const keys = Object.keys(lotteryAddresses);
  const currentIndex = keys.findIndex(
    (key) => lotteryAddresses[key] === currentAddress
  );
  if (currentIndex === -1 || currentIndex === keys.length - 1) {
    return null;
  } else {
    const nextKey = keys[currentIndex + 1];
    const nextAddress = lotteryAddresses[nextKey];
    return { address: nextAddress, id: nextKey };
  }
}
