"use client";
import {
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
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
import { EventMarketplace } from "@/components/event/eventMarketplace/EventMarketplace";
import { LotteryPhaseButton } from "./LotteryPhaseButton";
import { LotterySinglePhaseButton } from "./LotterySinglePhaseButton";
import { SaleViewWrapper } from "./lotteryViews/phases/SaleViewWrapper";
import { client } from "lib/client";
import { generatePayload, isLoggedIn, login, logout } from "@/server/auth";
import { useUser } from "@/hooks/useUser";
import { ConnectEmbed } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { mutate as swrMutate } from "swr";

export interface ILotteryView {
  activePhase: IPhaseState | null;
  toggleFlipView: () => void;
  hideFront: boolean;
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
  isDepositModalOpen?: boolean;
  isWindowExpanded?: boolean;
  currentTabId: string;
  allPhasesEnabled: IEvent["lotteryV1settings"][];
  singleTabEnabledData: IEvent["lotteryV1settings"];
  singleTabEnabledIdx: number;
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
  currentTabId,
  isSeller,
  isDepositModalOpen,
  isWindowExpanded,
  allPhasesEnabled,
  singleTabEnabledData,
  singleTabEnabledIdx,
}: IProps) => {
  const { walletAddress, mutate } = useUser();
  const [useManuallyFlipedView, setUseManuallyFlipedView] = useState(false);
  const [userManuallyChangedTab, setUserManuallyChangedTab] = useState(false);
  const [tabIndex, setTabIndex] = useState(activePhase?.idx || 0);
  const [showFront, setShowFront] = useState(true);
  const toggleFlipView = () => {
    setShowFront((prev) => !prev);
    setUseManuallyFlipedView((prev) => !prev);
  };

  const commonProps = {
    activePhase,
    toggleFlipView,
  };

  const phaseViews = {
    0: (props: any) => (
      <Lottery1 {...commonProps} {...salesData?.lotteryV1} {...props} />
    ),
    1: (props: any) => (
      <Lottery2 {...commonProps} {...salesData?.lotteryV2} {...props} />
    ),
    2: (props: any) => (
      <Auction1 {...commonProps} {...salesData?.auctionV1} {...props} />
    ),
    3: (props: any) => (
      <Auction2 {...commonProps} {...salesData?.auctionV2} {...props} />
    ),
  };

  useEffect(() => {
    if (isWindowExpanded) {
      if (userManuallyChangedTab && !showFront && !useManuallyFlipedView) {
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
    }
  }, [activePhase, isLotteryEnded, userManuallyChangedTab, isWindowExpanded]);

  useEffect(() => {
    if (!!activePhase) {
      if (
        activePhase.idx !== tabIndex &&
        !userManuallyChangedTab &&
        !isDepositModalOpen
      ) {
        if (allPhasesEnabled) {
          updateCurrentViewId(activePhase.idx);
          setTabIndex(activePhase.idx);
        } else {
          updateCurrentViewId(singleTabEnabledIdx);
          setTabIndex(singleTabEnabledIdx);
        }
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
    if (!showFront) {
      setShowFront(true);
    }
    setUserManuallyChangedTab(true);
    updateCurrentViewId(idx);
    setTabIndex(idx);
  };
  const showMarketplaceView = false;
  const isWinner = salesData[currentTabId]?.saleData?.isWinner && isLoggedIn;

  const titlePerPhase = {
    0: "Royal Arena",
    1: "Click Clacs",
    2: "Fair Bids",
    3: "Battle Royal",
  };
  const endTitle = titlePerPhase?.[singleTabEnabledIdx] || titlePerPhase[0];
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
          onChange={onTabChange}
          index={tabIndex}
          w={{ base: "100%", iwLg: allPhasesEnabled ? "auto" : "100%" }}
        >
          <TabList
            overflowX={"auto"}
            maxW={"100%"}
            w={"100%"}
            justifyContent={!allPhasesEnabled ? "center" : "initial"}
          >
            {!!eventData && allPhasesEnabled && (
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
              />
            )}
            {!!eventData && !allPhasesEnabled && (
              <LotterySinglePhaseButton
                startDate={startDate}
                durationTime={
                  60000 * (singleTabEnabledData?.phaseDuration || 10)
                }
                isWindowExpanded={isWindowExpanded}
                COOLDOWN_TIME_IN_MILISEC={
                  (eventData.cooldownTimeSeconds || 60) * 1000
                }
                title={activePhase?.title || ""}
                disabledPhases={false}
                idx={0}
                setPhasesState={setPhasesState}
                setActivePhase={setActivePhase}
              />
            )}
          </TabList>
          <TabPanels
            height={{ base: "260px", iwMid: "470px" }}
            maxHeight={{ base: "100%", iwMid: "unset" }}
            overflowY={{ base: "auto", iwMid: "unset" }}
          >
            {Array.from({ length: 4 }, (_, idx) => {
              const isCooldownView = !!phasesState?.find(
                (phase) => phase?.idx === idx
              )?.phaseState?.isCooldown;
              return (
                <TabPanel
                  key={idx}
                  px={{ base: 0, iwMid: "initial" }}
                  py={{ base: 1, iwMid: 2 }}
                >
                  {showWalletConnect && (
                    <Flex justifyContent={"center"} w={"100%"}>
                      <ConnectEmbed
                        modalSize="wide"
                        theme={"dark"}
                        client={client}
                        wallets={[createWallet("io.metamask")]}
                        //@ts-ignore
                        auth={{
                          isLoggedIn: async (address) => {
                            console.log("Checking if logged in for: ", {
                              address,
                            });
                            const res = await isLoggedIn(address);
                            console.log("Login status - ", res);
                            await swrMutate(
                              "/api/user/getUserData",
                              {},
                              { revalidate: true }
                            );
                            await mutate();
                            return res;
                          },
                          doLogin: async (params) => {
                            console.log("Do Login with params - ", params);
                            await login(params);
                          },
                          getLoginPayload: async ({ address }) =>
                            generatePayload({ address }),
                          doLogout: async () => {
                            console.log("logging out!");
                            await logout(walletAddress);
                          },
                        }}
                      />
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
                      front={
                        <>
                          {allPhasesEnabled
                            ? phaseViews[idx]({ hideFront: isCooldownView })
                            : !allPhasesEnabled &&
                              !activePhase?.phaseState?.isFinished &&
                              !isWinner &&
                              !activePhase?.phaseState?.isFinished &&
                              phaseViews[singleTabEnabledIdx]({
                                hideFront: isCooldownView,
                              })}{" "}
                          {!allPhasesEnabled &&
                            (!!activePhase?.phaseState?.isFinished ||
                              isWinner) && (
                              <SaleViewWrapper
                                id="endView"
                                toggleFlipView={toggleFlipView}
                                height={"100%"}
                                borderColor={"#06F881"}
                                color={"#000"}
                                justifyContent={"center"}
                                withoutBreak
                                alignItems={"center"}
                              >
                                <Text
                                  fontWeight={"bold"}
                                  fontSize={{ base: "0.9rem", iw: "1.3rem" }}
                                  textAlign={"center"}
                                >
                                  {isWinner ? (
                                    <>
                                      You win! Congrats 🎉 <br />
                                    </>
                                  ) : (
                                    <>
                                      {singleTabEnabledIdx === 0 ? (
                                        <>
                                          "{endTitle}" Phase Completed The fair
                                          lottery phase, "{endTitle}" has now
                                          concluded. <br />
                                          <br />
                                          You can now withdraw your deposited
                                          funds. But don{"’"}t worry, there{"’"}
                                          s still a chance to join in the fun!
                                          Next up is the {titlePerPhase[1]},
                                          where you can place your bids to
                                          secure tickets.
                                          <br />
                                          To participate in the{" "}
                                          {titlePerPhase[1]}, simply head over
                                          to our homepage and select the event.
                                        </>
                                      ) : (
                                        <>
                                          {endTitle} Phase Completed The fair
                                          auction phase, "{endTitle}" has now
                                          concluded. <br />
                                          <br />
                                          You can now withdraw your deposited
                                          funds.{" "}
                                        </>
                                      )}
                                    </>
                                  )}
                                </Text>
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
                            withdrawView={!allPhasesEnabled}
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
