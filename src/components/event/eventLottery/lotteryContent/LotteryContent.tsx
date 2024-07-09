"use client";
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { useEffect, useState } from "react";
import { Lottery1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery1";
import { Lottery2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery2";
import { Auction1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Auction1";
import { Auction2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/Auction2";
import { LotteryCooldownView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/LotteryCooldownView";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { LotterySlider } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotterySlider/LotterySlider";
import { EventMarketplace } from "@/components/event/eventMarketplace/EventMarketplace";
import { SaleViewWrapper } from "./lotteryViews/phases/SaleViewWrapper";
import { LoginButton } from "@/components/navigation/LoginButton";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useUserContext } from "@/store/UserContext";
import { LotteryEndView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/LotteryEndView";
import { saleIdPerIdx } from "@/components/event/eventLottery/EventLottery";

export interface ILotteryView {
  activePhase: IPhaseState | null;
  toggleFlipView: () => void;
  hideFront: boolean;
}

interface IProps {
  disabledPhases?: boolean;
  startDate: number | Date;
  salesData: ISaleData;
  activePhase: IPhaseState | null;
  phasesState: IPhaseState[] | null;
  setActivePhase: any;
  setPhasesState: any;
  isLotteryEnded: boolean;
  eventData: IEvent;
  isLotteryActive: boolean;
  updateCurrentViewId: (e: number) => void;
  isSeller?: boolean;
  isDepositModalOpen?: boolean;
  isWindowExpanded?: boolean;
  currentTabId: string;
  enabledPhases: (IEvent["lotteryV1settings"] & {
    idx: number;
    id: "lotteryV1" | "lotteryV2" | "auctionV1" | "auctionV2";
  })[];
  onMint: any;
  hasMinted: boolean;
}

export const LotteryContent = ({
  disabledPhases,
  startDate,
  salesData,
  activePhase,
  phasesState,
  setActivePhase,
  setPhasesState,
  isLotteryEnded,
  eventData,
  isLotteryActive,
  updateCurrentViewId,
  currentTabId,
  isSeller,
  isDepositModalOpen,
  isWindowExpanded,
  enabledPhases,
  onMint,
  hasMinted,
}: IProps) => {
  const { walletAddress, mutate, isLoading, isLoggedIn, differentAccounts } = useUserContext();
  const [userManuallyChangedTab, setUserManuallyChangedTab] = useState(false);
  const [tabIndex, setTabIndex] = useState(activePhase?.idx || 0);
  const [showFront, setShowFront] = useState<boolean | null>(true);
  const toggleFlipView = () => {
    if (typeof showFront === "boolean") {
      setShowFront((prev) => !prev);
    }
  };

  const commonProps = {
    activePhase,
    toggleFlipView,
  };

  const phaseViewsTable = enabledPhases.map((phase, idx) => {
    if (phase.id === "lotteryV1") {
      return (props: any) => (
        <Lottery1 {...commonProps} {...salesData?.lotteryV1} {...props} />
      );
    } else if (phase.id === "lotteryV2") {
      return (props: any) => (
        <Lottery2 {...commonProps} {...salesData?.lotteryV2} {...props} />
      );
    } else if (phase.id === "auctionV1") {
      return (props: any) => (
        <Auction1 {...commonProps} {...salesData?.auctionV1} {...props} />
      );
    } else if (phase.id === "auctionV2") {
      return (props: any) => (
        <Auction2 {...commonProps} {...salesData?.auctionV2} {...props} />
      );
    }
  });
  const phaseViewsObject = phaseViewsTable.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
  useEffect(() => {
    if (isWindowExpanded) {
      if (activePhase) {
        setTabIndex(activePhase.idx);
      }
    }
  }, []);

  useEffect(() => {
    if (isWindowExpanded && isLoggedIn) {
      const isCurrentPhaseView = activePhase?.idx === tabIndex;
      const isCurrentPhaseCooldown =
        activePhase?.phaseState?.isCooldown &&
        activePhase?.phaseState?.isActive;

      if (isCurrentPhaseView && !isCurrentPhaseCooldown && !showFront) {
        setShowFront(true);
      }
      if (isCurrentPhaseView && isCurrentPhaseCooldown && showFront) {
        setShowFront(false);
      }
    }
  }, [
    activePhase,
    isLotteryEnded,
    userManuallyChangedTab,
    isWindowExpanded,
    tabIndex,
    isLoggedIn,
  ]);

  useEffect(() => {
    if (!!activePhase) {
      if (
        (activePhase.idx !== tabIndex &&
          !userManuallyChangedTab &&
          !isDepositModalOpen) ||
        saleIdPerIdx[activePhase?.id] !== currentTabId
      ) {
        updateCurrentViewId(activePhase.id);
        setTabIndex(activePhase.idx);
      }
    } else if (isLotteryEnded) {
      updateCurrentViewId(enabledPhases.length - 1);
      setTabIndex(enabledPhases.length - 1);
    }
  }, [activePhase, isLoggedIn]);

  //reactive auto tab switching
  useEffect(() => {
    if (userManuallyChangedTab && activePhase?.idx === tabIndex) {
      setUserManuallyChangedTab(false);
    }
  }, [activePhase, tabIndex]);

  const onTabChange = (idx, id) => {
    const isCurrentPhaseView = activePhase?.idx === idx;
    const isCurrentPhaseCooldown = activePhase?.phaseState?.isCooldown;
    const isCurrentPhaseActive = activePhase?.phaseState.isActive;
    const protectCurrentPhaseMainView =
      isCurrentPhaseView &&
      (isCurrentPhaseCooldown || !isCurrentPhaseActive) &&
      !isSeller;

    if (!showFront && !protectCurrentPhaseMainView) {
      setShowFront(true);
    }
    if (!protectCurrentPhaseMainView) {
      setUserManuallyChangedTab(true);
    }
    updateCurrentViewId(id);
    setTabIndex(idx);
  };
  const showMarketplaceView = false;
  const isWinner = salesData[currentTabId]?.saleData?.isWinner && isLoggedIn && !differentAccounts;

  return (
    <Flex
      flexDirection={"column"}
      w={"100%"}
      h={{ base: "auto", iwMid: "100%" }}
      gap={10}
      bg={"#fff"}
      py={{ base: 2, iwMid: 4 }}
      px={{ base: 1, iwMid: 4 }}
      minH={{ base: "334px", iwMid: "none" }}
      rounded={"1rem"}
      alignItems={"center"}
      overflow="hidden"
    >
      {showMarketplaceView && <EventMarketplace eventData={eventData} />}
      {!showMarketplaceView && (
        <Tabs
          variant={"unstyled"}
          index={tabIndex}
          w={{ base: "100%", iwLg: "100%" }}
        >
          <TabList
            overflowX={"auto"}
            maxW={"100%"}
            w={"100%"}
            justifyContent={"center"}
          >
            {!!eventData && (
              <LotteryPhases
                disabledPhases={disabledPhases}
                startDate={startDate}
                setActivePhase={setActivePhase}
                setPhasesState={setPhasesState}
                phasesState={phasesState}
                activePhase={activePhase}
                eventData={eventData}
                singleTiles={true}
                isSeller={isSeller}
                currentTabPhaseIdx={tabIndex}
                isWindowExpanded={isWindowExpanded}
                onTabChange={onTabChange}
                salesData={salesData}
              />
            )}
          </TabList>
          <TabPanels
            height={{ base: "260px", iwMid: "470px" }}
            maxHeight={{ base: "100%", iwMid: "unset" }}
            overflowY={{ base: "auto", iwMid: "unset" }}
          >
            {enabledPhases.map((enabledPhase, idx) => {
              const isCooldownView = !!phasesState?.find(
                (phase) => phase?.idx === idx,
              )?.phaseState?.isCooldown;

              return (
                <TabPanel
                  key={idx}
                  px={{ base: 0, iwMid: "initial" }}
                  py={{ base: 1, iwMid: 2 }}
                  h={"100%"}
                >
                  {isLoading && (
                    <Flex
                      h={"100%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <LoadingDots />
                    </Flex>
                  )}
                  {!isLoggedIn && (
                    <Flex
                      justifyContent={"center"}
                      w={"100%"}
                      alignItems={"center"}
                      h={"100%"}
                    >
                      <LoginButton />
                    </Flex>
                  )}

                  {!isLoading && isLoggedIn && (
                    <FlippableCard
                      gap={4}
                      justifyContent={"center"}
                      alignItems={"center"}
                      w={"100%"}
                      maxW={"856px"}
                      showFront={!!showFront}
                      front={
                        <>
                          {!isWinner &&
                            !isLotteryEnded &&
                            phaseViewsObject[idx]({
                              hideFront: isCooldownView,
                            })}{" "}
                          {(isLotteryEnded || isWinner) && (
                            <SaleViewWrapper
                              id="endView"
                              toggleFlipView={toggleFlipView}
                              borderColor={"#06F881"}
                              color={"#000"}
                              justifyContent={"center"}
                              withoutBreak
                              alignItems={"center"}
                            >
                              <LotteryEndView
                                isWinner={isWinner}
                                onMint={onMint}
                                hasMinted={hasMinted}
                              />
                            </SaleViewWrapper>
                          )}
                        </>
                      }
                      zIndex={8}
                      back={
                        isCooldownView ? (
                          <LotteryCooldownView
                            eventData={eventData}
                            isLotteryActive={isLotteryActive}
                            activePhase={activePhase}
                            currentTabId={currentTabId}
                            withdrawView={isLotteryEnded}
                          />
                        ) : (
                          <LotterySlider
                            eventData={eventData}
                            toggleFlipView={toggleFlipView}
                            currentTabId={currentTabId}
                          />
                        )
                      }
                    />
                  )}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      )}
    </Flex>
  );
};
