"use client";
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ConnectEmbed } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Lottery1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery1";
import { Lottery2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery2";
import { Auction1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Auction1";
import { Auction2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/Auction2";
import { LotteryCooldownView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/LotteryCooldownView";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { LotterySlider } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotterySlider/LotterySlider";
import { ILotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";

export interface ILotteryView {
  activePhase: IPhaseState | null;
  toggleFlipView: () => void;
}

interface IProps {
  disabledPhases?: boolean;
  startDate: number | Date;
  showWalletConnect: boolean;
  salesData: {
    lotteryV1: ILotteryV1;
    lotteryV2: ILotteryV2;
    auctionV1: IAuctionV1;
    auctionV2: IAuctionV2;
  };
  activePhase: IPhaseState | null;
  phasesState: IPhaseState[] | null;
  setActivePhase: any;
  setPhasesState: any;
  isLotteryEnded: boolean;
  eventData: IEvent;
  isLotteryActive: boolean;
  updateCurrentViewId: (e: number) => void;
  isSeller?: boolean;
}

export const LotteryContent = ({
  disabledPhases,
  startDate,
  showWalletConnect,
  salesData,
  activePhase,
  phasesState,
  setActivePhase,
  setPhasesState,
  isLotteryEnded,
  eventData,
  isLotteryActive,
  updateCurrentViewId,
  isSeller,
}: IProps) => {
  const [userManuallyChangedTab, setUserManuallyChangedTab] = useState(false);
  const [tabIndex, setTabIndex] = useState(activePhase?.idx || 0);
  const [showFront, setShowFront] = useState(true);
  const toggleFlipView = () => {
    setShowFront((prev) => !prev);
  };
  const commonProps = {
    activePhase,
    toggleFlipView,
  };

  const phaseViews = {
    0: <Lottery1 {...commonProps} {...salesData?.lotteryV1} />,
    1: <Lottery2 {...commonProps} {...salesData?.lotteryV2} />,
    2: <Auction1 {...commonProps} {...salesData?.auctionV1} />,
    3: <Auction2 {...commonProps} {...salesData?.auctionV2} />,
  };

  useEffect(() => {
    if (userManuallyChangedTab && !showFront) {
      setShowFront(true);
    }
    if (!userManuallyChangedTab) {
      if (!activePhase && !isLotteryEnded) {
        setShowFront(true);
      }
      if (!isLotteryEnded && activePhase) {
        if (activePhase?.phaseState?.isCooldown && showFront) {
          setShowFront(false);
        } else if (!activePhase?.phaseState?.isCooldown && !showFront) {
          setShowFront(true);
        }
      }
    }
  }, [activePhase, isLotteryEnded, userManuallyChangedTab]);

  useEffect(() => {
    if (!!activePhase) {
      if (activePhase.idx !== tabIndex && !userManuallyChangedTab) {
        updateCurrentViewId(activePhase.idx);
        setTabIndex(activePhase.idx);
      }
    } else if (isLotteryEnded) {
      updateCurrentViewId(3);
      setTabIndex(3);
    }
  }, [activePhase]);

  //reactive auto tab switching
  useEffect(() => {
    if (userManuallyChangedTab && activePhase?.idx === tabIndex) {
      setUserManuallyChangedTab(false);
    }
  }, [activePhase, tabIndex]);

  const onTabChange = (idx) => {
    setUserManuallyChangedTab(true);
    updateCurrentViewId(idx);
    setTabIndex(idx);
  };
  return (
    <Flex
      flexDirection={"column"}
      w={"100%"}
      h={"100%"}
      gap={10}
      bg={"#fff"}
      p={4}
      rounded={"8px"}
      alignItems={"center"}
      overflow="hidden"
    >
      <Tabs variant={"unstyled"} onChange={onTabChange} index={tabIndex}>
        <TabList>
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
            />
          )}
        </TabList>
        <TabPanels>
          {Array.from({ length: 4 }, (_, idx) => {
            return (
              <TabPanel key={idx} >
                {showWalletConnect && (
                  <Flex justifyContent={"center"} w={"100%"}>
                    <ConnectEmbed theme={"light"} />
                  </Flex>
                )}

                {!showWalletConnect && (
                  <FlippableCard
                    gap={4}
                    justifyContent={"center"}
                    alignItems={"center"}
                    w={"100%"}
                    maxW={"856px"}
                    showFront={showFront}
                    front={<>{phaseViews[idx]}</>}
                    zIndex={"100000000000000"}
                    back={
                      !!phasesState?.find((phase) => phase?.idx === idx)
                        ?.phaseState?.isCooldown ? (
                        <LotteryCooldownView
                          eventData={eventData}
                          isLotteryActive={isLotteryActive}
                          activePhase={activePhase}
                        />
                      ) : (
                        <LotterySlider
                          eventData={eventData}
                          toggleFlipView={toggleFlipView}
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
    </Flex>
  );
};
