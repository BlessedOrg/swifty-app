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
import { ILotteryV1Data } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2Data } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1Data } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2Data } from "@/hooks/sales/useAuctionV2";

export interface ILotteryView {
  lotteryData: any;
  activePhase: IPhaseState | null;
  toggleFlipView: () => void;
}

interface IProps {
  disabledPhases?: boolean;
  startDate: number | Date;
  showWalletConnect: boolean;
  salesData:
    | {
        lotteryV1: {
          saleData: ILotteryV1Data | null;
        };
        lotteryV2: {
          saleData: ILotteryV2Data | null;
        };
        auctionV1: {
          saleData: IAuctionV1Data | null;
        };
        auctionV2: {
          saleData: IAuctionV2Data | null;
        };
      }
    | undefined;
  activePhase: IPhaseState | null;
  phasesState: IPhaseState[] | null;
  setActivePhase: any;
  setPhasesState: any;
  isLotteryEnded: boolean;
  eventData: IEvent;
  isLotteryActive: boolean;
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
}: IProps) => {
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
    0: (
      <Lottery1 {...commonProps} lotteryData={salesData?.lotteryV1.saleData} />
    ),
    1: (
      <Lottery2 {...commonProps} lotteryData={salesData?.lotteryV2.saleData} />
    ),
    2: (
      <Auction1 {...commonProps} lotteryData={salesData?.auctionV1.saleData} />
    ),
    3: (
      <Auction2 {...commonProps} lotteryData={salesData?.auctionV2.saleData} />
    ),
  };

  useEffect(() => {
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

    // if (isLotteryEnded) {
    //   setShowFront(false);
    // }
  }, [activePhase, isLotteryEnded]);

  useEffect(() => {
    if (!!activePhase) {
      if (activePhase.idx !== tabIndex) {
        setTabIndex(activePhase.idx);
      }
    } else if(isLotteryEnded){
      setTabIndex(3)
    }
  }, [activePhase]);
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
    >
      <Tabs
        variant={"unstyled"}
        onChange={(index) => setTabIndex(index)}
        index={tabIndex}
      >
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
            />
          )}
        </TabList>
        <TabPanels>
          {Array.from({ length: 4 }, (_, idx) => {
            return (
              <TabPanel key={idx}>
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
